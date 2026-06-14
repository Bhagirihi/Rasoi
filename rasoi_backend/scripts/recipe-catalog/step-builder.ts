import type { RecipeCatalogEntry } from './types';

type StepInput = Pick<
  RecipeCatalogEntry,
  'title' | 'kitchenStyleId' | 'dietType' | 'ingredients' | 'description' | 'difficulty' | 'prepTime'
>;

const VAGUE_PATTERNS = [
  'Prepare and chop ingredients',
  'Prepare and portion ingredients',
  'Prepare ingredients and spice mix',
  'Prepare pantry ingredients',
  'Cook the base tempering',
  'Cook onions, ginger, and garlic to build',
  'Cook onion, ginger, and garlic until aromatic',
  'Cook aromatics in ghee or oil until fragrant',
  'Add the main components',
  'Add hero ingredients',
  'Add the hero ingredients',
  'Finish with garnish and serve hot',
  'Prep all toppings and components',
  'Cook or toast the main base on a hot tawa',
  'Assemble with chutneys, masala, and texture components',
  'Serve immediately for best street-style taste',
  'Roast whole spices, cook vegetables on medium heat',
  'Sear the protein in hot oil, then simmer with Chettinad masala',
  'Cook shallot-spice base first, then add eggs and finish quickly',
];

export function stepsLookVague(steps: string[]): boolean {
  return steps.some((step) => VAGUE_PATTERNS.some((pattern) => step.includes(pattern)));
}

function heroIngredient(ingredients: StepInput['ingredients']): string {
  return ingredients.find((item) => !item.isStaple)?.name ?? ingredients[0]?.name ?? 'main ingredient';
}

function stapleList(ingredients: StepInput['ingredients']): string {
  const staples = ingredients.filter((item) => item.isStaple).map((item) => item.name);
  return staples.slice(0, 4).join(', ') || 'onion, tomato, and spices';
}

function detectDishKind(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('biryani') || t.includes('pulao') || t.includes('pulav')) return 'rice-layered';
  if (t.includes('khichdi') || t.includes('khichri')) return 'khichdi';
  if (t.includes('dal') || t.includes('kadhi') || t.includes('rasawala')) return 'dal';
  if (t.includes('chaat') || t.includes('puri') || t.includes('kachori') || t.includes('bhel')) return 'chaat';
  if (t.includes('paratha') || t.includes('thepla') || t.includes('roti') || t.includes('naan') || t.includes('kulcha'))
    return 'bread';
  if (t.includes('halwa') || t.includes('sheero') || t.includes('payesh') || t.includes('kheer') || t.includes('ladoo') || t.includes('mithai') || t.includes('papdi') || t.includes('barfi'))
    return 'sweet';
  if (t.includes('kofta') || t.includes('gatta') || t.includes('muthia')) return 'kofta';
  if (t.includes('fish') || t.includes('ilish') || t.includes('bhetki') || t.includes('rui') || t.includes('katla'))
    return 'fish';
  if (t.includes('chicken') || t.includes('murgh') || t.includes('mutton') || t.includes('keema')) return 'meat';
  if (t.includes('egg') || t.includes('anda') || t.includes('omelette')) return 'egg';
  if (t.includes('bhaja') || t.includes('fry') || t.includes('tikka') || t.includes('pakoda') || t.includes('vada'))
    return 'fried';
  if (t.includes('chutney') || t.includes('pickle') || t.includes('launji')) return 'condiment';
  if (t.includes('curry') || t.includes('masala') || t.includes('jhol') || t.includes('kalia') || t.includes('shaak') || t.includes('sabzi'))
    return 'curry';
  if (t.includes('dosa') || t.includes('idli') || t.includes('uttapam') || t.includes('appam')) return 'fermented';
  if (t.includes('steamed') || t.includes('bhapa') || t.includes('paturi') || t.includes('handvo') || t.includes('dhokla'))
    return 'steamed';
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

