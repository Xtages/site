---
title: "Terraform Basic Pipeline"
date: 2021-05-11T13:36:48-07:00
author: mdellamerlina
tags: ['terraform', 'pipeline', 'CI']
featured_image: feature.jpg
featured_image_alt_text: Michielverbeek, CC BY-SA 4.0 https://creativecommons.org/licenses/by-sa/4.0, via Wikimedia Commons
images: ['pipeline-diagram.png', 'codebuild-setup-details.png']
---

Using live repositories with Terraform has become quite popular. A live
repository is a repository where you have all your infrastructure defined
and that’s supposed to be live. That means that as soon as a pull request (PR)
is merged the infrastructure is updated with those changes.

The live repo approach requires to have some automation in place, mostly to avoid the following problems:
* Access to the production environment for too many people.
  You don’t want too many people with access to your production environment to apply changes to the infrastructure.
* Even if an engineer has access to an account it might not be the same account that the repository will change.
* The Terraform plan doesn’t even run. That’s terrible but it happens,
  depending on how easy it’s to run a plan against the target account.

Let’s see how to set up a workflow to know the plan is valid and to apply the plan automatically.
For this post, I’ll be using these technologies: GitHub, Terraform, AWS CodeBuild, and AWS S3. Though, you can do the same with other tools.

The example below is just one workflow, it may not be the best or might not fit your needs however it’ll help to demonstrate all the necessary piping.
{{< figure src="pipeline-diagram.png" alt="Interaction diagram of the Terraform Basic Pipeline" class="d-flex justify-content-center in-content">}}

The workflow is very straightforward, here’s an explanation:
1. An engineer (author), creates a PR to update the infrastructure in the GitHub live repo
2. The live repo makes a call to CodeBuild to create a Terraform plan
3. The resulting Terraform plan is stored in S3
4. The result of the plan is posted in the PR as a comment
5. Based on the result of the plan it marks the PR with all checks passed
6. Another engineer (reviewer), does the review and approves the PR
7. The author merges the PR
8. GitHub calls AWS CodeBuild and runs `terraform apply` by fetching from S3 the plan created in step #2
9. The result of `terraform apply` is posted as a comment in the PR

Let’s go through the configuration needed to create the pipeline

## GitHub config
1. Create a personal token to allow CodeBuild to interact with GitHub. You can follow the instructions [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Remember this is a PoC but this should be done through a GitHub app or a service account in a more production-like setting. The token will require access to the repository.
2. Optionally, enable the[ require status checks to pass before merging](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule) option in your repository settings under *Branches*. This is a good practice so you force that the plan runs to allow the PR to be merged.

## AWS S3
1. Create a bucket to store the plans

## AWS CodeBuild

### CodeBuild Project To Run Plan
1. Using the GH token create a CodeBuild project pointing to the Terraform live repository to run a plan
2. Use the events create `PULL_REQUEST_CREATED` and `PULL_REQUEST_UPDATED` this will create the Terraform plan. Later on, we will create another project to apply the plan
3. As part of the environment install your preferred Terraform version, we’ll be using v0.15.10. The Terraform plan will be stored in S3 so we need a new Docker image to add the AWS CLI in it.
4. As CodeBuild hosts might be used across different users it’s best to make the build image available in ECR, that’s to avoid the [rate limit from Docker Hub](https://www.docker.com/increase-rate-limits). We’ve experienced the rate limit errors in CodeBuild without running into the rate limit conditions that Docker Hub describes, which makes us think that IPs are being recycled for different users which makes sense from AWS’s point of view.
5. Give permissions to the ECR repo to be pulled by CodeBuild
   {{< gist mdellamerlina b0ea3a8479ae23ec055a28a8992caef2 "policy.json" >}}
6. Service role, create a new role or use one you have created, and make sure you have the right permissions. For the test, we added an EC2 instance so our permissions were quite minimalistic. However, in your settings make sure you have all the permissions needed for CodeBuild to run the plan and apply it. If you don’t have the right perms you’ll see a message in CodeBuild telling you that.
7. We won’t have any custom configuration for VPC and subnets for this example, so you can leave that blank
8. We will use the 3GB RAM 2vCPU to run the build
9. In the build specification add the Terraform commands to run the plan
   {{< gist mdellamerlina 6fd774c499df3584b77fee4f17f0ffbe "buildspec.yml" >}}

A couple of things to mention here:
* Update the user with your user
* I stored the GitHub token in SSM but if you want you can paste it in the variables section.
* [`CODEBUILD_SOURCE_VERSION`](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html) is an environment variable that CodeBuild sets up for you with information regarding the PR. We will be using that to name the S3 object
* The github-callback script is the code to call back GitHub with a comment in the PR to post the plan

### CodeBuild Project To Apply Plan
1. As above create a project with the same characteristics except:
 1. Use the event `PULL_REQUEST_MERGE`
2. In the buildspec file add the following
   {{< gist mdellamerlina d994ac4b6e57a94e88080da4fb079f07 "buildspec.yml" >}}

After that, you can create a PR and wait for your plan to be posted after CodeBuild runs the plan, same for the merge.

Here are some screenshots of how the CodeBuild projects look like:

CodeBuild project to run the plan
{{< figure src="codebuild-setup-details.png" alt="AWS CodeBuild configuration screenshot" class="d-flex justify-content-center in-content">}}

The CodeBuild project to merge is similar to the one above with the change in the event type that listens from GitHub. It will only listen to `PULL_REQUEST_MERGED`

You can check our repository with some snippets to create the Docker Image, and the AWS resources needed.

## Considerations
* One of the pitfalls that this workflow presents is that as you apply the changes after the PR is merged, it’s unlikely that anyone will look at the comments in the PR to know if it was applied successfully or not. Also, if the apply failed the fix will have to be addressed in another PR.
* Another workflow could be one where after the PR is approved someone with the right perms can apply the plan from a link given in the PR. Assuming that `terraform apply` works fine there is a post in the PR and then the PR can be merged automatically or manually. The problem with this is that you need to remember to run the `apply` command before merging otherwise that repo won’t have the live infrastructure.
* Setting up automation is cumbersome and requires several steps to get it right if you don’t know infrastructure. It could be incredibly time-consuming, that’s why we at [Xtages](https://xtages.com) want to provide out-of-the-box workflows that are easy to use and set up. Stay tuned for more updates, as we are building our MVP.

Code snippets can be found in [https://github.com/Xtages/demo-tf-codebuild-pipeline](https://github.com/Xtages/demo-tf-codebuild-pipeline).

