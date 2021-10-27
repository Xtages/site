---
title: "How to Deploy Code Reliably"
date: 2021-10-27T12:13:36-07:00
tags: ['continuous integration', 'continuous delivery', 'software engineering', 'deployment', 'best practices']
author: mdellamerlina
featured_image: feature.jpg
featured_image_alt_text: NASA, Public domain, via Wikimedia Commons, <https://upload.wikimedia.org/wikipedia/commons/1/13/Discovery_launches.jpg>
---

Nowadays there are a myriad of ways to deploy an application, mostly depending on the tech stack that you use and the underlying infrastructure where the code runs. Those two things limit your technical options, for example, some of the technical details of deploying to bare metal vs AWS Lambda and ECS - pipelines, subtasks, and scripts just to name a few.
The other side of the coin is the workflows or processes to perform a release, such as communications, approvals, when, from where, and how to perform the deployment. Some examples of tech stacks and infrastructure combinations are:

<table class="table">
  <thead>
    <tr>
      <th>Tech stack</th>
      <th>Infrastructure</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Java</td>
      <td>Kubernetes / ECS</td>
    </tr>
    <tr>
      <td>Node</td>
      <td>AWS Lambda</td>
    </tr>
    <tr>
      <td>Python</td>
      <td>Bare metal</td>
    </tr>
  </tbody>
</table>

This article will dive into some practices that you should and shouldn't do to help you to release code reliably. To start, let's identify some of the things that you shouldn't do.

## DON'T release from your local machine
It's highly discouraged to release code or to make changes in production from your local machine. It's incredibly easy to mess things up from your local given all the development/PoCs/tests work that might be there.

The process of adding a host/agent to release the changes means that you had to test it and it should be pointing to the right repository and branch, credentials should be in place and, many other things that could be a problem have been worked out. All those checks give you more confidence that the build process will succeed.

Personally, I like to go a step further, and even with the one-off jobs like a DB migration or a batch process I rather automate them to avoid frictions like the ones described above. Another advantage is that anyone can run the migration.

## DON'T obsess with automating everything
It's quite easy to try to automate everything once you are “infected” with the benefits of it, I was there too. Though, keep in mind that many businesses need to work on their roadmap and technical debt too.

What I've seen to work is to make progress on the release automation every time you have to work on something related to it. If you are asked to do a deployment, spend some time improving the automation as well as actually doing the deployment. The incremental changes will help you to move in the right direction and hopefully one day you would have to just push a button to do the deployment. I'd consider that a good trade-off for your managers, how to go about dealing with other pressing issues and improve the current deployment process.

## DON'T manually change configurations
The only reason you might want to mess around with that is if you are troubleshooting an issue and customers are impacted, even to do that I'd ask for a significant number of users to be impacted to explore that alternative.

Some of the problems with this practice are that most of the time manual config changes are not applied consistently across instances of the same service. Also if there is some sort of automation that does the deployment you can mistakenly nuke all your manual changes ending up with the same problem again. This is generally bad because people start to trust other individuals that did the manual changes instead of having a process to rely upon.

Anecdotally, I've seen systems that ended up in such bad shape because of manual changes that a new deployment of the system was required. That was a product installation running in bare metal with a not-so-great tech stack and minimal (?) automation. Bad practices compound quite fast, they become tech debt and later on require a lot of effort to fix them.

To avoid this problem you can use a configuration management tool like Ansible or Puppet, I prefer Ansible as it doesn't need an agent. Another option is to use immutable deployments, we use this at [Xtages](www.xtages.com) for our own service and as an OOTB feature for customers that want to deploy to Xtages cloud, we deploy a Docker image with your code and configuration embedded in it.

## DON'T deploy on Fridays
This is a difficult topic for some organizations since sometimes they require to deploy at night or after normal hours. What's special about Friday nights that doesn't happen during normal hours? Depending on the industry, there might be fewer users impacted if something goes wrong. However, fewer users can make a problem that exists undetectable until normal hours because there isn't enough volume of requests or new code paths are not exercised.

Another reason to not deploy on Fridays is that people usually tend to take Fridays off when they go on vacations or are more psychologically checked out even if they are in the office.

To have flawless deployments you need to practice how to deploy, the reliability of the process itself should be independent of when the process happens. If your deployment process - by the process I mean pipeline automation and how the release will be performed -  isn't mature enough you'll have to improve that process, and making it less frequent would hardly help with that goal.

This is a very heated topic in some companies. If you work in one of those companies you should prove that your release process is mature enough that it leads to consistently and uneventful deployments and therefore can be relied upon regardless of scheduling.

Now let's switch to the things that you should do

## DO communicate changes beforehand
If you are a DevOps engineer, an SRE, or a full-stack engineer ready to do a deployment, communicate the change to the stakeholders before doing it. These could be your manager, your teammates, your SRE team that receives alerts if something goes wrong, in some cases you might want to communicate with the users too.

It's extremely important to be in sync with the service's team if they are not the ones that do the deployment. They can be great partners to keep an eye on KPIs that might give insightful information about how the new changes are working for the end-user.

Depending on the organization, it could be surprising the level of miscommunication that happens across teams due to different reasons, so make sure to over communicate your execution plan. It doesn't need to be super detailed, just something like: *ready to deploy in 1 hour* for internal comms goes a long way. To go the extra mile you can ask who's going to be the secondary on-duty or if anyone will be online at that time in case things don't go as expected. Having a partner on standby is helpful in case you need to troubleshoot or communicate internally to managers or other stakeholders while another person does the actual work.

## DO have your dashboards ready
Get your dashboard with some meaningful information for the systems that you are monitoring. We at [Xtages](www.xtages.com) like our users to follow [the four golden signals](https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals)[:](https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals) latency, traffic, errors, and saturation. One hour before the deployment is a great time to make sure your dashboards are working properly and pointing to the right environment. We are working on providing dashboards out-of-the-box for our users and will be landing this feature soon.

Here also you can prepare some queries for your logs in case you need to troubleshoot issues or in case that a metric is available through the logs and not in the time-series database.

## DO have a streamlined pipeline
At the time of deployment, you don't want to run multiple jobs from different pipelines that don't have a clear order. You need to have an extremely easy and consistent way to trigger the release, the pipeline itself can be quite complicated though and hopefully, it's split into different tasks associated as dependencies.

Ideally, you have a single button that triggers the deployment with as minimal parameters as possible. It's quite common to see pipelines that have as parameters: the environment, the credentials, and many other inputs that generate friction and are error-prone.

# Conclusion
This article isn't trying to cover all the good practices and is not exhaustive by any means, though it gives you some hints about how to improve your releases to make them more reliable. As you have read many of the tasks to achieve reliable deployments are through good practices, some of them are technical and others pertain more to the communication/social side.

At Xtages we are strong believers in immutable deployments to avoid many of the problems that were mentioned above and we strive to give you as much of it as we can out-of-the-box, so you don't have to worry about dashboards, complicated pipelines, or how to rollback your code.

Stay tuned as we are launching a free plan soon.

Keywords: Continuous Integration, Continuous Delivery, Software Engineering, Deployment, Best Practices

