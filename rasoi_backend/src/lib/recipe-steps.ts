import type { Recipe } from '@/lib/db/types';
import type { RecipeIngredient } from '@/lib/types';

function parseJsonArray<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export type RecipeStepInput = {
  title: string;
  kitchenStyleId: string;
  dietType: string;
  ingredients: RecipeIngredient[];
  description?: string;
  difficulty?: string;
  prepTime: number;
  steps?: string[];
};

const DETAILED_STEP_COUNT = 5;

export function stepsLookVague(steps: string[]): boolean {
  if (steps.length === 0) return true;
  const vague = [
    'Prepare and portion ingredients',
    'Cook the base tempering',
    'Add hero ingredients',
    'Finish with garnish and serve hot',
    'Adjust gravy consistency, finish with fresh coriander',
    'Wash, peel, and cut',
    'until vegetables or protein are tender but hold shape',
  ];
  return steps.some((step) => vague.some((pattern) => step.includes(pattern)));
}

function heroIngredient(ingredients: RecipeIngredient[]): string {
  return ingredients.find((item) => !item.isStaple)?.name ?? ingredients[0]?.name ?? 'the main ingredient';
}

function heroIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  return ingredients.filter((item) => !item.isStaple);
}

function stapleIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  return ingredients.filter((item) => item.isStaple);
}

function names(items: RecipeIngredient[]): string[] {
  return items.map((item) => item.name);
}

function joinNames(items: string[], max = 10): string {
  const slice = items.slice(0, max);
  if (slice.length === 0) return 'the listed ingredients';
  if (slice.length === 1) return slice[0];
  if (slice.length === 2) return `${slice[0]} and ${slice[1]}`;
  return `${slice.slice(0, -1).join(', ')}, and ${slice[slice.length - 1]}`;
}

function findByPattern(ingredients: RecipeIngredient[], patterns: RegExp[]): string | undefined {
  for (const item of ingredients) {
    const lower = item.name.toLowerCase();
    if (patterns.some((pattern) => pattern.test(lower))) return item.name;
  }
  return undefined;
}

function restMinutes(prepTime: number): number {
  if (prepTime <= 20) return 10;
  if (prepTime <= 35) return 15;
  return 20;
}

function normalizeIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  return ingredients.filter((item) => item?.name?.trim());
}

