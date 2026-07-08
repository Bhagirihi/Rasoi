/** Hindi localization for recipe descriptions and cooking steps. */

import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { detectDishKind, type RecipeStepInput } from '@/lib/recipe-steps';

import type { RecipeIngredient } from '@/lib/types';

/** Exact English titles → natural Hindi dish names for UI copy. */
const EXACT_TITLE_HI: Record<string, string> = {
  'Plain Rice': 'सादा चावल',
  Chapati: 'चपाती',
  Phulka: 'फुल्का',
  'Jeera Rice': 'जीरा चावल',
  'Aloo Paratha': 'आलू पराठा',
  'Aloo Jeera': 'आलू जीरा',
  'Aloo Matar': 'आलू मटर',
  'Aloo Tomato': 'आलू टमाटर',
  'Aloo Capsicum': 'आलू शिमला मिर्च',
  'Toor Dal': 'अरहर दाल',
  'Yellow Dal': 'पीली दाल',
  'Masoor Dal': 'मसूर दाल',
  'Urad Dal': 'उड़द दाल',
  'Green Chutney': 'हरी चटनी',
  'Coconut Chutney': 'नारियल की चटनी',
  'Onion Raita': 'प्याज़ रायता',
  'Mint Raita': 'पुदीना रायता',
  'Kachumber Salad': 'कचूंबर सलाद',
  'French Fries': 'फ्रेंच फ्राइज़',
};

const TITLE_WORD_HI: [RegExp, string][] = [
  [/\bPlain\b/gi, 'सादा'],
  [/\bRice\b/gi, 'चावल'],
  [/\bJeera\b/gi, 'जीरा'],
  [/\bAloo\b/gi, 'आलू'],
  [/\bPaneer\b/gi, 'पनीर'],
  [/\bChicken\b/gi, 'चिकन'],
  [/\bFish\b/gi, 'मछली'],
  [/\bMutton\b/gi, 'मटन'],
  [/\bEgg\b/gi, 'अंडा'],
  [/\bEggs\b/gi, 'अंडे'],
  [/\bChana\b/gi, 'चना'],
  [/\bChole\b/gi, 'छोले'],
  [/\bRajma\b/gi, 'राजमा'],
  [/\bDal\b/gi, 'दाल'],
  [/\bGobhi\b/gi, 'गोभी'],
  [/\bGobi\b/gi, 'गोभी'],
  [/\bBhindi\b/gi, 'भिंडी'],
  [/\bPalak\b/gi, 'पालक'],
  [/\bMatar\b/gi, 'मटर'],
  [/\bParatha\b/gi, 'पराठा'],
  [/\bRoti\b/gi, 'रोटी'],
  [/\bBhakri\b/gi, 'भाकरी'],
  [/\bKhichdi\b/gi, 'खिचड़ी'],
  [/\bBiryani\b/gi, 'बिरयानी'],
  [/\bPulao\b/gi, 'पुलाव'],
  [/\bDosa\b/gi, 'दोसा'],
  [/\bIdli\b/gi, 'इडली'],
  [/\bUpma\b/gi, 'उपमा'],
  [/\bPoha\b/gi, 'पोहा'],
  [/\bRaita\b/gi, 'रायता'],
  [/\bSalad\b/gi, 'सलाद'],
  [/\bChutney\b/gi, 'चटनी'],
  [/\bPickle\b/gi, 'अचार'],
  [/\bSoup\b/gi, 'सूप'],
  [/\bCurry\b/gi, 'करी'],
  [/\bMasala\b/gi, 'मसाला'],
  [/\bTikka\b/gi, 'टिक्का'],
  [/\bKebab\b/gi, 'कबाब'],
  [/\bKofta\b/gi, 'कोफ्ता'],
  [/\bThepla\b/gi, 'थेपला'],
  [/\bHandvo\b/gi, 'हांडवो'],
  [/\bDhokla\b/gi, 'ढोकला'],
  [/\bKadhi\b/gi, 'कढ़ी'],
  [/\bSambar\b/gi, 'सांभर'],
  [/\bRasam\b/gi, 'रसम'],
  [/\bChaat\b/gi, 'चाट'],
  [/\bwith\b/gi, 'के साथ'],
  [/\band\b/gi, 'और'],
  [/\bBread\b/gi, 'ब्रेड'],
  [/\bQuick\b/gi, 'झटपट'],
  [/\bDhaba\b/gi, 'ढाबा'],
  [/\bFestive\b/gi, 'त्योहारी'],
  [/\bRoyal\b/gi, 'शाही'],
  [/\bSmoky\b/gi, 'धुएँदार'],
  [/\bClassic\b/gi, 'क्लासिक'],
  [/\bComfort\b/gi, 'आरामदायक'],
  [/\bHealthy\b/gi, 'हेल्दी'],
  [/\bGrand\b/gi, 'शाही'],
  [/\bHome-?style\b/gi, 'घर जैसा'],
  [/\bMumbai\b/gi, 'मुंबई'],
  [/\bDelhi\b/gi, 'दिल्ली'],
  [/\bBangalore\b/gi, 'बेंगलुरु'],
  [/\bChennai\b/gi, 'चेन्नई'],
  [/\bChef\b/gi, 'शेफ'],
  [/\bFamily\b/gi, 'पारिवारिक'],
  [/\bCrispy\b/gi, 'कुरकुरा'],
  [/\bButtery\b/gi, 'मक्खन वाला'],
];

