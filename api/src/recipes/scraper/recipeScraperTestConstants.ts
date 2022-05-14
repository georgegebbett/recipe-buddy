import { JSDOM } from 'jsdom';
import { Recipe } from '../schemas/recipe.schema';

export const belliniUrl = 'https://www.bbcgoodfood.com/recipes/bellini';

export const mockNodeList = (
  domString = '<script type="application/ld+json">{"@context":"https://schema.org","@id":"https://www.bbcgoodfood.com/recipes/bellini#Recipe","@type":"Recipe","description":"A classy cocktail served in an elegant flute - this simple combination of peach purée and Prosecco makes a great start to any celebration","image":{"@type":"ImageObject","height":400,"url":"https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg","width":440},"mainEntityOfPage":{"@type":"WebPage","@id":"https://www.bbcgoodfood.com/recipes/bellini"},"name":"Bellini","url":"https://www.bbcgoodfood.com/recipes/bellini","author":{"@type":"Person","name":"Good Food team"},"dateModified":"2020-08-08T02:26:26+00:00","datePublished":"2013-11-18T16:37:44+00:00","headline":"Bellini","keywords":"Christmas, Christmas morning, cocktails canapes, Good Food, Party, sparkling cocktail","publisher":{"@type":"Organization","name":"BBC Good Food","url":"https://www.bbcgoodfood.com","logo":{"@type":"ImageObject","url":"https://images.immediate.co.uk/production/volatile/sites/30/2019/07/GoodFood-dark-516d417.png","width":221,"height":58}},"nutrition":{"@type":"NutritionInformation","calories":"143 calories","carbohydrateContent":"18 grams carbohydrates","sugarContent":"18 grams sugar","fiberContent":"0.7 grams fiber","proteinContent":"0.7 grams protein"},"prepTime":"PT5M","recipeCategory":"Cocktails","recipeIngredient":["500ml peach purée or peach nectar","1 bottle prosecco"],"recipeInstructions":[{"@type":"HowToStep","text":"Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco."}],"recipeYield":6,"totalTime":"PT5M"}</script><script type="application/ld+json">{"@context":"https://schema.org/","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.bbcgoodfood.com/"},{"@type":"ListItem","position":2,"name":"Recipes","item":"https://www.bbcgoodfood.com/recipes"},{"@type":"ListItem","position":3,"name":"Bellini"}]}</script>{"@context":"https://schema.org/","@id":"https://www.bbcgoodfood.com/recipes/bellini#Recipe","aggregateRating":{"@type":"AggregateRating","ratingValue":4,"reviewCount":2,"bestRating":5,"worstRating":1}}',
) => {
  return JSDOM.fragment(domString).querySelectorAll(
    "script[type='application/ld+json']",
  );
};

export const belliniMetadataObject = {
  '@context': 'https://schema.org',
  '@id': 'https://www.bbcgoodfood.com/recipes/bellini#Recipe',
  '@type': 'Recipe',
  description:
    'A classy cocktail served in an elegant flute - this simple combination of peach purée and Prosecco makes a great start to any celebration',
  image: {
    '@type': 'ImageObject',
    height: 400,
    url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg',
    width: 440,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.bbcgoodfood.com/recipes/bellini',
  },
  name: 'Bellini',
  url: 'https://www.bbcgoodfood.com/recipes/bellini',
  author: { '@type': 'Person', name: 'Good Food team' },
  dateModified: '2020-08-08T02:26:26+00:00',
  datePublished: '2013-11-18T16:37:44+00:00',
  headline: 'Bellini',
  keywords:
    'Christmas, Christmas morning, cocktails canapes, Good Food, Party, sparkling cocktail',
  publisher: {
    '@type': 'Organization',
    name: 'BBC Good Food',
    url: 'https://www.bbcgoodfood.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://images.immediate.co.uk/production/volatile/sites/30/2019/07/GoodFood-dark-516d417.png',
      width: 221,
      height: 58,
    },
  },
  nutrition: {
    '@type': 'NutritionInformation',
    calories: '143 calories',
    carbohydrateContent: '18 grams carbohydrates',
    sugarContent: '18 grams sugar',
    fiberContent: '0.7 grams fiber',
    proteinContent: '0.7 grams protein',
  },
  prepTime: 'PT5M',
  recipeCategory: 'Cocktails',
  recipeIngredient: ['500ml peach purée or peach nectar', '1 bottle prosecco'],
  recipeInstructions: [
    {
      '@type': 'HowToStep',
      text: 'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
    },
  ],
  recipeYield: 6,
  totalTime: 'PT5M',
};