function detectDishKind(title: string, ingredients: RecipeIngredient[]): string {
  const t = title.toLowerCase();
  const ing = normalizeIngredients(ingredients)
    .map((item) => item.name.toLowerCase())
    .join(' ');

  if (
    t.includes('chaat') ||
    t.includes('bhel') ||
    t.includes('pani puri') ||
    t.includes('tikki') ||
    t.includes('dabeli') ||
    t.includes('frankie') ||
    t.includes('ragda') ||
    t.includes('misal') ||
    t.includes('pattice') ||
    t.includes('kathi roll')
  ) {
    return 'chaat';
  }
  if (
    t.includes('bhaja') ||
    t.includes('fry') ||
    t.includes('tikka') ||
    t.includes('pakoda') ||
    t.includes('vada') ||
    t.includes('fafda') ||
    t.includes('gota') ||
    t.includes('kachori')
  ) {
    return 'fried';
  }
  if (t.includes('dhebra') || ((t.includes('bajri') || t.includes('bajra')) && !t.includes('dal'))) return 'dhebra';
  if (t.includes('khandvi') || t.includes('locho') || t.includes('khichu') || t.includes('dhokla') || t.includes('khaman')) {
    return 'steamed';
  }
  if (t.includes('biryani') || t.includes('pulao') || t.includes('pulav')) return 'rice-layered';
  if (t.includes('khichdi') || t.includes('khichri')) return 'khichdi';
  if (
    t.includes('paratha') ||
    t.includes('thepla') ||
    t.includes('roti') ||
    t.includes('rotla') ||
    t.includes('bhakri') ||
    t.includes('missi') ||
    t.includes('naan') ||
    t.includes('kulcha') ||
    t.includes('luchi')
  ) {
    return 'bread';
  }
  if (t.includes('puri') && !t.includes('puri bhaji')) return 'chaat';
  if (t.includes('poha') || t.includes('upma') || t.includes('sheera')) return 'breakfast-grain';
  if (t.includes('rasam') || t.includes('sambar')) return 'south-broth';
  if ((t.includes('dal') || t.includes('kadhi') || t.includes('rasawala')) && !ing.includes('dhebra')) {
    return 'dal';
  }
  if (
    t.includes('halwa') ||
    t.includes('sheero') ||
    t.includes('payesh') ||
    t.includes('kheer') ||
    t.includes('ladoo') ||
    t.includes('mithai') ||
    t.includes('papdi') ||
    t.includes('barfi') ||
    t.includes('mohanthal') ||
    t.includes('sukhdi') ||
    t.includes('modak') ||
    t.includes('pinni') ||
    t.includes('bebinca') ||
    t.includes('shufta') ||
    t.includes('meetha') ||
    t.includes('mysore pak') ||
    t.includes('mishti doi') ||
    t.includes('pitha') ||
    t.includes('puran poli')
  ) {
    return 'sweet';
  }
  if (t.includes('kofta') || t.includes('gatta') || t.includes('muthia')) return 'kofta';
  if (t.includes('fish') || t.includes('ilish') || t.includes('bhetki') || t.includes('rui') || t.includes('katla')) {
    return 'fish';
  }
  if (t.includes('chicken') || t.includes('murgh') || t.includes('mutton') || t.includes('keema') || t.includes('rogan josh') || t.includes('yakhni') || t.includes('haleem') || t.includes('kosha') || t.includes('aattu kari')) return 'meat';
  if (t.includes('egg') || t.includes('anda') || t.includes('omelette')) return 'egg';
  if (t.includes('chutney') || t.includes('pickle') || t.includes('launji')) return 'condiment';
  if (t.includes('dosa') || t.includes('idli') || t.includes('uttapam') || t.includes('appam')) return 'fermented';
  if (t.includes('steamed') || t.includes('bhapa') || t.includes('paturi') || t.includes('handvo') || t.includes('dhokla')) {
    return 'steamed';
  }
  if (
    t.includes('curry') ||
    t.includes('masala') ||
    t.includes('jhol') ||
    t.includes('kalia') ||
    t.includes('shaak') ||
    t.includes('sabzi') ||
    t.includes('tameta') ||
    t.includes('sev tameta')
  ) {
    return 'curry';
  }
  return 'curry';
}

function cuisineTemperOil(kitchenStyleId: string): string {
  const map: Record<string, string> = {
    gujarati: 'rai, hing, and curry leaves in groundnut oil',
    bengali: 'panch phoron and slit green chilli in mustard oil',
    punjabi: 'jeera, bay leaf, and crushed garlic in desi ghee',
    rajasthani: 'jeera, mathania mirch, and hing in ghee',
    south: 'rai, urad dal, and curry leaves in sesame or coconut oil',
    kerala: 'curry leaves, mustard seeds, and fenugreek in coconut oil',
    chettinad: 'fennel, cinnamon, and curry leaves in sesame oil',
    hyderabadi: 'shahi jeera, cardamom, and fried onions in ghee',
    goan: 'curry leaves and sliced onion in coconut oil',
    maharashtrian: 'rai, jeera, and hing in peanut oil',
    kashmiri: 'green cardamom and cinnamon in mustard oil',
    assamese: 'panch phoron in mustard oil',
    chinese: 'garlic, ginger, and spring onion in hot wok oil',
    street: 'bhaji masala and butter on a hot tawa',
    north: 'jeera, tej patta, and ginger-garlic paste in ghee',
  };
  return map[kitchenStyleId] ?? 'whole spices in hot oil';
}

