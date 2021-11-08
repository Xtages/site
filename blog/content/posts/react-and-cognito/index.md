---
title: "React and Cognito"
date: 2021-11-05T19:10:09-07:00
tags: ['react', 'aws', 'cognito', 'terraform']
featured_image: feature.jpg
featured_image_alt_text: FIXME
author: czuniga
---


At [Xtages](https://www.xtages.com), we use [Amazon Cognito](https://aws.amazon.com/cognito/) to manager our users and
their authentication.

Cognito collects a user's attributes and enables simple, secure user authentication, authorization and user management
for web and mobile apps.

Next, we will see how we integrated Cognito into our console React web app.

<div class="alert alert-outline-warning" role="alert">
  Later on in this post, we'll also see how to create Cognito resources using
  <a href="https://www.terraform.io/" rel="noopener noreferrer">Terraform</a>.
</div>

# Integration with React

We can use Cognito to secure certain sections of our React app, making sure that only authenticated users have access to
them.

<div class="alert alert-outline-danger" role="alert">
  You should make sure that your server-side API is appropriately checking
  that requests made to it are correctly authenticated and authorized.
  With Cognito, when a user authenticates, we get a <a href="https://jwt.io/" rel="noopener noreferrer">JWT</a>
  token that should be passed on to your server or API. We will not get into
  the details of a proper server API implementation in this article as it is highly depending
  on the technology used for your server.
</div>

## Setup

We'll start by creating a new React web app using [`create-react-app`](https://create-react-app.dev):

```bash
npx create-react-app demo-app --template typescript
```

## `useAuth` hook

The core piece of this integration is the `useAuth` hook which is based on https://usehooks.com/useAuth/
and adapted to use Cognito's API.

After installing the Cognito API package from Amazon, and the `use-async-effect` package

```bash
npm install --save @aws-amplify/auth use-async-effect
```

we'll go ahead and create a new file for our `useAuth` hook under `src/hooks/` and we'll call it `useAuth.tsx`.

Next, we'll configure the Cognito Auth object with the AWS Region, Cognito User Pool Id and Cognito Web Client Id. You
can see these values are being included
from [environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables), so it's easy to
configure our app depending on where it runs (local development, continuous integration, staging, production, etc.).

{{< gist czuniga-xtages 831ad1007fbabfd4ea8925749dd59b4f "useAuth.tsx" >}}

Now let's create some types for our hook's API:

{{< gist czuniga-xtages 77be3d87a5b752d98f5345535f6bce7b "useAuth.tsx" >}}

The `User` type has the properties we expect for a user. The `User.country` property is an example of a
[Cognito custom attribute](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-custom-attributes)
.

The `Credentials` type will be used in our `logIn` and `signUp` functions.

Notably the `CognitoUserWithChallenge` is a bit of a crutch that we need, to make the Typescript compiler happy. The
object returned by the `CognitoAuth.signIn` function (from the `amazon-cognito-identity-js` package)
can contain a property called `challengeName` however in the typings for the `CognitoAuth.signIn` that property is not
present therefore we have to supplement the type in our code. The `challengeName` property is used to convey that the
user needs to respond to a challenge to verify their identity. So for example when the user signs up they are emailed a
code that they must input as a challenge response. For more information
see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html

Finally, we'll get to the implementation of our hook. In reality, we have a private hook `useProvideAuth` and
a [`Context`](https://reactjs.org/docs/context.html) and all are exposed through the public `useAuth` hook.

First, we'll dissect the `useProvideAuth` private hook which has the bulk of the code:

{{< gist czuniga-xtages e1d1bfa865e2c3b94c79d5f4fc0c9a38 "useAuth.tsx" >}}

The `useProvideAuth` hook has three public functions:

* `logIn`: wraps `CognitoAuth.signIn` and if the result of the call has a `challengeName` returns that, otherwise
  converts the returned `CognitoUser` sets the `user` state and also toggles the `authInProgress` state to false.
* `logOut`: sets the `user` state to `null` and calls `CognitoAuth.signOut` to invalidate the user's token.
* `signUp`: calls `CognitoAuth.signUp` with the required user attributes plus their password.

A couple of other interesting points about this hook is the use of `useAsyncEffect` (from the `use-async-effect`
package) which has the same semantics of plain `useEffect` but allows for using `async` functions. We need this hook
because we determine, on render, if the user is logged in by calling the `getUser` function which in itself is
`async`. We also set a listener through the AWS `Hub` class which will notify us of different auth-related events that
have occurred.

Now that our hook is ready, we'll go ahead and set up a `Context` so our app can take advantage of this infrastructure:

{{< gist czuniga-xtages a34426017028277ae5496f5c2c863dcd "useAuth.tsx" >}}

In the snippet above, we create a `Context` of type `Auth | null`, where `Auth` is `ReturnType<typeof useProvideAuth>`,
we also created a tiny component `<AuthProvider>` which passes an instance of `Auth` to the `<AuthContext.Provider>`.
Finally `useAuth` wraps `useContext(AuthContext)` and ensures that the returned `Auth` is never `null`.

## Usage

After having the auth infrastructure in place, we now need to start using in our app, the first step is to wrap our
component hierarchy in an `<AuthProvider>`, like such:

{{< gist czuniga-xtages d911d1cd98c3d4e9032d91998d3b6176 "App.tsx" >}}

You'll notice a few points in the snippet above:

* we are using `react-router-dom` for our navigation.
* we have wrapped our app in the `<AuthProvider>` that we just created, which means that the `useAuth` hook is now
  usable to all our components.
* we have a couple of utility route components that are not part of `react-router-dom`,
  namely `<UnauthenticatedOnlyRoute>` and `<AuthenticatedRoute>`.

### Secure routing

Below, `<AuthenticatedRoute>` is using `useAuth` to determine if the authentication is in progress (and if so display
and empty page), if we have an authenticated user we then route to the specified component and if we don't have an
authenticated user then we redirect to the `/login` page, preserving the `location` in the state, so we can redirect to
it once the user successfully logs in.

{{< gist czuniga-xtages e5087dde03b9a358712bd3842fb335c8 "AuthenticatedRoute.tsx" >}}

[`<UnauthenticatedOnlyRoute>`](https://github.com/Xtages/demo-react-cognito/blob/main/demo-app/src/components/authn/UnauthenticatedOnlyRoute.tsx)
is basically a mirror of `<AuthenticatedRoute>` in that it will only render the `Route` if the user is **not
authenticated**, redirecting to `/` otherwise.

### Login page

The following is a very simple log-in page, for illustration purposes only, using the `useAuth` hook, although you'll
probably want to use a proper react form library and may be some kind of UI library too.

{{< gist czuniga-xtages 32e829c1aa3dedc3614a996c8447488f "LoginPage.tsx" >}}

# Using Terraform to provision Cognito

The following Terraform module was used to provision the
Cognito [user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
used in this blog post:

{{< gist czuniga-xtages 0cdce08fa5237a8cc93c3fde712d18d8 "cognito.tf" >}}

Some interesting sections of this module:

* Lines 24-34: The `password_policy` block is where we configure the requirements of a valid password. As a tip for
  better UX, make sure that your signup page form, validates the user's password client-side using the same
  requirements. You can also leverage a package like `react-password-strength-bar` to nudge the user to create strong
  passwords.
* Line 37-73: The `schema` block is where we define attributes for the user's profile. Custom attributes must use
  the `custom:` prefix on their names.
* Line 80: The `username_attributes` array indicates that we are using the `email` attribute as the username for our
  users.

The `aws_cognito_user_pool_client` resource declares a web client for our user pool, which is, you guessed it, our React
app. This is where we configure the validity periods for the tokens returned by Cognito in lines 104-111. Line
119, `generate_secret = false` ensures that a secret is not generated for this client which is necessary because the
browser Cognito js library doesn't support secrets.

Lines 123-134 indicate which attributes, as defined in the user pool itself, are readable and/or writable by the web
client.

# Conclusion

AWS Cognito is a good option when it comes to user authentication and management. It's specially useful when you are
already bought into the AWS ecosystem and it's also cheaper than some other alternatives.

**At [Xtages](https://www.xtages.com) we are building an all-in-one solution for CI/CD and hosting of apps, all with
minimal configuration and no infrastructure to manage. We recently introduced
a [free plan](https://www.xtages.com/pricing)
(no credit card required) to make it easier to get started.**