export const mockRecipe = (
  url = 'https://www.bbcgoodfood.com/recipes/bellini',
  name = 'Bellini',
  imageUrl = 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg',
  ingredients = ['500ml peach purée or peach nectar', '1 bottle prosecco'],
  steps = [
    'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
  ],
): Recipe => ({
  url,
  name,
  imageUrl,
  ingredients,
  steps,
});

export const allRecipesDomString =
  '<script type="application/ld+json"> [ { "@context": "http://schema.org", "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "item": { "@id": "https://www.allrecipes.com/", "name": "Home", "image": null } }, { "@type": "ListItem", "position": 2, "item": { "@id": "https://www.allrecipes.com/recipes/", "name": "Recipes", "image": null } }, { "@type": "ListItem", "position": 3, "item": { "@id": "https://www.allrecipes.com/recipes/92/meat-and-poultry/", "name": "Meat and Poultry", "image": null } }, { "@type": "ListItem", "position": 4, "item": { "@id": "https://www.allrecipes.com/recipes/201/meat-and-poultry/chicken/", "name": "Chicken", "image": null } }, { "@type": "ListItem", "position": 5, "item": { "@id": "https://www.allrecipes.com/recipes/659/meat-and-poultry/chicken/chicken-breasts/", "name": "Breast", "image": null } }, { "@type": "ListItem", "position": 6, "item": { "@id": "https://www.allrecipes.com/recipes/1981/meat-and-poultry/chicken/chicken-breasts/pan-fried/", "name": "Pan-Fried", "image": null } } ] }, { "@context": "http://schema.org", "@type": "Recipe", "mainEntityOfPage": "https://www.allrecipes.com/recipe/8379848/pan-fried-chicken-breast-with-mushroom-gravy/", "name": "Pan-Fried Chicken Breast with Mushroom Gravy", "image": { "@type": "ImageObject", "url": "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F-0001%2F11%2F30%2F8842462-2000.jpg", "width": 1500, "height": 2000 }, "datePublished": "2022-04-15T14:22:32.000Z", "description": "Simple ingredients that you have in your pantry. This is an easy dish that tastes great.", "prepTime": "P0DT0H5M", "cookTime": "P0DT0H25M", "totalTime": "P0DT0H30M", "recipeIngredient": [ "4 (5 ounce) chicken breasts", "1 teaspoon onion powder", "½ teaspoon salt", "½ teaspoon freshly ground black pepper", "3 tablespoons olive oil", "1 (8 ounce) package sliced fresh mushrooms", "2 cloves garlic, sliced", "¾ cup water", "¼ cup dry white wine", "1 (1.25 ounce) envelope dry chicken gravy mix" ], "recipeInstructions": [ { "@type": "HowToStep", "text": "Sprinkle both sides of the chicken breasts with onion powder, salt, and pepper.\\n" }, { "@type": "HowToStep", "text": "Heat oil in a large skillet over medium-high heat. Add chicken and cook until golden brown, about 5 minutes per side.\\n" }, { "@type": "HowToStep", "text": "Add garlic and mushrooms and cook until mushrooms have released their liquid and are reduced in size, about 5 minutes.\\n" }, { "@type": "HowToStep", "text": "Stir together water, white wine, and gravy packet in a small bowl and pour into the skillet.\\n" }, { "@type": "HowToStep", "text": "Bring liquid to a simmer, cover, reduce heat to medium, and cook for 5 minutes. Turn chicken breasts and continue cooking until chicken is no longer pink in the center and the juices run clear, about 5 more minutes. An instant-read thermometer inserted into the center should read at least 165 degrees F (74 degrees C).\\n" } ], "recipeCategory": [ "Pan Fried Chicken Breasts" ], "recipeCuisine": [], "author": [ { "@type": "Person", "name": "FrackFamily5 CACT" } ], "aggregateRating": { "@type": "AggregateRating", "ratingValue": 4, "ratingCount": 2, "itemReviewed": "Pan-Fried Chicken Breast with Mushroom Gravy", "bestRating": "5", "worstRating": "1" }, "nutrition": { "@type": "NutritionInformation", "calories": "263 calories", "carbohydrateContent": "8 g", "cholesterolContent": "63.7 mg", "fatContent": "13.3 g", "fiberContent": "0.7 g", "proteinContent": "27.1 g", "saturatedFatContent": "2.2 g", "servingSize": null, "sodiumContent": "765.9 mg", "sugarContent": null, "transFatContent": null, "unsaturatedFatContent": null }, "review": [ { "@type": "Review", "datePublished": "2022-04-20T12:29:10.818Z", "reviewBody": "It came out delicious! The chicken was very tender. The only two changes I made was to use a brown gravy mix because of what I had on hand and to replace white wine with chicken broth.", "reviewRating": { "@type": "Rating", "worstRating": "1", "bestRating": "5", "ratingValue": 5 }, "author": { "@type": "Person", "name": "ruthncls", "image": null, "sameAs": null } } ] } ]</script>';