function servingPairing(kitchenStyleId: string, kind: string): string {
  const map: Record<string, string> = {
    gujarati: 'garlic chutney, mango pickle, or masala chai',
    bengali: 'steamed rice and a wedge of lemon',
    punjabi: 'butter naan, roti, or jeera rice',
    rajasthani: 'bajra roti, churma, and lasun chutney',
    south: 'sambar, coconut chutney, and filter coffee',
    kerala: 'appam, puttu, or matta rice',
    chettinad: 'steamed rice and onion raita',
    hyderabadi: 'raita, salan, and mirchi ka salan',
    goan: 'poee, rice, and lime pickle',
    maharashtrian: 'bhakri, thecha, and koshimbir',
    kashmiri: 'steamed rice and haak',
    assamese: 'steamed rice and aloo pitika',
    chinese: 'fried rice or hakka noodles on the side',
    street: 'green chutney, sliced onion, and lemon',
    north: 'tandoori roti, paratha, or steamed basmati rice',
  };
  const base = map[kitchenStyleId] ?? 'roti, rice, or a fresh salad';
  if (kind === 'bread' || kind === 'dhebra') return map.gujarati ?? base;
  if (kind === 'rice-layered') return 'raita, salan, and sliced onion salad';
  if (kind === 'dal') return 'steamed rice, jeera rice, or tandoori roti';
  if (kind === 'chaat') return 'extra sev, coriander, and a squeeze of lemon at the table';
  if (kind === 'sweet') return 'a warm cup of chai or as a festive dessert plate';
  return base;
}

function regionalTip(input: RecipeStepInput, kind: string): string {
  const tips: Record<string, string> = {
    gujarati:
      kind === 'dhebra' || kind === 'bread'
        ? 'Kathiawadi tip: extra jaggery and fresh methi give the authentic sweet-spicy flavour.'
        : 'Balance sweet, sour, and spice — a pinch of gud or lemon at the end lifts Gujarati dishes.',
    bengali: 'Mustard oil should smoke lightly before you start; it removes the raw pungency.',
    punjabi: 'Finish with a knob of butter or cream for restaurant-style richness.',
    south: 'Use coconut oil or ghee for tempering — it carries aroma better than plain refined oil.',
    street: 'Serve immediately while textures are still crisp and contrasts are sharp.',
  };
  return tips[input.kitchenStyleId] ?? 'Taste and adjust salt, spice, and acidity just before serving.';
}

function dryMixDescription(input: RecipeStepInput): string {
  const all = input.ingredients;
  const flour =
    findByPattern(all, [/bajra|bajri/, /jowar/, /atta|flour|maida|besan|rava|sooji/, /rice/]) ??
    heroIngredient(all);
  const greens = names(all.filter((item) => /methi|palak|coriander|dhania|spinach/i.test(item.name)));
  const aromatics = names(
    all.filter((item) => /mirch|chilli|adrak|ginger|lasan|garlic|jeera|cumin|ajwain|til|sesame|haldi|turmeric/i.test(item.name)),
  );
  const parts = [flour, ...greens, ...aromatics.slice(0, 5), 'salt'].filter(Boolean);
  return joinNames([...new Set(parts)]);
}

function wetBinderDescription(input: RecipeStepInput): string {
  const parts: string[] = [];
  const jaggery = findByPattern(input.ingredients, [/gud|jaggery/]);
  const curd = findByPattern(input.ingredients, [/dahi|curd|yogurt/]);
  const oil = findByPattern(input.ingredients, [/tel|oil|ghee/]);
  if (jaggery) parts.push(`1 tbsp grated ${jaggery.toLowerCase()}`);
  if (curd) parts.push(`2 tbsp ${curd.toLowerCase()}`);
  parts.push(oil ? `1–2 tbsp ${oil.toLowerCase()}` : '1–2 tbsp oil');
  return parts.join(', ');
}

