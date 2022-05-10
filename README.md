# Recipe Buddy

[![Backend CI](https://github.com/georgegebbett/recipe-buddy/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/georgegebbett/recipe-buddy/actions/workflows/backend-ci.yml) [![wakatime](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2.svg)](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2)

## The problem

I am getting sick of manually importing recipes into Grocy.

## The solution

Overcomplication, naturally. Recipe Buddy is a web app which scrapes web pages for the delicious [structured metadata](https://schema.org/Recipe) embedded therein.

Once the recipe has been extracted from the page, Recipe Buddy gives you a nice easy means to match each of its ingredients up with a product from your Grocy stock, as well as a quantity unit. Once this is done, you simply hit the 'Add Recipe' button, and the TypeScript goblins painstakingly transcribe the recipe into your Grocy instance, ready for meal planning!

## How you can have a go

"Well gee, George, that sounds mighty swell", I hear you say, "but how does little old me go about harnessing the TypeScript goblins for my own recipe-scraping requirements?"

Well, dear reader, as I am a benevolent goblin-wrangler, I have imprisoned them in some poorly written Dockerfiles for you! All one needs to do to benefit from the gobliny goodness is as follows:

1. Clone this repo into a directory of your choice: `git clone https://github.com/georgegebbett/recipe-buddy.git`
2. Navigate into this new directory and utter the sacred incantation: `docker-compose up`
3. Open your favourite browser like the intrepid web-o-naut you are, and visit port 4000 on the machine you ran the aforementioned command on
4. ???
5. Profit

## A disclaimer

I am not (yet) a professional software engineer. I certainly do not profess to be any good at this stuff. I hereby abdicate any responsibility for the misbehaviour of the TypeScript goblins. If you think you can do better, then open a PR and I will almost certainly merge it without question. 

Lots of love, George xoxoxoxo