export const allRecipesUrl =
  'https://www.allrecipes.com/recipe/8379848/pan-fried-chicken-breast-with-mushroom-gravy/';

export const allRecipesMetadataObject = {
  '@context': 'http://schema.org',
  '@type': 'Recipe',
  mainEntityOfPage:
    'https://www.allrecipes.com/recipe/8379848/pan-fried-chicken-breast-with-mushroom-gravy/',
  name: 'Pan-Fried Chicken Breast with Mushroom Gravy',
  image: {
    '@type': 'ImageObject',
    url: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F-0001%2F11%2F30%2F8842462-2000.jpg',
    width: 1500,
    height: 2000,
  },
  datePublished: '2022-04-15T14:22:32.000Z',
  description:
    'Simple ingredients that you have in your pantry. This is an easy dish that tastes great.',
  prepTime: 'P0DT0H5M',
  cookTime: 'P0DT0H25M',
  totalTime: 'P0DT0H30M',
  recipeIngredient: [
    '4 (5 ounce) chicken breasts',
    '1 teaspoon onion powder',
    '½ teaspoon salt',
    '½ teaspoon freshly ground black pepper',
    '3 tablespoons olive oil',
    '1 (8 ounce) package sliced fresh mushrooms',
    '2 cloves garlic, sliced',
    '¾ cup water',
    '¼ cup dry white wine',
    '1 (1.25 ounce) envelope dry chicken gravy mix',
  ],
  recipeInstructions: [
    {
      '@type': 'HowToStep',
      text: 'Sprinkle both sides of the chicken breasts with onion powder, salt, and pepper.\n',
    },
    {
      '@type': 'HowToStep',
      text: 'Heat oil in a large skillet over medium-high heat. Add chicken and cook until golden brown, about 5 minutes per side.\n',
    },
    {
      '@type': 'HowToStep',
      text: 'Add garlic and mushrooms and cook until mushrooms have released their liquid and are reduced in size, about 5 minutes.\n',
    },
    {
      '@type': 'HowToStep',
      text: 'Stir together water, white wine, and gravy packet in a small bowl and pour into the skillet.\n',
    },
    {
      '@type': 'HowToStep',
      text: 'Bring liquid to a simmer, cover, reduce heat to medium, and cook for 5 minutes. Turn chicken breasts and continue cooking until chicken is no longer pink in the center and the juices run clear, about 5 more minutes. An instant-read thermometer inserted into the center should read at least 165 degrees F (74 degrees C).\n',
    },
  ],
  recipeCategory: ['Pan Fried Chicken Breasts'],
  recipeCuisine: [],
  author: [
    {
      '@type': 'Person',
      name: 'FrackFamily5 CACT',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4,
    ratingCount: 2,
    itemReviewed: 'Pan-Fried Chicken Breast with Mushroom Gravy',
    bestRating: '5',
    worstRating: '1',
  },
  nutrition: {
    '@type': 'NutritionInformation',
    calories: '263 calories',
    carbohydrateContent: '8 g',
    cholesterolContent: '63.7 mg',
    fatContent: '13.3 g',
    fiberContent: '0.7 g',
    proteinContent: '27.1 g',
    saturatedFatContent: '2.2 g',
    servingSize: null,
    sodiumContent: '765.9 mg',
    sugarContent: null,
    transFatContent: null,
    unsaturatedFatContent: null,
  },
  review: [
    {
      '@type': 'Review',
      datePublished: '2022-04-20T12:29:10.818Z',
      reviewBody:
        'It came out delicious! The chicken was very tender. The only two changes I made was to use a brown gravy mix because of what I had on hand and to replace white wine with chicken broth.',
      reviewRating: {
        '@type': 'Rating',
        worstRating: '1',
        bestRating: '5',
        ratingValue: 5,
      },
      author: {
        '@type': 'Person',
        name: 'ruthncls',
        image: null,
        sameAs: null,
      },
    },
  ],
};

export const allRecipesRecipe = mockRecipe(
  'https://www.allrecipes.com/recipe/8379848/pan-fried-chicken-breast-with-mushroom-gravy/',
  'Pan-Fried Chicken Breast with Mushroom Gravy',
  'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F-0001%2F11%2F30%2F8842462-2000.jpg',
  [
    '4 (5 ounce) chicken breasts',
    '1 teaspoon onion powder',
    '½ teaspoon salt',
    '½ teaspoon freshly ground black pepper',
    '3 tablespoons olive oil',
    '1 (8 ounce) package sliced fresh mushrooms',
    '2 cloves garlic, sliced',
    '¾ cup water',
    '¼ cup dry white wine',
    '1 (1.25 ounce) envelope dry chicken gravy mix',
  ],
  [
    'Sprinkle both sides of the chicken breasts with onion powder, salt, and pepper.',
    'Heat oil in a large skillet over medium-high heat. Add chicken and cook until golden brown, about 5 minutes per side.',
    'Add garlic and mushrooms and cook until mushrooms have released their liquid and are reduced in size, about 5 minutes.',
    'Stir together water, white wine, and gravy packet in a small bowl and pour into the skillet.',
    'Bring liquid to a simmer, cover, reduce heat to medium, and cook for 5 minutes. Turn chicken breasts and continue cooking until chicken is no longer pink in the center and the juices run clear, about 5 more minutes. An instant-read thermometer inserted into the center should read at least 165 degrees F (74 degrees C).',
  ],
);

export const yoastDomString =
  '<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://www.joyfulhealthyeats.com/#organization","name":"Joyful Healthy Eats","url":"https://www.joyfulhealthyeats.com/","sameAs":["https://www.facebook.com/joyfulhealthyeats","https://www.instagram.com/joyfulhealthyeats/","https://www.pinterest.com/jheats/","https://twitter.com/joyhealthyeats"],"logo":{"@type":"ImageObject","@id":"https://www.joyfulhealthyeats.com/#logo","inLanguage":"en-US","url":"https://www.joyfulhealthyeats.com/wp-content/uploads/2020/03/joyful.png","contentUrl":"https://www.joyfulhealthyeats.com/wp-content/uploads/2020/03/joyful.png","width":740,"height":338,"caption":"Joyful Healthy Eats"},"image":{"@id":"https://www.joyfulhealthyeats.com/#logo"}},{"@type":"WebSite","@id":"https://www.joyfulhealthyeats.com/#website","url":"https://www.joyfulhealthyeats.com/","name":"Joyful Healthy Eats","description":"Easy Healthy Recipes Using Real Ingredients","publisher":{"@id":"https://www.joyfulhealthyeats.com/#organization"},"potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://www.joyfulhealthyeats.com/?s={search_term_string}"},"query-input":"required name=search_term_string"}],"inLanguage":"en-US"},{"@type":"ImageObject","@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#primaryimage","inLanguage":"en-US","url":"https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7.jpg","contentUrl":"https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7.jpg","width":715,"height":1037,"caption":"overhead photo of Vegan Cookie Dough Energy Balls"},{"@type":"WebPage","@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#webpage","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/","name":"Vegan Cookie Dough Energy Balls | No Bake Energy Ball Recipe","isPartOf":{"@id":"https://www.joyfulhealthyeats.com/#website"},"primaryImageOfPage":{"@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#primaryimage"},"datePublished":"2019-04-05T09:00:12+00:00","dateModified":"2020-08-30T13:34:38+00:00","description":"Vegan Cookie Dough Energy Balls with 7 ingredients and no baking required! These bites make a great healthy snack or breakfast with only 111 calories.","breadcrumb":{"@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#breadcrumb"},"inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/"]}]},{"@type":"BreadcrumbList","@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.joyfulhealthyeats.com/"},{"@type":"ListItem","position":2,"name":"Recipes","item":"https://www.joyfulhealthyeats.com/recipes/"},{"@type":"ListItem","position":3,"name":"Appetizers &amp; Snacks","item":"https://www.joyfulhealthyeats.com/recipes/appetizers-snacks/"},{"@type":"ListItem","position":4,"name":"No Bake Vegan Cookie Dough Energy Balls"}]},{"@type":"Article","@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#article","isPartOf":{"@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#webpage"},"author":{"@id":"https://www.joyfulhealthyeats.com/#/schema/person/ec80ff9b9c2a558907a45ff38f7e5dcf"},"headline":"No Bake Vegan Cookie Dough Energy Balls","datePublished":"2019-04-05T09:00:12+00:00","dateModified":"2020-08-30T13:34:38+00:00","wordCount":913,"commentCount":8,"publisher":{"@id":"https://www.joyfulhealthyeats.com/#organization"},"image":{"@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#primaryimage"},"thumbnailUrl":"https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7.jpg","keywords":["Cinnamon","chocolate chips","chia seeds","chickpea","maple syrup","peanut butter","vanilla protein powder"],"articleSection":["Appetizers &amp; Snacks","Healthy Breakfasts","Dessert","Vegetarian","Gluten-Free","Kid Friendly","Vegan","No Bake"],"inLanguage":"en-US","potentialAction":[{"@type":"CommentAction","name":"Comment","target":["https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#respond"]}]},{"@type":"Person","@id":"https://www.joyfulhealthyeats.com/#/schema/person/ec80ff9b9c2a558907a45ff38f7e5dcf","name":"Krista","image":{"@type":"ImageObject","@id":"https://www.joyfulhealthyeats.com/#personlogo","inLanguage":"en-US","url":"https://www.joyfulhealthyeats.com/wp-content/uploads/2018/10/Krista-Rollins-Professional-Photos-5-96x96.jpg","contentUrl":"https://www.joyfulhealthyeats.com/wp-content/uploads/2018/10/Krista-Rollins-Professional-Photos-5-96x96.jpg","caption":"Krista"},"description":"I am the author, cook, and photographer for Joyful Healthy Eats. I have been married for almost 7 years to the most wonderful man ever. I have one son, but working on more, and love taking care of him as my full time job! I have a huge passion for healthy recipes, food, and EATING. :) Join me in the kitchen as I show you my newest creations!","sameAs":["https://joyfulhealthyeats.com","Joyfulhealthyeats","https://twitter.com/joyhealthyeats"]},{"@context":"https://schema.org/","@type":"Recipe","name":"No Bake Vegan Cookie Dough Energy Balls","description":"Vegan Cookie Dough Energy Balls made with 7 ingredients and no baking required! They are a great healthy snack or breakfast on the go with only 111 calories per bite - high protein, low carb and low sugar. ","author":{"@type":"Person","name":"Krista"},"keywords":"energy balls, energy ball recipes, energy bites, vegan energy balls, chocolate chip energy balls, high protein snacks, low sugar recipes, chickpea cookie dough,","image":["https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-225x225.jpg","https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-260x195.jpg","https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-320x180.jpg","https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7.jpg"],"url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/","recipeIngredient":["1 can of chickpeas, drained and rinsed","1/2 cup peanut butter","2 tablespoons maple syrup","1 teaspoon cinnamon","1 tablespoon chia seeds","1/4 cup vegan vanilla protein powder (I used Vegan Brand &#8211; pea protein)","1/3 cup vegan chocolate chips or cocoa nibs"],"recipeInstructions":[{"@type":"HowToStep","text":"Drain and rinse chickpeas. Place in a paper towel, dry off. If some of the skins start to come off peel them off and discard. (this will help the cookie dough not be as gritty)","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-1"},{"@type":"HowToStep","text":"Add chickpeas, peanut butter, maple syrup, chia seeds, protein powder and cinnamon to a food processor. Blend until smooth and creamy.","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-2"},{"@type":"HowToStep","text":"Add chickpea cookie dough mixture to a small bowl. Fold in the chocolate chips.","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-3"},{"@type":"HowToStep","text":"Roll into 1&#8243; balls. Serve immediately.","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-4"},{"@type":"HowToStep","text":"*** Can be stored in an airtight container in the refrigerator for up to 4 days. ***","url":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-5"}],"prepTime":"PT10M","totalTime":"PT10M","recipeYield":["15","15 Energy Balls"],"recipeCategory":"Snacks","cookingMethod":"No Bake","recipeCuisine":"American","aggregateRating":{"@type":"AggregateRating","reviewCount":"6","ratingValue":"5"},"nutrition":{"servingSize":"1 ball","calories":"111 calories","sugarContent":"2 g","sodiumContent":"80 mg","fatContent":"4 g","saturatedFatContent":"1 g","carbohydrateContent":"9 g","fiberContent":"3 g","proteinContent":"5 g","cholesterolContent":"0 mg","@type":"nutritionInformation"},"review":[{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Jade Manning"},"datePublished":"2019-04-05","reviewBody":"Nothing makes me happier than this recipe! Perfect little balls of delight!"},{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Sara Welch"},"datePublished":"2019-04-05","reviewBody":"What a great idea to use chickpeas! I never thought about that; I\'ll have to try this out!"},{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Chrissie Baker"},"datePublished":"2019-04-06","reviewBody":"Yum! And so easy!! Energy balls are some of my favorite snacks!"},{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Beth Pierce"},"datePublished":"2019-04-06","reviewBody":"I am loving this healthy and tasty recipe! It\'s a great way for me to get more protein throughout the day and enjoy a sweet treat at the same time!"},{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Catalina"},"datePublished":"2019-04-07","reviewBody":"This is the perfect snack for my kid\'s school lunch! I should make these balls for next week!"},{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"5"},"author":{"@type":"Person","name":"Patricia @ Grab a Plate"},"datePublished":"2019-04-07","reviewBody":"Love these goodies! I really like the cinnamon to spice things up!"}],"datePublished":"2019-04-05","@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#recipe","isPartOf":{"@id":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#article"},"mainEntityOfPage":"https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#webpage"}]}</script>';

export const yoastUrl =
  'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/';

export const yoastMetadataObject = {
  '@context': 'https://schema.org/',
  '@type': 'Recipe',
  name: 'No Bake Vegan Cookie Dough Energy Balls',
  description:
    'Vegan Cookie Dough Energy Balls made with 7 ingredients and no baking required! They are a great healthy snack or breakfast on the go with only 111 calories per bite - high protein, low carb and low sugar. ',
  author: {
    '@type': 'Person',
    name: 'Krista',
  },
  keywords:
    'energy balls, energy ball recipes, energy bites, vegan energy balls, chocolate chip energy balls, high protein snacks, low sugar recipes, chickpea cookie dough,',
  image: [
    'https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-225x225.jpg',
    'https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-260x195.jpg',
    'https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-320x180.jpg',
    'https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7.jpg',
  ],
  url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/',
  recipeIngredient: [
    '1 can of chickpeas, drained and rinsed',
    '1/2 cup peanut butter',
    '2 tablespoons maple syrup',
    '1 teaspoon cinnamon',
    '1 tablespoon chia seeds',
    '1/4 cup vegan vanilla protein powder (I used Vegan Brand &#8211; pea protein)',
    '1/3 cup vegan chocolate chips or cocoa nibs',
  ],
  recipeInstructions: [
    {
      '@type': 'HowToStep',
      text: 'Drain and rinse chickpeas. Place in a paper towel, dry off. If some of the skins start to come off peel them off and discard. (this will help the cookie dough not be as gritty)',
      url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-1',
    },
    {
      '@type': 'HowToStep',
      text: 'Add chickpeas, peanut butter, maple syrup, chia seeds, protein powder and cinnamon to a food processor. Blend until smooth and creamy.',
      url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-2',
    },
    {
      '@type': 'HowToStep',
      text: 'Add chickpea cookie dough mixture to a small bowl. Fold in the chocolate chips.',
      url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-3',
    },
    {
      '@type': 'HowToStep',
      text: 'Roll into 1&#8243; balls. Serve immediately.',
      url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-4',
    },
    {
      '@type': 'HowToStep',
      text: '*** Can be stored in an airtight container in the refrigerator for up to 4 days. ***',
      url: 'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#instruction-step-5',
    },
  ],
  prepTime: 'PT10M',
  totalTime: 'PT10M',
  recipeYield: ['15', '15 Energy Balls'],
  recipeCategory: 'Snacks',
  cookingMethod: 'No Bake',
  recipeCuisine: 'American',
  aggregateRating: {
    '@type': 'AggregateRating',
    reviewCount: '6',
    ratingValue: '5',
  },
  nutrition: {
    servingSize: '1 ball',
    calories: '111 calories',
    sugarContent: '2 g',
    sodiumContent: '80 mg',
    fatContent: '4 g',
    saturatedFatContent: '1 g',
    carbohydrateContent: '9 g',
    fiberContent: '3 g',
    proteinContent: '5 g',
    cholesterolContent: '0 mg',
    '@type': 'nutritionInformation',
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Jade Manning',
      },
      datePublished: '2019-04-05',
      reviewBody:
        'Nothing makes me happier than this recipe! Perfect little balls of delight!',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Sara Welch',
      },
      datePublished: '2019-04-05',
      reviewBody:
        "What a great idea to use chickpeas! I never thought about that; I'll have to try this out!",
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Chrissie Baker',
      },
      datePublished: '2019-04-06',
      reviewBody:
        'Yum! And so easy!! Energy balls are some of my favorite snacks!',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Beth Pierce',
      },
      datePublished: '2019-04-06',
      reviewBody:
        "I am loving this healthy and tasty recipe! It's a great way for me to get more protein throughout the day and enjoy a sweet treat at the same time!",
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Catalina',
      },
      datePublished: '2019-04-07',
      reviewBody:
        "This is the perfect snack for my kid's school lunch! I should make these balls for next week!",
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Patricia @ Grab a Plate',
      },
      datePublished: '2019-04-07',
      reviewBody:
        'Love these goodies! I really like the cinnamon to spice things up!',
    },
  ],
  datePublished: '2019-04-05',
  '@id':
    'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#recipe',
  isPartOf: {
    '@id':
      'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#article',
  },
  mainEntityOfPage:
    'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/#webpage',
};