function buildDhebraSteps(input: RecipeStepInput): string[] {
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'dhebra');
  const tip = regionalTip(input, 'dhebra');
  const hasBajra = input.ingredients.some((item) => /bajra|bajri/i.test(item.name));
  const combine = hasBajra
    ? dryMixDescription(input)
    : '2 cups bajra (pearl millet) flour, ¼ cup wheat flour, ½ cup finely chopped methi, coriander, green chillies, ginger-garlic paste, sesame seeds, ajwain, cumin, turmeric, and salt';
  const binders = hasBajra
    ? wetBinderDescription(input)
    : '1 tbsp grated jaggery, 2 tbsp curd, and 1–2 tbsp oil';

  return [
    `In a large bowl, combine ${combine}.`,
    `Add ${binders}. Mix well, then gradually add warm water and knead into a soft dough. Cover and rest for 10 minutes.`,
    `Divide into lemon-sized balls. Grease palms or use a plastic sheet and pat each ball into a thick 4–5 inch disc — dhebra are thicker than roti.`,
    `Heat a tawa on medium flame. Cook each dhebra with a little oil or ghee around the edges until golden spots appear, then flip and cook the other side on medium-low until crisp outside and cooked through inside.`,
    `Serve ${title} hot with ${pairing}. ${tip}`,
  ];
}

function buildTheplaSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const staples = joinNames(names(stapleIngredients(input.ingredients).slice(0, 5)));
  const title = input.title;

  return [
    `In a large bowl, combine whole wheat atta, chopped ${hero}, ${staples}, salt, turmeric, ajwain, a spoon of oil, and enough dahi or water to bring the mix together.`,
    `Knead into a medium-soft dough for 4–5 minutes, then rest covered for 15–20 minutes so the greens release moisture and the dough rolls without cracking.`,
    `Divide into equal balls, roll each into a thin disc using dry atta for dusting, and keep rolled theplas covered so they do not dry out.`,
    `Roast on a hot tawa on medium heat, pressing lightly with a cloth until light brown spots appear; flip, brush a few drops of oil on both sides, and cook until evenly done.`,
    `Stack ${title} in a cloth-lined container to stay soft and serve hot with chunda, pickle, or curd. ${regionalTip(input, 'bread')}`,
  ];
}

function buildBreadSteps(input: RecipeStepInput): string[] {
  const t = input.title.toLowerCase();
  if (t.includes('thepla') || t.includes('methi')) return buildTheplaSteps(input);
  if (t.includes('dhebra') || t.includes('bajri') || t.includes('bajra')) return buildDhebraSteps(input);

  const hero = heroIngredient(input.ingredients);
  const dry = joinNames(names(input.ingredients.slice(0, 8)));
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'bread');

  return [
    `In a large bowl, combine ${dry} with salt and a little oil. Mix, then add warm water gradually and knead into a soft, pliable dough.`,
    `Cover and rest the dough for ${restMinutes(input.prepTime)} minutes. Prepare any stuffing with ${hero} and cook it until dry if the bread is stuffed.`,
    `Divide into equal portions, roll gently with light pressure, and dust with dry flour so the bread does not stick or tear.`,
    `Heat a tawa until a drop of water sizzles. Cook on medium heat with ghee or oil, pressing edges until golden brown spots appear on both sides.`,
    `Serve ${title} hot with ${pairing}. ${regionalTip(input, 'bread')}`,
  ];
}

function buildCurrySteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const onion = findByPattern(input.ingredients, [/pyaaz|onion/]) ?? 'finely chopped onion';
  const tomato = findByPattern(input.ingredients, [/tamatar|tomato/]) ?? 'chopped tomato';
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'curry');

  return [
    `Heat 2 tbsp oil or ghee in a kadai, add ${temper}, then ${onion} and ginger-garlic paste. Sauté on medium heat until the onion turns golden and aromatic (about 6–8 minutes).`,
    `Add ${tomato}, turmeric, coriander powder, and chilli powder. Cook until the masala thickens, oil separates, and the raw tomato smell disappears (about 8–10 minutes).`,
    `Add ${hero}, salt, and a splash of hot water. Cover and cook on medium-low until tender but still holding shape, stirring once or twice so nothing sticks.`,
    `Uncover, adjust gravy to your preferred consistency, and simmer 2–3 minutes so flavours concentrate. Taste and balance with lemon, gud, or garam masala.`,
    `Finish ${title} with fresh coriander and a spoon of ghee if desired. Serve hot with ${pairing}. ${regionalTip(input, 'curry')}`,
  ];
}

