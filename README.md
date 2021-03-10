# Xtages.com Landing Page

This is the landing page used in xtages.com

# Deployment
To access the AWS Console in our Amplify project click [here](https://console.aws.amazon.com/amplify/home?region=us-east-1#/d36l47rod7uck9) 

# Prerequisites

* Install [nodejs](https://nodejs.org/en/download/).
* Clone [this repo](https://github.com/Xtages/site)
* Run `npm install`
* Run `npm install --global gulp-cli`
  
# Development

* Run `npm run dev` which will bring up a server with live reloading and open the page on your browser

## Build 

run `npm run build`.

This will:

* Delete [dist/](dist/)
* Optimize images
* Clean & Optimize CSS
* Optimize JS
* Leave the final html and asset files [dist/](dist/)

## Publishing

Take everything under [dist/](dist/) and publish it.