/** User-facing Hindi dish title (avoid leaving English title in HI copy). */
export function localizeRecipeTitleToHindi(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;

  const exact = EXACT_TITLE_HI[trimmed] ?? EXACT_TITLE_HI[canonicalizeIngredientName(trimmed)];
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  for (const [en, hi] of Object.entries(EXACT_TITLE_HI)) {
    if (en.toLowerCase() === lower) return hi;
  }

  let result = trimmed;
  for (const [pattern, replacement] of TITLE_WORD_HI) {
    result = result.replace(pattern, replacement);
  }

  if (/[\u0900-\u097F]/.test(result)) return result.replace(/\s+/g, ' ').trim();
  return trimmed;
}

export function hindiContentNeedsRefresh(
  title: string,
  descriptionHi: string | null | undefined,
  stepsHi: string[] | undefined,
): boolean {
  const titleTrim = title.trim();
  if (!titleTrim) return false;

  if (descriptionHi?.includes(titleTrim)) return true;
  if (descriptionHi && /^[A-Za-z0-9\s\-'&]+ —/.test(descriptionHi.trim())) return true;

  if (stepsHi?.some((step) => step.includes(titleTrim))) return true;
  if (stepsHi?.some((step) => /\b(Heat|Add|Cook|Stir|Serve|minutes|until golden)\b/i.test(step))) {
    return true;
  }

  return false;
}

const INGREDIENT_HI: Record<string, string> = {
  Bateta: 'आलू',
  Aloo: 'आलू',
  Pyaaz: 'प्याज़',
  Tamatar: 'टमाटर',
  Dahi: 'दही',
  Besan: 'बेसन',
  Chawal: 'चावल',
  'Basmati chawal': 'बासमती चावल',
  'Basmati Chawal': 'बासमती चावल',
  Atta: 'आटा',
  'Gehu atta': 'गेहूँ का आटा',
  'Gehu Atta': 'गेहूँ का आटा',
  Palak: 'पालक',
  Bhindi: 'भिंडी',
  Paneer: 'पनीर',
  Chicken: 'चिकन',
  Fish: 'मछली',
  Mutton: 'मटन',
  Chana: 'चना',
  Rajma: 'राजमा',
  'Moong Dal': 'मूंग दाल',
  'Tuver Dal': 'अरहर दाल',
  'Masoor Dal': 'मसूर दाल',
  'Urad Dal': 'उड़द दाल',
  Bread: 'ब्रेड',
  Nimbu: 'नींबू',
  Dhania: 'धनिया',
  'Hari mirch': 'हरी मिर्च',
  'Hari Mirch': 'हरी मिर्च',
  Rai: 'राई',
  'Kadi patta': 'कड़ी पत्ता',
  'Kadi Patta': 'कड़ी पत्ता',
  Mungfali: 'मूंगफली',
  Gajar: 'गाजर',
  Ghee: 'घी',
  Tel: 'तेल',
  Namak: 'नमक',
  Haldi: 'हल्दी',
  Jeera: 'जीरा',
  Matar: 'मटर',
  Gobhi: 'गोभी',
  Baingan: 'बैंगन',
  Eggs: 'अंडे',
  Anda: 'अंडा',
};

const PHRASE_MAP: [RegExp, string][] = [
  [/\bHeat\b/gi, 'गर्म करें'],
  [/\bAdd\b/gi, 'डालें'],
  [/\bMix\b/gi, 'मिलाएँ'],
  [/\bStir\b/gi, 'चलाएँ'],
  [/\bCook\b/gi, 'पकाएँ'],
  [/\bServe\b/gi, 'परोसें'],
  [/\bCover\b/gi, 'ढकें'],
  [/\bWash\b/gi, 'धोएँ'],
  [/\bPeel\b/gi, 'छीलें'],
  [/\bChop\b/gi, 'काटें'],
  [/\bSlice\b/gi, 'काटें'],
  [/\bDice\b/gi, 'काटें'],
  [/\bTear\b/gi, 'तोड़ें'],
  [/\bToss\b/gi, 'मिलाएँ'],
  [/\bWhisk\b/gi, 'फेंटें'],
  [/\bGrind\b/gi, 'पीसें'],
  [/\bRoast\b/gi, 'भूनें'],
  [/\bFry\b/gi, 'तलें'],
  [/\bSteam\b/gi, 'भाप में पकाएँ'],
  [/\bBoil\b/gi, 'उबालें'],
  [/\bSimmer\b/gi, 'धीमी आँच पर पकाएँ'],
  [/\bGarnish\b/gi, 'गार्निश करें'],
  [/\bFinish\b/gi, 'अंत में'],
  [/\bminutes?\b/gi, 'मिनट'],
  [/\buntil golden\b/gi, 'सुनहरा होने तक'],
  [/\bmedium heat\b/gi, 'मध्यम आँच'],
  [/\blow heat\b/gi, 'धीमी आँच'],
  [/\bhigh heat\b/gi, 'तेज़ आँच'],
  [/\bsalt to taste\b/gi, 'नमक स्वाद अनुसार'],
  [/\bfresh coriander\b/gi, 'हरा धनिया'],
  [/\btempering\b/gi, 'तड़का'],
  [/\bgravy\b/gi, 'ग्रेवी'],
  [/\bwater\b/gi, 'पानी'],
  [/\boil\b/gi, 'तेल'],
  [/\bghee\b/gi, 'घी'],
  [/\bonion\b/gi, 'प्याज़'],
  [/\btomato\b/gi, 'टमाटर'],
  [/\bpotato\b/gi, 'आलू'],
  [/\bbread\b/gi, 'ब्रेड'],
  [/\brice\b/gi, 'चावल'],
  [/\blentils?\b/gi, 'दाल'],
  [/\bginger\b/gi, 'अदरक'],
  [/\bgarlic\b/gi, 'लहसुन'],
  [/\bchilli\b/gi, 'मिर्च'],
  [/\bchili\b/gi, 'मिर्च'],
  [/\bturmeric\b/gi, 'हल्दी'],
  [/\bcumin\b/gi, 'जीरा'],
  [/\bcoriander\b/gi, 'धनिया'],
  [/\bmustard seeds\b/gi, 'राई'],
  [/\bcurry leaves\b/gi, 'कड़ी पत्ता'],
  [/\bpaneer\b/gi, 'पनीर'],
  [/\bcream\b/gi, 'क्रीम'],
  [/\bbutter\b/gi, 'मक्खन'],
  [/\byogurt\b/gi, 'दही'],
  [/\blemon\b/gi, 'नींबू'],
  [/\bpeanuts?\b/gi, 'मूंगफली'],
];

function heroHi(ingredients: RecipeIngredient[]): string {
  const raw =
    ingredients.find((i) => !i.isStaple)?.name ?? ingredients[0]?.name ?? 'मुख्य सामग्री';
  const canonical = canonicalizeIngredientName(raw);
  return INGREDIENT_HI[raw] ?? INGREDIENT_HI[canonical] ?? canonical;
}

function localizePhrase(text: string): string {
  let result = text;
  for (const [pattern, replacement] of PHRASE_MAP) {
    result = result.replace(pattern, replacement);
  }
  for (const [en, hi] of Object.entries(INGREDIENT_HI)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'g'), hi);
  }
  return result;
}