function buildDalSteps(input: RecipeStepInput): string[] {
  const dal = heroIngredient(input.ingredients);
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'dal');

  return [
    `Wash ${dal} until water runs clear. Pressure-cook with turmeric, a few drops of oil, and enough water until completely soft (3–4 whistles). Mash lightly for a creamy texture.`,
    `Heat ghee or oil in a small pan, add ${temper}, then ginger-garlic and chopped tomato. Cook until the tadka smells roasted and the tomato melts into the oil.`,
    `Pour the hot tadka into the boiled dal, add salt, and simmer uncovered for 8–10 minutes so flavours meld. Add hot water if the dal is too thick.`,
    `Adjust consistency so the dal coats the back of a spoon. Balance with jaggery, amchur, or lemon depending on whether you want sweet, sour, or tangy notes.`,
    `Serve ${title} hot with a final temper drizzle if you like, fresh coriander on top, and ${pairing}. ${regionalTip(input, 'dal')}`,
  ];
}

function buildRiceLayeredSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'rice-layered');

  return [
    `Wash and soak basmati rice for 20 minutes. Marinate ${hero} with yogurt, ginger-garlic paste, salt, red chilli, and biryani spices for at least 30 minutes.`,
    `Par-boil rice with tej patta, elaichi, and laung until 70% cooked; drain and spread on a tray so grains do not overcook while you prepare the layers.`,
    `In a heavy handi, layer fried onions, marinated ${hero}, mint, coriander, and rice. Drizzle saffron milk and ghee between layers for aroma and colour.`,
    `Seal the pot with dough or a tight lid. Cook on high for 3 minutes, then on the lowest heat (dum) for 25–30 minutes without opening the lid.`,
    `Rest ${title} for 10 minutes off heat, then fluff gently from the sides. Serve hot with ${pairing}. ${regionalTip(input, 'rice-layered')}`,
  ];
}

function buildKhichdiSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'khichdi');

  return [
    `Wash rice and ${hero} together until water runs clear. Soak for 15 minutes if using whole lentils so both cook evenly.`,
    `Heat ghee, crackle cumin and hing, then sauté chopped onion, ginger, and green chilli until soft and fragrant.`,
    `Add drained rice-lentils, turmeric, salt, and hot water in roughly a 1:3 ratio. Bring to a boil, then reduce heat, cover, and cook until creamy.`,
    `Stir once halfway through and add small splashes of hot water if the khichdi thickens too quickly. It should be soft, comforting, and slightly mushy.`,
    `Finish ${title} with ghee, fresh coriander, and cracked pepper. Serve hot with ${pairing}. ${regionalTip(input, 'khichdi')}`,
  ];
}

function buildFermentedSteps(input: RecipeStepInput): string[] {
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'fermented');

  return [
    `Soak rice and urad dal separately for 4–6 hours, then grind to a smooth batter. Ferment overnight in a warm place until airy, slightly risen, and mildly sour.`,
    `Adjust batter thickness with cold water and add salt just before cooking. For dosa, the batter should spread thin; for idli, it should be thick and pourable.`,
    `Heat a seasoned tawa or grease idli moulds. Spread dosa batter thin and evenly, or pour idli batter into moulds without overfilling.`,
    `Cook dosa covered on medium heat until edges lift and the centre sets; flip only if you want browning on both sides. Steam idlis for 10–12 minutes until a skewer comes out clean.`,
    `Serve ${title} hot off the stove with ${pairing}. ${regionalTip(input, 'fermented')}`,
  ];
}

function buildFriedSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'fried');

  return [
    `Cut ${hero} into even pieces, pat completely dry, and season with salt, turmeric, and spice powders. Rest 10 minutes so the seasoning adheres.`,
    `Prepare a seasoned batter or dry coating with besan or rice flour, ajwain, chilli, and salt. The coating should cling without becoming too thick.`,
    `Heat oil to medium-hot — a small drop of batter should sizzle steadily without burning. Fry in small batches without crowding until crisp and evenly golden.`,
    `Drain on a wire rack or paper towel so excess oil drips off and the crust stays crisp. Sprinkle chaat masala or salt while still hot if needed.`,
    `Serve ${title} immediately with ${pairing}. ${regionalTip(input, 'fried')}`,
  ];
}

function buildMeatSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'meat');

  return [
    `Marinate ${hero} with yogurt, ginger-garlic paste, chilli, and salt for at least 30 minutes (overnight for tougher cuts). Bring to room temperature before cooking.`,
    `Brown marinated pieces in hot oil on high heat in batches to seal juices; do not crowd the pan. Remove and keep aside.`,
    `In the same pot, cook onion until deep golden, add tomato and spice powders, and sauté with ${temper} until oil clearly separates from the masala.`,
    `Return the meat, add hot water or stock to half-cover, cover, and simmer until tender. Pressure-cook if the cut needs longer cooking.`,
    `Finish ${title} with garam masala, kasuri methi, or cream if needed. Rest 5 minutes and serve hot with ${pairing}. ${regionalTip(input, 'meat')}`,
  ];
}

function buildFishSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'fish');

  return [
    `Clean and pat dry ${hero}. Marinate with turmeric, salt, and lemon for 10 minutes; score thick fillets lightly so heat penetrates evenly.`,
    `Heat mustard or sesame oil until it shimmers. Sear fish on medium heat until the skin side is golden, then flip carefully once.`,
    `Build gravy with ${temper}, onion paste, ginger, and tomato — or mustard paste for Bengali-style dishes. Cook until the raw smell disappears.`,
    `Return fish to the pan, add warm water if needed, and simmer gently until flakes separate but pieces stay intact (usually 6–10 minutes).`,
    `Rest ${title} for 2 minutes off heat. Serve hot with ${pairing}. ${regionalTip(input, 'fish')}`,
  ];
}

function buildEggSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'egg');

  return [
    `Boil or whisk ${hero} depending on the dish. For curries, peel boiled eggs and make shallow slits so masala penetrates during simmering.`,
    `Prepare masala with ${temper}, onion, tomato, and ginger-garlic on medium heat until thick, fragrant, and oil begins to separate.`,
    `Add spice powders and a splash of water to form a gravy that coats a spoon. Slide eggs in and roll gently to coat without breaking.`,
    `Simmer on low for 5–8 minutes so eggs absorb flavour without turning rubbery. Baste with gravy once or twice during cooking.`,
    `Serve ${title} hot with ${pairing}. ${regionalTip(input, 'egg')}`,
  ];
}

function buildSweetSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'sweet');

  return [
    `Measure ${hero}, sugar or jaggery, and ghee or milk precisely. Grease a tray or plate if you are setting barfi, halwa, or fudge.`,
    `Cook the base on medium-low heat, stirring continuously so it does not catch, until it thickens and begins to leave the sides of the pan.`,
    `Add cardamom, nuts, or saffron once the mixture looks glossy and most liquid has reduced. Stir vigorously so flavours distribute evenly.`,
    `Pour or shape while still warm; score barfi or roll ladoo before the mix fully sets so portions stay neat and uniform.`,
    `Cool ${title} completely before storing. Serve at room temperature with ${pairing}. ${regionalTip(input, 'sweet')}`,
  ];
}

function buildChaatSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'chaat');

  return [
    `Prep all components separately: cook or spice the base (${hero}), whisk fresh dahi until smooth, and keep green and sweet chutneys ready in squeeze bottles.`,
    `Crisp the base (puri, papdi, pav, or patty) just before assembly so it stays crunchy — warm briefly or fry if needed.`,
    `Layer filling, chutneys, chaat masala, and sev in an order that keeps wet and dry textures distinct. Work quickly once dahi is added.`,
    `Top with chopped onion, coriander, and a generous squeeze of lemon at the last second so citrus stays bright.`,
    `Serve ${title} immediately on a plate while crisp and cold elements still contrast. ${regionalTip(input, 'chaat')}`,
  ];
}

function buildSteamedSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'steamed');
  const t = input.title.toLowerCase();

  if (t.includes('khandvi')) {
    return [
      `Whisk ${hero}, dahi, turmeric, and ginger paste into a smooth lump-free batter. Cook in a wide pan on low heat, stirring constantly until thick enough to spread.`,
      `Spread the hot batter thinly on a greased surface or back of plates while still warm. Let it set for 5 minutes, then roll tightly into logs and slice into rounds.`,
      `Heat oil, add mustard seeds, sesame seeds, and curry leaves for tempering. Pour over the rolled khandvi and garnish with fresh coriander and coconut.`,
      `Rest ${title} for 2 minutes so the tempering sinks in. The rolls should be silky, pale yellow, and lightly tangy.`,
      `Serve ${title} at room temperature or slightly warm with ${pairing}. ${regionalTip(input, 'steamed')}`,
    ];
  }

  return [
    `Prepare batter or filling with ${hero}. Grease steaming trays, moulds, or wraps so the dish lifts cleanly after cooking.`,
    `Spread or pour the mix evenly — for khaman or dhokla, ferment batter if required before steaming.`,
    `Steam on medium heat with a tight lid for 12–25 minutes until a skewer comes out clean or the centre is fully set.`,
    `Rest ${title} for 5 minutes off heat, then cut or unmould carefully. Temper with mustard, curry leaves, and sesame if the recipe needs it.`,
    `Serve ${title} hot with ${pairing}. ${regionalTip(input, 'steamed')}`,
  ];
}

function buildBreakfastGrainSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'breakfast-grain');
  const temper = cuisineTemperOil(input.kitchenStyleId);

  return [
    `Rinse and drain ${hero} until water runs almost clear. Spread on a tray briefly if the recipe needs dry grains before tempering.`,
    `Heat oil or ghee, add ${temper}, then peanuts or curry leaves if used. Sauté onion and green chilli until fragrant.`,
    `Add turmeric, salt, and the main grain. Toss on medium heat so every grain is coated and lightly toasted without breaking.`,
    `Add a measured splash of water only if needed, cover, and steam on low for 2–4 minutes until tender. Fluff with a fork.`,
    `Finish ${title} with lemon juice, fresh coriander, and sev or coconut if needed. Serve immediately with ${pairing}.`,
  ];
}

function buildSouthBrothSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'south-broth');
  const temper = cuisineTemperOil(input.kitchenStyleId);

  return [
    `Soak tamarind in warm water and extract pulp, or keep rasam or sambar powder ready. Cook toor dal separately if the recipe needs body.`,
    `Dry-roast or bloom spices until aromatic; add to tamarind water or tomato base with salt and turmeric.`,
    `Simmer until raw sourness mellows and the broth smells balanced (about 8–10 minutes). Do not boil hard.`,
    `Add cooked dal, vegetables, or ${hero} if using. Simmer gently until everything is tender and flavours meld.`,
    `Finish with a fresh temper of ${temper} and curry leaves. Serve ${title} hot with ${pairing}.`,
  ];
}

function buildKoftaSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, 'kofta');
  const temper = cuisineTemperOil(input.kitchenStyleId);

  return [
    `Prepare kofta mix with ${hero}, binding (besan or mashed potato), spices, and herbs. Shape into even balls so they cook uniformly.`,
    `Shallow-fry or bake koftas until golden outside and cooked through. Drain and set aside so they hold shape in gravy.`,
    `Cook onion-tomato masala with ${temper} until oil separates and the base is thick and aromatic (about 12–15 minutes).`,
    `Add water or yogurt to make gravy, bring to a gentle simmer, then slide koftas in and cook 5–7 minutes without stirring hard.`,
    `Garnish ${title} with cream or coriander and serve hot with ${pairing}. ${regionalTip(input, 'kofta')}`,
  ];
}

