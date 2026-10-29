import type { RecipeIngredient } from '@/data/mockRecipes';

/**
 * Synthesize English/Hindi recipe blurbs when Supabase no longer stores `description`
 * (column dropped; `descriptionHi` is optional and often empty).
 * Mirrors rasoi_backend/src/lib/recipe-description.ts for the direct-Supabase catalog path.
 */

function heroName(ingredients: RecipeIngredient[]): string {
  return ingredients.find((i) => !i.isStaple)?.name ?? ingredients[0]?.name ?? 'मुख्य सामग्री';
}

function detectDishKind(title: string, ingredients: RecipeIngredient[]): string {
  const t = title.toLowerCase();
  const ing = ingredients
    .map((item) => item.name.toLowerCase())
    .join(' ');

  if (
    t.includes('chaat') ||
    t.includes('bhel') ||
    t.includes('pani puri') ||
    t.includes('tikki') ||
    t.includes('dabeli') ||
    t.includes('misal')
  ) {
    return 'chaat';
  }
  if (
    t.includes('bhaja') ||
    t.includes('fry') ||
    t.includes('tikka') ||
    t.includes('pakoda') ||
    t.includes('vada') ||
    t.includes('kachori')
  ) {
    return 'fried';
  }
  if (t.includes('biryani') || t.includes('pulao') || t.includes('pulav')) return 'rice-layered';
  if (t.includes('khichdi') || t.includes('khichri')) return 'khichdi';
  if (
    t.includes('paratha') ||
    t.includes('thepla') ||
    t.includes('roti') ||
    t.includes('naan') ||
    t.includes('kulcha')
  ) {
    return 'bread';
  }
  if (t.includes('poha') || t.includes('upma') || t.includes('sheera')) return 'breakfast-grain';
  if (t.includes('rasam') || t.includes('sambar')) return 'south-broth';
  if ((t.includes('dal') || t.includes('kadhi')) && !ing.includes('dhebra')) return 'dal';
  if (
    t.includes('halwa') ||
    t.includes('kheer') ||
    t.includes('ladoo') ||
    t.includes('barfi') ||
    t.includes('payasam')
  ) {
    return 'sweet';
  }
  if (t.includes('kofta')) return 'kofta';
  if (t.includes('fish') || t.includes('ilish') || t.includes('prawn')) return 'fish';
  if (
    t.includes('chicken') ||
    t.includes('murgh') ||
    t.includes('mutton') ||
    t.includes('keema') ||
    t.includes('pork')
  ) {
    return 'meat';
  }
  if (t.includes('egg') || t.includes('anda') || t.includes('omelette')) return 'egg';
  if (t.includes('chutney') || t.includes('pickle') || t.includes('launji')) return 'condiment';
  if (t.includes('dosa') || t.includes('idli') || t.includes('uttapam') || t.includes('appam')) {
    return 'fermented';
  }
  if (t.includes('handvo') || t.includes('dhokla') || t.includes('steamed')) return 'steamed';
  if (t.includes('raita')) return 'raita';
  if (t.includes('salad') || t.includes('kachumber')) return 'salad';
  if (t.includes('noodles') || t.includes('pasta')) return 'noodles';
  if (t.includes('curry') || t.includes('masala') || t.includes('sabzi') || t.includes('shaak')) {
    return 'curry';
  }
  return 'curry';
}

