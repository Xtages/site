# Xtages.com Landing Page

This is the landing page used in xtages.com

# Prerequisites

* Install [nodejs](https://nodejs.org/en/download/).
* Clone [this repo](https://github.com/Xtages/site)
* Run `npm install`
* Run `npm install --global gulp-cli`
  
# Development

* Run `npm run dev` which will bring up a server with live reloading and open the page on your browser

# Deployment

## Build 

run `npm run build`.

This will:

* Delete [dist/]
* Optimize images
* Clean & Optimize CSS
* Optimize JS
* Leave the final html and asset files [dist/]

## Publishing

Take everything under [dist/] and publish it.
