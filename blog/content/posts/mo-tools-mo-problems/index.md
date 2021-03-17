---
title: "Mo' tools mo' problems"
date: 2021-03-17T09:25:38-07:00
author: mdellamerlina 
tags: ['first', 'blog', 'post']
featured_image: feature.jpg
featured_image_alt_text: Forge
---

The modern software development workflow is currently stuck in a local maxima where developers are forced to use a myriad of tools and SaaS services on a daily basis in order to do their jobs. These SaaS companies, smartly, try to be best-of-breed of their own niches but time and time again ignore how well they fit into the landscape of tools that a developer must master in order to accomplish meaningful work.

Let’s focus on some of the most common and important tasks that are part of those workflows and the SaaS solutions around it, assuming that you have a somewhat sophisticated softwar.  development life cycle.

1. Search the existing codebase for utilities, patterns or implementations of the task they are trying to accomplish.
    * Sourcegraph
    * Atlassian Fisheye
2. Understand the codebase at both a high level and low level.
    * Atlassian Confluence
    * Github Wiki pages
    * Gitlab Wiki pages
    * Notion
3. Publish code to collaborate with their teammates.
    * Github source code hosting
    * Gitlab source code hosting
    * Atlassian Bitbucket
    * AWS CodeCommit
4. Conduct code reviews and have their own code changes reviewed.
    * Github code reviews
    * Gitlab code reviews
    * Atlassian Bitbucket reviews
    * Atlassian Crucible
    * Phabricator
5. Lint and perform static analysis of code to detect possible bugs before they affect users.
    * SonarQube
    * Linters run as part of CI
6. Determine if new code has caused integration failures.
    * Github Actions
    * Gitlab CI
    * Atlassian Bamboo
    * AWS Code Build
    * Travis CI
    * Circle CI
7. Understand and maintain the deployment topology of the environment used to run the service.
    * AWS
    * GCP
    * Azure
    * Datadog
8. Preview their code working in pre-production environments to verify it.
    * Same as #6
9. Release their code to a production environment.
    * Same a #8
10. Control which users exercise new codepaths introduced into the product.
    * LaunchDarkly
    * split
    * Optimizely
    * Firebase Remote Config
11. Detect when code in production is misbehaving and assess the impact to users.
    * New Relic
    * Grafana
    * AWS CloudWatch
    * Honeycomb
    * Datadog
12. Rollback a release to a previously known version.
    * Same as #6
13. Troubleshoot production problems as reported by users.
    * Same #11

Those are quite some tasks and tools that require previous experience to use them efficiently or a fair amount of time to ramp up in order to get familiar with them.

A follow up question that you might ask is: how complicated is to setup a  workflow like the above for a company? We will point out some of the pitfalls that we have noticed from our previous experience in this industry.

## People and Resources to setup a Workflow
Let’s assume for a moment that you want to set up from scratch a well functioning workflow for your company, ideally covering most of the parts that we mentioned previously. The minimum effort required, assuming that you don’t have infrastructure that you own, is to connect all the integrations in the workflow.

For this minimum effort comes a big drawback: you need a senior developer to select the tools for each task and to decide how complex the workflow will be. On top of that,  the developer needs to work to ensure that the setup is properly done and it follows best practices.

Initially it will take time from that developer to troubleshoot any problem with the integration. We believe that integrations among tools that perform tasks in the workflow is essential to ensure the quality of the product delivered, however the price is a senior developer doing the integrations instead of allowing her/him to focus in its domain and be productive in their area of expertise.

In the case that you want to install the tools on-prem, even if it is on-cloud and with automation, you might require to invest more time and effort. You should be thinking in having a dedicated DevOps team to take ownership of the tools. This is not an easy effort at all and there are a lot of gotchas that are hard to anticipate.

Another pitfall in setting up a sophisticated workflow is that many times there are biases about what constitutes a best practice and how it should be implemented. This depends on the previous experience of the developer that will decide the complexity of the workflow and set up the integrations. The harm here is that if the developer experience is not up to the circumstances it could result in short cuts by neglecting important tasks and that could result in a bad outcome at the product level.

## Maturity level
Beside the problem of managing, maintaining and using the tools that are part of each workflow there is another entry barrier that might make it difficult to adopt it: the maturity level that your company has in terms of best practices for the software development life cycle (SDLC).

Understandable, not all companies are in the same page in terms of maturity level given different factors, here are a few:
* Lack of time to implement top down ideas from more senior developers
* Lack of a team that can take ownership of the infrastructure required
* Lack of knowledge of best practices

The lack of sophistication can undermine the process of build and release software consistently, therefore that leads to the company to be more prone to have a bad image with their users, as their product is more unstable. Another disadvantage is the loss of revenue due downtimes or lack of adoption from users and another important problem to mention is that it generates toil in your teams and creates unexpected outcomes.

For that reason we believe that having best practices implemented as part of the workflow in an out-of-the-box fashion can level up all companies to avoid some of the most common problems.

What constitutes a best practice might be debatable as in some companies a practice might be an overkill and in others it could be a must. However, we found that having an opinionated approach is better than nothing. Of course this could be a problem if they are not used to these practices and for that reason will be better to give options to the user to adapt the enforcement of the practices but keeping the practices in place.

## Diverse ecosystem of tools
There is nothing wrong with having different tools to perform different tasks of the workflow, however you might need a big team of DevOps to afford that luxury. Not all companies can end up having a DevOps team dedicated to install, maintain, audit and upgrade those tools whenever is required.. Also, there is a significant cognitive load in learning to leverage each of those tools in a meaningful way and many times those products don’t have best-in-class documentation.

## Conclusion
We just named some of the issues related to the multiple tools that are part of a workflow that developers use everyday and how involved they are. We at [Xtages](https://xtages.com) believe that there is a better way to implement these practices out-of-the-box with minimal effort and without friction for developers. We also believe that all companies deserve a good workflow to achieve a certain level of maturity that should be unified and simplified. If you are interested in learning more visit our [website](https://xtages.com) to stay tuned as we will be launching soon to fix those problems.