export function buildRecipeDescription(input: {
  title: string;
  ingredients: RecipeIngredient[];
}): string {
  const kind = detectDishKind(input.title, input.ingredients);
  const hero = heroName(input.ingredients);
  const title = input.title;

  const templates: Record<string, string> = {
    'bread-snack': `${title} — stale bread tossed with onion, peanut tempering, and turmeric for a quick snack.`,
    'breakfast-grain': `${title} — flattened rice or semolina tempered with mustard, curry leaves, and peanuts; a classic Indian breakfast.`,
    fermented: `${title} — fermented batter steamed or pan-roasted until light and spongy, served with chutney and sambar.`,
    bread: `${title} — whole-wheat flatbread rolled thin and roasted on tawa until soft or puffed.`,
    dal: `${title} — lentils simmered with turmeric and finished with an aromatic ghee tempering.`,
    curry: `${title} — ${hero} cooked in onion-tomato masala until tender and flavourful.`,
    'dry-sabzi': `${title} — ${hero} tossed with cumin and mild spices until dry, crisp, and fragrant.`,
    'rice-layered': `${title} — fragrant basmati layered with spiced vegetables or protein and slow-cooked dum-style.`,
    khichdi: `${title} — rice and dal cooked together with ghee and mild spices for a comforting one-pot meal.`,
    fried: `${title} — ${hero} coated and fried until crisp outside and cooked through.`,
    chaat: `${title} — street-style assembly of crisp base, chutneys, yogurt, and crunchy toppings.`,
    sweet: `${title} — traditional Indian sweet slow-cooked with ghee, sugar, and cardamom aroma.`,
    steamed: `${title} — batter or mix steamed until set, then tempered for extra flavour.`,
    'south-broth': `${title} — tangy South Indian broth with tamarind, tomatoes, and a fresh spice tempering.`,
    raita: `${title} — whisked yogurt mixed with vegetables or boondi, seasoned with roasted cumin.`,
    salad: `${title} — fresh chopped vegetables tossed with lemon, salt, and herbs as a raw side.`,
    condiment: `${title} — homemade chutney or pickle to brighten any thali or snack.`,
    noodles: `${title} — quick Indo-Chinese style noodles tossed with vegetables and mild spices.`,
    kofta: `${title} — spiced dumplings simmered in rich onion-tomato gravy.`,
    meat: `${title} — slow-cooked meat in aromatic masala until tender.`,
    fish: `${title} — fish cooked in regional spices with a balanced gravy or fry.`,
    egg: `${title} — eggs scrambled or curried with onion, tomato, and masala.`,
  };

  return (
    templates[kind] ??
    `${title} — homestyle Indian dish with ${hero}, cooked with everyday pantry spices.`
  );
}

export function buildRecipeDescriptionHi(input: {
  title: string;
  ingredients: RecipeIngredient[];
}): string {
  const kind = detectDishKind(input.title, input.ingredients);
  const hero = heroName(input.ingredients);
  const title = input.title;

  const templates: Record<string, string> = {
    'breakfast-grain': `${title} — पोहा या सूजी को राई, कड़ी पत्ता और मूंगफली के तड़के में पकाया गया क्लासिक नाश्ता।`,
    fermented: `${title} — खमीर उठा हुआ घोल जिसे नरम और हल्का पकाकर चटनी और सांभर के साथ परोसा जाता है।`,
    bread: `${title} — गेहूँ के आटे की रोटी जो तवे पर सुनहरी होने तक सेकी जाती है।`,
    dal: `${title} — दाल को हल्दी के साथ उबालकर घी के तड़के से सुगंधित किया जाता है।`,
    curry: `${title} — ${hero} को प्याज़-टमाटर की मसालेदार ग्रेवी में पकाया गया घर का सब्ज़ी।`,
    'rice-layered': `${title} — सुगंधित बासमती चावल परतों में सब्ज़ी या दाल के साथ दम पर पकाया जाता है।`,
    khichdi: `${title} — चावल और दाल को घी और हल्के मसालों के साथ एक बर्तन में पकाया हुआ आरामदायक भोजन।`,
    fried: `${title} — ${hero} को मसाले लगाकर सुनहरा कुरकुरा तलकर तैयार किया जाता है।`,
    chaat: `${title} — कुरकुरे बेस पर चटनी, दही और सेव से सजाया गया स्ट्रीट स्टाइल स्नैक।`,
    sweet: `${title} — घी, चीनी और इलायची की खुशबू वाली पारंपरिक भारतीय मिठाई।`,
    steamed: `${title} — घोल को भाप में पकाकर नरम और हल्का बनाया जाता है।`,
    'south-broth': `${title} — इमली और टमाटर वाला दक्षिण भारतीय रसम या सांभर जैसा झोल।`,
    raita: `${title} — फेंटे हुए दही में सब्ज़ी या बूंदी मिलाकर भुना जीरा डाला जाता है।`,
    salad: `${title} — कटी हुई ताज़ी सब्ज़ियाँ नींबू और नमक के साथ मिलाई गई कच्ची सलाद।`,
    condiment: `${title} — घर की बनी चटनी या अचार जो हर थाली को चटपटा बनाता है।`,
    noodles: `${title} — सब्ज़ियों और मसालों के साथ तेज़ आँच पर हल्के से भुनी नूडल्स।`,
    kofta: `${title} — मसालेदार कोफ्ते जो प्याज़-टमाटर की ग्रेवी में पकाए जाते हैं।`,
    meat: `${title} — मसालेदार ग्रेवी में धीमी आँच पर पकाया गया मांस।`,
    fish: `${title} — क्षेत्रीय मसालों में पकाई गई मछली।`,
    egg: `${title} — प्याज़-टमाटर और मसाले के साथ अंडा भुर्जी या करी।`,
  };

  return (
    templates[kind] ??
    `${title} — ${hero} और रोज़ के मसालों से बना साधारण घर का भारतीय व्यंजन।`
  );
}
