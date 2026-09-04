export const RECIPE_STEPS: Record<string, string[]> = {
  '1': [
    'Soak rice and urad dal for 4–6 hours, then grind to a smooth batter and ferment overnight.',
    'Boil potatoes with spices; mash into a dry masala filling with mustard seeds and curry leaves.',
    'Spread batter thin on a hot tawa, add filling, fold, and cook until crisp and golden.',
    'Blend fresh coconut with green chillies for chutney; serve dosa hot with chutney.',
  ],
  '2': [
    'Sauté onions and tomatoes until soft; blend with cashews into a smooth gravy base.',
    'Return gravy to pan, add butter, cream, and spices; simmer until rich and glossy.',
    'Add paneer cubes gently; coat in gravy without breaking them.',
    'Garnish with cream and serve with naan or rice.',
  ],
  '3': [
    'Beat eggs with salt; finely chop onion, tomato, and green chilli.',
    'Heat oil, sauté onions until golden, then add tomato and spices.',
    'Pour in eggs and scramble on high heat until fluffy but moist.',
    'Toast pav with butter and serve bhurji stuffed in pav.',
  ],
  '4': [
    'Marinate chicken in yogurt, ginger-garlic paste, and biryani spices for 30 minutes.',
    'Par-cook basmati rice with whole spices until 70% done; drain.',
    'Layer rice and chicken in a heavy pot; add saffron milk and fried onions.',
    'Seal and dum-cook on low heat 25 minutes; rest 10 minutes before serving.',
  ],
  '5': [
    'Boil and mash potatoes with cumin, chilli, and salt for the filling.',
    'Knead atta into a soft dough; roll a disc, stuff with potato, seal, and roll again.',
    'Cook on a tawa with ghee until golden spots appear on both sides.',
    'Serve hot with fresh dahi and pickle.',
  ],
  '6': [
    'Pressure-cook dal with turmeric until soft; mash lightly.',
    'Prepare jeera rice: temper cumin in ghee, add rice and water, cook until fluffy.',
    'For tadka, sizzle garlic, cumin, and dried red chilli in ghee; pour over dal.',
    'Serve dal tadka with jeera rice and a wedge of lemon.',
  ],
  '7': [
    'Rinse poha and drain; keep aside to soften for 5 minutes.',
    'Temper mustard seeds, curry leaves, and peanuts in oil.',
    'Add onion and green chilli; stir in poha, turmeric, salt, and lemon juice.',
    'Cover for 2 minutes; serve garnished with coriander.',
  ],
  '8': [
    'Marinate fish with turmeric and salt; lightly fry until golden.',
    'Make a paste of mustard seeds and green chilli; sauté with tomato.',
    'Add water and simmer gravy; gently slide fish in and cook 8–10 minutes.',
    'Serve with steamed rice and extra mustard oil on top.',
  ],
  '9': [
    'Blanch palak and blend to a smooth purée.',
    'Sauté onion, ginger, and garlic; add spices and palak purée; simmer.',
    'Add paneer cubes and cream; cook gently for 5 minutes.',
    'Roll atta into phulkas on tawa; serve bowl with roti on the side.',
  ],
  '10': [
    'Fluff leftover rice to separate grains.',
    'Temper mustard seeds, peanuts, and curry leaves in oil.',
    'Add onion, green chilli, turmeric, and rice; toss on high heat.',
    'Finish with lemon juice and fresh coriander.',
  ],
  '11': [
    'Hard-boil eggs, peel, and lightly fry until blistered.',
    'Cook onion-tomato masala with ginger-garlic and Bengali spices.',
    'Add water for gravy consistency; simmer eggs 10 minutes.',
    'Serve with fresh roti and sliced onion.',
  ],
  '12': [
    'Wash and dry bhindi; slice and shallow-fry until crisp.',
    'Pressure-cook moong dal with turmeric until soft.',
    'Temper dal with cumin, garlic, and dried chilli.',
    'Plate bhindi masala with dal and rice or roti.',
  ],
  '13': [
    'Sauté onion-tomato paste with ginger-garlic and garam masala.',
    'Add peas and a splash of water; simmer until peas are tender.',
    'Add paneer and cream; cook gently without stirring too much.',
    'Serve with butter naan or jeera rice.',
  ],
  '14': [
    'Marinate chicken chunks in yogurt, tandoori masala, and lemon for 1 hour.',
    'Grill or pan-sear chicken until charred and cooked through.',
    'Warm roomali roti; spread mint chutney and sliced onion.',
    'Wrap chicken in roti and serve immediately.',
  ],
  '15': [
    'Dry-roast rava until fragrant; set aside.',
    'Temper mustard seeds, urad dal, curry leaves, and vegetables in oil.',
    'Add water, salt, and rava; stir continuously to avoid lumps.',
    'Cover and steam 3 minutes; serve hot with coconut chutney.',
  ],
};

export function getRecipeSteps(recipeId: string, title: string): string[] {
  return (
    RECIPE_STEPS[recipeId] ?? [
      `Gather all ingredients for ${title}.`,
      'Prep vegetables and measure spices before you start cooking.',
      'Cook following traditional method — adjust heat and salt to taste.',
      'Rest briefly, garnish, and serve fresh.',
    ]
  );
}
