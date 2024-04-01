# Recipe Buddy

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)
[![wakatime](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2.svg)](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2)

## Update - April 2024

V2 of Recipe Buddy is here! V2 brings a host of improvements, including:

* An all-new architecture - SQLIte replaces Mongo and Next.js replaces the massively overkill Nest.js and plain React
* Can be run in one (1) Docker container - no messing about with compose files
* A whole new UI

The only thing that hasn't really changed is the recipe scraping logic itself - that is coming (no promises on when
though)

## The problem

I am getting sick of manually importing recipes into Grocy.

## The solution

Overcomplication, naturally. Recipe Buddy is a web app which scrapes web pages for the
delicious [structured metadata](https://schema.org/Recipe) embedded therein.

Once the recipe has been extracted from the page, Recipe Buddy gives you a nice easy means to match each of its
ingredients up with a product from your Grocy stock, as well as a quantity unit. Once this is done, you simply hit the '
Add Recipe' button, and the TypeScript goblins painstakingly transcribe the recipe into your Grocy instance, ready for
meal planning!

## How you can have a go

"Well gee, George, that sounds mighty swell", I hear you say, "but how does little old me go about harnessing the
TypeScript goblins for my own recipe-scraping requirements?"

Well, dear reader, as I am a benevolent goblin-wrangler, I have imprisoned them in a poorly written Dockerfile for you!
All one needs to do to benefit from the gobliny goodness is as follows:

1. Generate yourself an auth secret using `openssl rand -base64 32`
2. Get the base url of your Grocy instance (everything up to the first `/`)
3. Get an API key for your Grocy instance
4. Run the following command:
    ```
   docker run \
     -p 3005:3000 \
     -v rb_data:/home/node/app/data \
     --env GROCY_API_KEY=YOUR_GROCY_API_KEY \
     --env GROCY_BASE_URL=YOUR_GROCY_BASE_URL \
     --env NEXTAUTH_SECRET=YOUR_AUTH_SECRET \
     --env NEXTAUTH_URL=http://localhost:3005 \
     ghcr.io/georgegebbett/recipe-buddy
   ```

## A disclaimer

I am apparently a professional software engineer, however I certainly do not profess to be any good at this stuff. I
hereby abdicate any responsibility for the misbehaviour of the TypeScript goblins. If you think you can do better, then
open a PR and I will almost certainly merge it without question.

Lots of love, George xoxoxoxo