export function buildDetailedSteps(input: StepInput): string[] {
  const hero = heroIngredient(input.ingredients);
  const staples = stapleList(input.ingredients);
  const kind = detectDishKind(input.title);
  const temper = cuisineTemperOil(input.kitchenStyleId);
  const title = input.title;

  switch (kind) {
    case 'rice-layered':
      return [
        `Wash and soak basmati rice for 20 minutes. Marinate ${hero} with yogurt, ginger-garlic paste, salt, and regional spices for at least 30 minutes.`,
        `Par-boil rice with whole spices (tej patta, elaichi, laung) until 70% cooked; drain and spread on a plate to stop further cooking.`,
        `In a heavy handi, layer fried onions, marinated ${hero}, mint, coriander, and rice. Drizzle saffron milk and ghee between layers.`,
        `Seal the pot with dough or tight lid and cook on high flame for 3 minutes, then on lowest heat (dum) for 25–30 minutes without peeking.`,
        `Rest ${title} for 10 minutes off heat, then fluff gently from the sides and serve with raita or salan.`,
      ];
    case 'khichdi':
      return [
        `Wash rice and dal together until water runs clear. Soak for 15 minutes if using whole lentils.`,
        `Heat ghee, crackle cumin and hing, then sauté chopped onion until soft. Add ginger and green chilli.`,
        `Add drained rice-dal, turmeric, and salt. Pour hot water in a 1:3 ratio and bring to a rolling boil.`,
        `Reduce heat, cover, and cook until grains mash lightly and the khichdi is creamy. Adjust water if it thickens too much.`,
        `Finish ${title} with a spoon of ghee, fresh coriander, and serve hot with papad or pickle.`,
      ];
    case 'dal':
      return [
        `Pressure-cook dal with turmeric and enough water until completely soft (3–4 whistles). Mash lightly for a creamy texture.`,
        `Prepare tadka: heat oil or ghee, add ${temper}, then ginger, garlic, and chopped tomato until the masala leaves oil.`,
        `Pour the tadka into boiled dal, add salt and jaggery or amchur if the recipe needs balance, and simmer 8–10 minutes.`,
        `Adjust consistency with hot water; the dal should coat a spoon without being watery.`,
        `Serve ${title} hot with steamed rice, roti, or jeera rice.`,
      ];
    case 'chaat':
      return [
        `Prep all components separately: boil or spice the base (${hero}), whisk fresh dahi, and keep green and sweet chutneys ready.`,
        `Crisp the base element (puri, papdi, or kachori shell) just before assembly so it stays crunchy.`,
        `Layer potato or sprout filling, chutneys, chaat masala, and sev in the order that keeps textures distinct.`,
        `Top with chopped onion, coriander, and a squeeze of lemon at the last second.`,
        `Serve ${title} immediately while crisp and cold elements are still contrasting.`,
      ];
    case 'bread':
      return [
        `Knead dough with flour, salt, oil, and warm water until soft and pliable; rest covered for 20–30 minutes.`,
        `Prepare the filling or flavour mix for ${title} using ${hero} and ${staples}; cook filling until dry so rolling is easy.`,
        `Divide dough, stuff or fold in the filling, roll gently without tearing, and dust lightly with flour.`,
        `Cook on a hot tawa with ghee or oil, pressing edges until golden brown spots appear on both sides.`,
        `Brush with butter or ghee and serve ${title} hot with curd, pickle, or chutney.`,
      ];
    case 'sweet':
      return [
        `Measure ${hero}, sugar or jaggery, and fat (ghee or milk) precisely; line a tray if setting a fudge or barfi.`,
        `Cook the base on medium-low, stirring continuously so it does not catch at the bottom, until it thickens and leaves the pan sides.`,
        `Add cardamom, nuts, or saffron at the stage mentioned in the recipe—usually after reducing liquid.`,
        `Pour or shape while still warm; score or roll into portions before fully setting.`,
        `Cool ${title} completely before storing; serve at room temperature for best texture.`,
      ];
    case 'kofta':
      return [
        `Prepare kofta mix with ${hero}, binding (besan or mashed potato), spices, and herbs; shape into even balls or logs.`,
        `Shallow-fry or steam koftas until golden outside and cooked through; drain and set aside so they hold shape in gravy.`,
        `Cook onion-tomato masala with ${temper} until oil separates and the base is thick and aromatic.`,
        `Add water or yogurt to make gravy, simmer, then slide koftas in and cook gently for 5–7 minutes without stirring hard.`,
        `Garnish ${title} with cream or coriander and serve with roti or jeera rice.`,
      ];
    case 'fish':
      return [
        `Clean and pat dry fish pieces; marinate with turmeric, salt, and lemon for 10 minutes to remove raw smell.`,
        `Heat mustard or sesame oil until smoking lightly; sear fish on medium heat until skin side is golden, then flip carefully.`,
        `Build gravy with ${temper}, onion paste, ginger, and tomato (or mustard paste for Bengali-style dishes).`,
        `Return fish to the pan, add warm water if needed, and simmer gently until flakes separate but pieces stay intact.`,
        `Rest ${title} for 2 minutes and serve hot with steamed rice.`,
      ];
    case 'meat':
      return [
        `Marinate ${hero} with yogurt, ginger-garlic paste, chilli, and salt for at least 30 minutes (overnight for tougher cuts).`,
        `Brown marinated pieces in hot oil on high heat to seal juices; remove and keep aside.`,
        `Cook onion until deep golden, add tomato and spice powders, and sauté until oil separates from masala.`,
        `Return meat, add hot water or stock, cover, and simmer until tender; pressure-cook if the cut needs it.`,
        `Finish ${title} with garam masala, kasuri methi, or cream as needed and serve hot.`,
      ];
    case 'egg':
      return [
        `Boil or whisk eggs depending on the dish; keep boiled eggs peeled and slit so masala penetrates.`,
        `Prepare masala base with ${temper}, onion, tomato, and ginger-garlic until thick and fragrant.`,
        `Add spice powders and a splash of water to form gravy; slide eggs in and coat gently.`,
        `Simmer on low for 5–8 minutes so eggs absorb flavour without turning rubbery.`,
        `Serve ${title} hot with roti, pav, or steamed rice.`,
      ];
    case 'fried':
      return [
        `Cut ${hero} evenly, pat dry, and season with salt, turmeric, and spice powders. Rest 10 minutes.`,
        `Prepare batter or dry coating (besan, rice flour, or crumbs) seasoned with ajwain, chilli, and salt.`,
        `Heat oil to medium-hot; fry in batches without crowding until crisp and evenly coloured.`,
        `Drain on a rack so excess oil drips off and the crust stays crisp.`,
        `Serve ${title} immediately with chutney, sliced onion, and lemon.`,
      ];
    case 'condiment':
      return [
        `Wash and prep the main ingredient (${hero}); roast or blanch if the recipe calls for reduced raw flavour.`,
        `Grind or mash with salt, chilli, and acid (lemon, raw mango, or tamarind) to a coarse or smooth paste as required.`,
        `Temper with ${temper} if the dish needs a final aroma boost.`,
        `Cool completely before bottling so condensation does not thin the chutney.`,
        `Serve ${title} as a side with meals or snacks.`,
      ];
    case 'fermented':
      return [
        `Soak rice and dal separately, grind to a smooth batter, and ferment overnight in a warm place until airy and slightly sour.`,
        `Adjust batter thickness with water; add salt just before cooking so fermentation is not slowed.`,
        `Heat a seasoned tawa or pan; spread batter thin and evenly for crepes, or pour into greased moulds for idlis.`,
        `Cook covered on medium heat until edges lift and the centre is set; flip only if the recipe needs browning on both sides.`,
        `Serve ${title} hot with chutney and sambar.`,
      ];
    case 'steamed':
      return [
        `Prepare batter or filling with ${hero}; grease steaming trays or wraps (banana leaf / foil) to prevent sticking.`,
        `Layer spices, paste, or coconut mix as required and pack evenly for uniform cooking.`,
        `Steam on medium heat for the time needed until a skewer comes out clean or fish flakes easily.`,
        `Rest ${title} for 5 minutes off heat so it sets and does not break when lifted.`,
        `Serve hot with tempered oil, chutney, or rice.`,
      ];
    default:
      return [
        `Wash, peel, and cut ${hero} evenly. Keep ${staples} prepped so the masala does not overcook while chopping.`,
        `Heat oil or ghee, add ${temper}, then onion and ginger-garlic. Sauté until onion turns golden and masala base is ready.`,
        `Add chopped tomato, turmeric, coriander, and chilli powders; cook until oil separates and raw smell disappears.`,
        `Add ${hero}, salt, and a splash of water. Cover and cook on medium heat until vegetables or protein are tender but hold shape.`,
        `Adjust gravy consistency, finish with fresh coriander or ghee, and serve ${title} hot with roti or rice.`,
      ];
  }
}

export function enrichExistingSteps(steps: string[], input: StepInput): string[] {
  if (steps.length === 0) return buildDetailedSteps(input);
  if (stepsLookVague(steps)) return buildDetailedSteps(input);

  const enriched = steps.map((step, index) => {
    const trimmed = step.replace(/\.$/, '');
    if (trimmed.length >= 90) return `${trimmed}.`;

    const heatHint =
      index === 0
        ? ' Keep pieces uniform so they cook evenly.'
        : index === steps.length - 1
          ? ' Serve immediately while aromas are fresh.'
          : ' Stir occasionally and adjust heat to prevent sticking.';

    return `${trimmed}.${heatHint}`;
  });

  if (enriched.length < 5 && input.prepTime >= 30) {
    enriched.push(
      `Rest ${input.title} for 2–3 minutes off heat so flavours settle before serving.`,
    );
  }

  return enriched;
}

export function resolveRecipeSteps(entry: RecipeCatalogEntry): string[] {
  if (stepsLookVague(entry.steps)) {
    return buildDetailedSteps(entry);
  }
  return enrichExistingSteps(entry.steps, entry);
}
