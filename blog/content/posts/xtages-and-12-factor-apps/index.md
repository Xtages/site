---
title: "Xtages ❤️  Twelve-Factor Apps"
date: 2021-06-02T10:27:53-07:00
author: czuniga
tags: ['12-factor-apps', 'cloud ready']
featured_image: feature.png
featured_image_alt_text: 12 Factor App logo
images: ['feature.png']
---

The [Twelve-Factor App](https://12factor.net/) is a popular methodology for building SaaS apps that:

> * Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;
> * Have a clean contract with the underlying operating system, offering maximum portability between execution environments;
> * Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;
> * Minimize divergence between development and production, enabling continuous deployment for maximum agility;
> * And can scale up without significant changes to tooling, architecture, or development practices.

In both Matias' and my experience, this methodology leads to better quality apps that can grow according to the organization's needs and can be more easily managed and debugged. In fact, in building Xtages, we follow these recommendations because we know how important they are to create a solid SaaS app.

For us, Xtages is not only about providing a service to build apps, but we are also keen on providing best practices that are easy to follow and baked into the applications built using our service.

Next, we'll explore how Xtages can help you follow the twelve factors when building your product.

> ## I. Codebase
>
> One codebase tracked in revision control, many deploys

When you create a new Xtages project, it will automatically create a GitHub repository under your organization. It will create continuous integration and continuous deployment pipelines as well. We run the CI pipeline on each merge to the main branch to ensure that the latest HEAD is healthy. We also support deploying to staging and promoting to production environments.

> ## II. Dependencies
>
> Explicitly declare and isolate dependencies

Xtages currently supports Node.js projects, and by default, we add a `package-lock.json` to the repository so dependencies are explicitly declared and their versions locked.

> ## III. Config
>
> Store config in the environment

When deploying an app to staging or production in the Xtages Cloud, we pass the database connection configuration as environment variables; we recommend that users leverage the [`dotenv` package](https://www.npmjs.com/package/dotenv) to manage their env vars for local development.

> ## IV. Backing services
>
> Treat backing services as attached resources

Each app deployed in the Xtages Cloud can access a database via a standard driver using the connection configuration passed in as environment variables. We recommend setting up a local database for local development.

> ## V. Build, release, run
>
> Strictly separate build and run stages

The CI and CD pipelines that come out of the box with Xtages projects offer this separation by leveraging Docker. These pipelines are entirely isolated and cannot affect the staging or production environments until an image is deployed.

> ## VI. Processes
>
> Execute the app as one or more stateless processes

Apps deployed in the Xtages Cloud are stateless by definition, and we don't make any guarantees about where they are deployed. We recommend using the database for all persistence needs.

> ## VII. Port binding
>
> Export services via port binding

We don't support apps that require running inside a hosted web server or application server. Each app must expose its API (HTTP or other protocol) by using the appropriate embedded server; each app must be self-contained.

> ## VIII. Concurrency
>
> Scale out via the process model

N/A

> ## IX. Disposability
>
> Maximize robustness with fast startup and graceful shutdown

When an app is deployed to the Xtages Cloud, our load balancers will do a series of health checks and declare an app unhealthy if it doesn't respond after 30 seconds; therefore, we recommend that apps start as fast as possible.

> ## X. Dev/prod parity
>
> Keep development, staging, and production as similar as possible

In Xtages, we provide two environments for each app, one for staging and one for production; they are identical although isolated from each other. We enforce that before promoting to production, a build must be deployed to staging, so it's possible to test it live without disturbing your production users.

> ## XI. Logs
>
> Treat logs as event streams

To correctly collect logs, we recommend that all apps deployed to the Xtages Cloud output their logs to `stdout`; we will then present them in the Xtages console.

> ## XII. Admin processes
>
> Run admin/management tasks as one-off processes

N/A


As you can see at Xtages, we not only care about providing an excellent software development lifecycle, but we want to help organizations big and small, with developers of all levels of experience, deliver the very best service to their customers in the shortest possible time. If you are curious to learn more about Xtages, check out our [page](https://xtages.com) and [sign up to our mailing list](https://www.xtages.com/pricing.html#join-titlehttps://www.xtages.com/pricing.html#join-title) to receive updates.