/** Full Hindi cooking steps matched to dish kind (not regex-patched English). */
export function buildDetailedStepsHi(input: RecipeStepInput): string[] {
  const kind = detectDishKind(input.title, input.ingredients);
  const hero = heroHi(input.ingredients);
  const title = localizeRecipeTitleToHindi(input.title);
  const t = input.title.toLowerCase();

  const byKind: Record<string, string[]> = {
    'bread-snack': [
      'बची हुई ब्रेड को छोटे टुकड़ों में तोड़ें; थोड़ी सूखी रखें ताकि कुरकुरी रहे।',
      'कड़ाही में तेल गर्म करें, राई और कड़ी पत्ता डालकर प्याज़ और हरी मिर्च भूनें।',
      'हल्दी, नमक और ब्रेड डालें; मध्यम-तेज़ आँच पर सुनहरा होने तक मिलाएँ।',
      'मूंगफली या सेव मिलाएँ; एक मिनट और पकाएँ।',
      `${title} में नींबू और धनिया डालकर गर्म परोसें।`,
    ],
    bread: [
      t.includes('phulka')
        ? 'गेहूँ के आटे, नमक और गुनगुने पानी से आटा गूँथें; १० मिनट ढककर रखें।'
        : 'गेहूँ के आटे, नमक और गुनगुने पानी से नरम आटा गूँथें; १५ मिनट आराम दें।',
      'बराबर लोइयाँ बनाएँ, सूखे आटे में लपेटकर पतली रोटी बेलें।',
      t.includes('phulka')
        ? 'तवे पर दोनों तरफ से सेकें, फिर सीधी आँच पर चिमटे से फुलाएँ।'
        : 'गर्म तवे पर सेकें, पलटकर हल्के दबाव से सुनहरे धब्बे आने दें।',
      t.includes('phulka') ? 'तुरंत गर्म परोसें।' : 'घी लगाकर कपड़े में लपेटकर नरम रखें।',
      `${title} दाल या सब्ज़ी के साथ गर्म परोसें।`,
    ],
    'dry-sabzi': [
      /aloo\s*jeera|jeera\s*aloo/.test(t)
        ? `${hero} उबालकर छीलें और टुकड़ों में काटें।`
        : `${hero} धोकर काटें और तैयार करें।`,
      'कड़ाही में तेल गर्म करें, जीरा डालकर चटकने दें।',
      /aloo\s*jeera|jeera\s*aloo/.test(t)
        ? 'आलू, हल्दी, लाल मिर्च और नमक डालकर भूनें जब तक किनारे कुरकुरे न हों।'
        : `${hero}, हल्दी, नमक और मसाले डालकर मध्यम आँच पर भूनें।`,
      'हरी मिर्च और हरा धनिया से गार्निश करें।',
      `${title} रोटी या दाल के साथ गर्म परोसें।`,
    ],
    dal: [
      `${hero} धोकर हल्दी और नमक के साथ प्रेशर कुकर में नरम होने तक पकाएँ।`,
      'घी में जीरा, लहसुन और टमाटर का तड़का बनाएँ।',
      'गर्म तड़का दाल में डालें और ८–१० मिनट उबालें।',
      'गाढ़ापन अपनी पसंद के अनुसार रखें; नमक स्वाद अनुसार।',
      `${title} चावल या रोटी के साथ गर्म परोसें।`,
    ],
    curry: [
      'कड़ाही में तेल या घी गर्म करें; जीरा, प्याज़ और अदरक-लहसुन भूनें।',
      'टमाटर, हल्दी और मसाले डालकर भूनें जब तक तेल अलग न हो जाए।',
      `${hero}, नमक और थोड़ा पानी डालकर ढककर पकाएँ।`,
      'ग्रेवी गाढ़ी करें; नमक और मसाला स्वाद अनुसार।',
      `${title} में धनिया डालकर रोटी या चावल के साथ परोसें।`,
    ],
    'plain-rice': [
      'बासमती चावल धोकर १५ मिनट भिगोएँ और छान लें।',
      'नमक वाले उबलते पानी में चावल डालें।',
      'मध्यम आँच पर पकाएँ जब तक दाना नरम हो और पानी सूख जाए।',
      '५ मिनट ढककर रखें, फिर कांटे से फुलाएँ।',
      `${title} में घी डालकर दाल या सब्ज़ी के साथ परोसें।`,
    ],
    raita: [
      'दही को ठंडे पानी से फेंटकर चिकना करें।',
      `${hero} तैयार करें (काटें, कद्दूकस करें या भिगोएँ)।`,
      'दही में मिलाएँ; भुना जीरा और काला नमक डालें।',
      '१०–१५ मिनट फ्रिज में ठंडा करें।',
      `${title} बिरयानी या पराठे के साथ परोसें।`,
    ],
    salad: [
      'खीरा, टमाटर और प्याज़ छोटे टुकड़ों में काटें।',
      'हरी मिर्च और धनिया मिलाएँ।',
      'नींबू, नमक और भुना जीरा डालकर मिलाएँ।',
      'नमक और खट्टापन संतुलित करें।',
      `${title} तुरंत दाल-रोटी के साथ परोसें।`,
    ],
    sweet: [
      `${hero}, चीनी या गुड़ और घी नापकर तैयार करें।`,
      'धीमी आँच पर लगातार चलाते हुए पकाएँ जब तक मिश्रण गाढ़ा न हो।',
      'इलायची और ड्राई फ्रूट्स मिलाएँ।',
      'गर्म मिश्रण को ठंडा होने दें या लड्डू बनाएँ।',
      `${title} कमरे के ताप पर परोसें।`,
    ],
    'breakfast-grain': [
      t.includes('poha')
        ? 'पोहा हल्के हाथ से धोकर छानें और ५ मिनट सुखाएँ।'
        : 'सूजी को सूखे तवे पर हल्का भूनें।',
      'तेल में राई, कड़ी पत्ता, प्याज़ और मिर्च का तड़का लगाएँ।',
      'हल्दी, नमक और मुख्य सामग्री डालकर मिलाएँ।',
      'ज़रूरत हो तो थोड़ा पानी छिड़ककर २–४ मिनट धीमी आँच पर पकाएँ।',
      `${title} में नींबू और धनिया डालकर गर्म परोसें।`,
    ],
    fried: [
      `${hero} काटकर नमक और हल्दी लगाएँ।`,
      'तेल मध्यम-गर्म करें; छोटे बैच में सुनहरा होने तक तलें।',
      'अतिरिक्त तेल निकालने के लिए किचन पेपर पर रखें।',
      'गरमागरम चाट मसाला छिड़कें।',
      `${title} तुरंत चटनी के साथ परोसें।`,
    ],
    chaat: [
      'सभी सामग्री अलग-अलग तैयार करें — बेस, चटनी और दही।',
      'पूरी या पापड़ी को तलकर कुरकुरा रखें।',
      'चटनी, दही और मसाले की परतें लगाएँ।',
      'प्याज़, धनिया और नींबू अंत में डालें।',
      `${title} तुरंत परोसें।`,
    ],
    noodles: [
      'नूडल्स को नमक वाले पानी में उबालें और छान लें।',
      'कड़ाही में तेल गर्म करके सब्ज़ियाँ तेज़ आँच पर भूनें।',
      'सोया सॉस, सिरका और मसाले मिलाएँ।',
      'नूडल्स डालकर मिलाएँ।',
      `${title} गर्म परोसें।`,
    ],
    condiment: [
      `${hero} धोकर तैयार करें।`,
      'नमक, मिर्च और नींबू के साथ पीसें या मैश करें।',
      'ज़रूरत हो तो तड़का डालें।',
      'ठंडा होने पर साफ़ जार में भरें।',
      `${title} भोजन के साथ परोसें।`,
    ],
  };

  if (byKind[kind]) return byKind[kind];

  return [
    `${title} की सभी सामग्री तैयार करें।`,
    'तेल में जीरा और मसाले का तड़का लगाएँ।',
    `${hero} डालकर मध्यम आँच पर पकाएँ।`,
    'नमक और मसाला स्वाद अनुसार मिलाएँ।',
    `${title} गर्म परोसें।`,
  ];
}

export function localizeStepsToHindi(englishSteps: string[], title: string): string[] {
  if (englishSteps.length === 0) {
    return [
      `${title} की सभी सामग्री तैयार करें।`,
      'सब्ज़ियाँ काटें और मसाले नापकर रखें।',
      'धीमी आँच पर पकाएँ; नमक स्वाद अनुसार।',
      'गार्निश करके गर्म परोसें।',
    ];
  }

  return englishSteps.map((step, index) => {
    const localized = localizePhrase(step);
    if (localized !== step) return localized;
    const titleHi = localizeRecipeTitleToHindi(title);
    if (index === 0) return `${titleHi}: ${localized}`;
    return localized;
  });
}

export function localizeDescriptionToHindi(englishDescription: string, title: string): string {
  const localized = localizePhrase(englishDescription);
  if (localized !== englishDescription) return localized;
  const titleHi = localizeRecipeTitleToHindi(title);
  return `${titleHi} — घर पर बनने वाला भारतीय व्यंजन, ताज़ी सामग्री और सरल तरीके से तैयार।`;
}
