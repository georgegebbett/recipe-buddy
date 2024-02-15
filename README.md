# Recipe Buddy
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)
[![Backend CI](https://github.com/georgegebbett/recipe-buddy/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/georgegebbett/recipe-buddy/actions/workflows/backend-ci.yml) [![wakatime](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2.svg)](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2)

## Update - May 2023

I am painfully aware of all the issues that beset Recipe Buddy relating to Mongo not working on certain architectures, recipes not scraping properly etc, and I am almost finished with a complete rewrite using a much more modern and (hopefully) reliable stack. You can check progress out on the `v2-c` branch. 

I am also actively seeking someone who likes writing frontend code more than me to collaborate on this - please do reach out in the [Discussions](https://github.com/georgegebbett/recipe-buddy/discussions) tab if you'd like to help!

## The problem

I am getting sick of manually importing recipes into Grocy.

## The solution

Overcomplication, naturally. Recipe Buddy is a web app which scrapes web pages for the delicious [structured metadata](https://schema.org/Recipe) embedded therein.

Once the recipe has been extracted from the page, Recipe Buddy gives you a nice easy means to match each of its ingredients up with a product from your Grocy stock, as well as a quantity unit. Once this is done, you simply hit the 'Add Recipe' button, and the TypeScript goblins painstakingly transcribe the recipe into your Grocy instance, ready for meal planning!

## How you can have a go

"Well gee, George, that sounds mighty swell", I hear you say, "but how does little old me go about harnessing the TypeScript goblins for my own recipe-scraping requirements?"

1. Clone this repo into a directory of your choice: `git clone https://github.com/georgegebbett/recipe-buddy.git`
2. pnpm install
3. pnpm run db:push
4. pnpm run dev

## A disclaimer

I am not (yet) a professional software engineer. I certainly do not profess to be any good at this stuff. I hereby abdicate any responsibility for the misbehaviour of the TypeScript goblins. If you think you can do better, then open a PR and I will almost certainly merge it without question. 

Lots of love, George xoxoxoxo