export const yoastRecipe = mockRecipe(
  'https://www.joyfulhealthyeats.com/no-bake-vegan-cookie-dough-energy-balls/',
  'No Bake Vegan Cookie Dough Energy Balls',
  'https://www.joyfulhealthyeats.com/wp-content/uploads/2019/04/Vegan-Cookie-Dough-Energy-Balls-web-7-225x225.jpg',
  [
    '1 can of chickpeas, drained and rinsed',
    '1/2 cup peanut butter',
    '2 tablespoons maple syrup',
    '1 teaspoon cinnamon',
    '1 tablespoon chia seeds',
    '1/4 cup vegan vanilla protein powder (I used Vegan Brand &#8211; pea protein)',
    '1/3 cup vegan chocolate chips or cocoa nibs',
  ],
  [
    'Drain and rinse chickpeas. Place in a paper towel, dry off. If some of the skins start to come off peel them off and discard. (this will help the cookie dough not be as gritty)',
    'Add chickpeas, peanut butter, maple syrup, chia seeds, protein powder and cinnamon to a food processor. Blend until smooth and creamy.',
    'Add chickpea cookie dough mixture to a small bowl. Fold in the chocolate chips.',
    'Roll into 1&#8243; balls. Serve immediately.',
    '*** Can be stored in an airtight container in the refrigerator for up to 4 days. ***',
  ],
);
