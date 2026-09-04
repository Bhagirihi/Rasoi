const TITLE_WORD_HI: [RegExp, string][] = [
  [/\bPlain\b/gi, 'सादा'],
  [/\bRice\b/gi, 'चावल'],
  [/\bJeera\b/gi, 'जीरा'],
  [/\bAloo\b/gi, 'आलू'],
  [/\bPaneer\b/gi, 'पनीर'],
  [/\bDal\b/gi, 'दाल'],
  [/\bParatha\b/gi, 'पराठा'],
  [/\bChapati\b/gi, 'चपाती'],
  [/\bPhulka\b/gi, 'फुल्का'],
];

function localizeRecipeTitleToHindi(title: string): string {
  const exact: Record<string, string> = {
    'Plain Rice': 'सादा चावल',
    Chapati: 'चपाती',
    Phulka: 'फुल्का',
  };
  if (exact[title]) return exact[title];

  let result = title;
  for (const [pattern, replacement] of TITLE_WORD_HI) {
    result = result.replace(pattern, replacement);
  }
  return /[\u0900-\u097F]/.test(result) ? result.trim() : title;
}

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
  [/\bGarnish\b/gi, 'गार्निश करें'],
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
];

function localizePhrase(step: string): string {
  let result = step;
  for (const [pattern, replacement] of PHRASE_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/** Build Hindi steps from English recipe steps when curated HI copy is unavailable. */
export function localizeStepsToHindi(englishSteps: string[], title: string): string[] {
  const titleHi = localizeRecipeTitleToHindi(title);

  if (englishSteps.length === 0) {
    return [
      `${titleHi} की सभी सामग्री तैयार करें।`,
      'सब्ज़ियाँ काटें और मसाले नापकर रखें।',
      'धीमी आँच पर पकाएँ; नमक स्वाद अनुसार।',
      'गार्निश करके गर्म परोसें।',
    ];
  }

  return englishSteps.map((step, index) => {
    const localized = localizePhrase(step);
    if (localized !== step) return localized;
    if (index === 0) return `${titleHi}: ${step}`;
    return step;
  });
}