function buildCondimentSteps(input: RecipeStepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const title = input.title;
  const temper = cuisineTemperOil(input.kitchenStyleId);

  return [
    `Wash and prep ${hero}. Roast, blanch, or peel as needed to reduce raw bitterness or excess moisture.`,
    `Grind or mash with salt, chilli, and acid (lemon, raw mango, or tamarind) to the texture required — coarse for chutney, smooth for paste.`,
    `Temper with ${temper} in a small pan and pour over the mix if the dish needs a final aroma boost.`,
    `Cool completely before storing in a clean jar so condensation does not thin the condiment.`,
    `Serve ${title} as a side with meals or snacks. ${regionalTip(input, 'condiment')}`,
  ];
}

function buildGenericSteps(input: RecipeStepInput, kind: string): string[] {
  const hero = heroIngredient(input.ingredients);
  const combine = joinNames(names(input.ingredients.slice(0, 8)));
  const title = input.title;
  const pairing = servingPairing(input.kitchenStyleId, kind);
  const temper = cuisineTemperOil(input.kitchenStyleId);

  return [
    `Gather and prep ${combine}. Wash, peel, and chop everything before you start so the cooking flow stays smooth.`,
    `Heat oil or ghee, add ${temper}, then onion and ginger-garlic. Sauté on medium heat until aromatic and lightly golden.`,
    `Add ${hero}, salt, spices, and a measured splash of water or stock. Cover and cook on medium-low until tender and fully done.`,
    `Uncover and simmer until the dish reaches your preferred consistency. Taste and adjust salt, spice, and acidity at this stage.`,
    `Serve ${title} hot with ${pairing}. ${regionalTip(input, kind)}`,
  ];
}

export function buildDetailedSteps(input: RecipeStepInput): string[] {
  const normalized: RecipeStepInput = {
    ...input,
    ingredients: normalizeIngredients(input.ingredients),
  };
  const kind = detectDishKind(normalized.title, normalized.ingredients);

  let steps: string[];
  switch (kind) {
    case 'dhebra':
      steps = buildDhebraSteps(normalized);
      break;
    case 'bread':
      steps = buildBreadSteps(normalized);
      break;
    case 'curry':
      steps = buildCurrySteps(normalized);
      break;
    case 'dal':
      steps = buildDalSteps(normalized);
      break;
    case 'rice-layered':
      steps = buildRiceLayeredSteps(normalized);
      break;
    case 'khichdi':
      steps = buildKhichdiSteps(normalized);
      break;
    case 'fermented':
      steps = buildFermentedSteps(normalized);
      break;
    case 'fried':
      steps = buildFriedSteps(normalized);
      break;
    case 'meat':
      steps = buildMeatSteps(normalized);
      break;
    case 'fish':
      steps = buildFishSteps(normalized);
      break;
    case 'egg':
      steps = buildEggSteps(normalized);
      break;
    case 'sweet':
      steps = buildSweetSteps(normalized);
      break;
    case 'chaat':
      steps = buildChaatSteps(normalized);
      break;
    case 'steamed':
      steps = buildSteamedSteps(normalized);
      break;
    case 'breakfast-grain':
      steps = buildBreakfastGrainSteps(normalized);
      break;
    case 'south-broth':
      steps = buildSouthBrothSteps(normalized);
      break;
    case 'kofta':
      steps = buildKoftaSteps(normalized);
      break;
    case 'condiment':
      steps = buildCondimentSteps(normalized);
      break;
    default:
      steps = buildGenericSteps(normalized, kind);
      break;
  }

  return steps.slice(0, DETAILED_STEP_COUNT);
}

export function resolveRecipeSteps(input: RecipeStepInput): string[] {
  return buildDetailedSteps(input);
}

export function resolveStepsForRecipe(recipe: Recipe): string[] {
  const ingredients = parseJsonArray<RecipeIngredient[]>(recipe.ingredients, []);

  return resolveRecipeSteps({
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    description: recipe.description,
  });
}
