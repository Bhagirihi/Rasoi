const UNSPLASH_BASE_URL = 'https://images.unsplash.com/photo-';
const UNSPLASH_QUERY = '?auto=format&fit=crop&w=1600&q=80';

export const RECIPE_IMAGE_KEYWORDS: Record<string, string> = {
  undhiyu: '1615485290382-441e4d049cb5',
  thepla: '1512058564366-18510be2db19',
  dosa: '1668236543090-82eba5ee5976',
  idli: '1589301760014-d929f3979dbc',
  sambar: '1613292443284-8d10ef9383fe',
  biryani: '1563379091339-03246963d29a',
  paratha: '1610057099443-fde8c4d50f91',
  chole: '1626132647523-66f5bf380027',
  dal: '1546833999-b9f581a1996d',
  paneer: '1603894584373-5ac82b2ae398',
  curry: '1604909053196-e57c3b7f9f58',
  fish: '1611171711914-0f457f0f04b5',
  prawn: '1565680018434-b513d7a6f3a5',
  noodles: '1617093727343-374698b1b08d',
  manchurian: '1534939561126-855b8675edd7',
  'pav-bhaji': '1606491956689-2ea866880c84',
  'vada-pav': '1630383249896-424e482df921',
  'misal-pav': '1606491956689-2ea866880c84',
  'usal-pav': '1606491956689-2ea866880c84',
  'dabeli': '1606491956689-2ea866880c84',
  'keema-pav': '1603360946369-dc9bb6258143',
  'omelette-pav': '1559847844-5315695dadae',
  vada: '1630383249896-424e482df921',
  poha: '1630914947470-8ef0f3f1298c',
  roti: '1601050690597-df0568f70950',
  rice: '1536304993881-ff6e9eefa2a6',
  kebab: '1529193591184-b1d58069ecdd',
  'rogan-josh': '1603360946369-dc9bb6258143',
  appam: '1631452180539-96aca7d48617',
  avial: '1604329760661-e71dc83f8f26',
  yakhni: '1589302168068-964664d93dc0',
  rajma: '1574484284002-952d92456975',
  'dum-aloo': '1604908177078-694be6ea0f3d',
  haak: '1550304943-4f24f54ddde9',
  pulao: '1596797038530-2c107229654b',
  chutney: '1526318896980-cf78c088247c',
  'mutton-curry': '1606491956394-5b8b6a5be0f6',
  'duck-curry': '1467003909585-2f8a72700288',
  'fish-curry': '1628294896516-2d4a3e9f17e6',
  'prawn-curry': '1610057099431-d73a1c9d2d6e',
  'chicken-curry': '1603893662172-99ed0cea2a08',
  'paneer-curry': '1596797038228-516a81b5f07d',
  'egg-curry': '1559847844-5315695dadae',
  rasam: '1625944239037-8d7c6f9b8d7f',
  'fish-fry': '1519708227418-c8fd9a32b7a2',
  'pepper-chicken': '1604908554168-42a6e5d6c8c7',
  'pepper-mutton': '1604909052743-94e8387f6dc0',
  pork: '1603360946369-638ca45c6f24',
  'pork-curry': '1544025162-d76694265947',
  seafood: '1562967916-eb82221dfb92',
  'stir-fry': '1515003197210-e0cd71810b5f',
  saag: '1512621776951-a57141f2eefd',
  aloo: '1604908812830-4f315e8f22fb',
  baingan: '1604908177522-0403f8b9f8f6',
  dessert: '1499636136210-6f4ee915583e',
  breakfast: '1504753793650-d4a2b783c15e',
  'vegetable-curry': '1543352634-a1c51d9f1fa7',
  khichdi: '1606491956680-cf2b3dc32f0a',
  upma: '1626074299370-4b8f97f8aee4',
  uttapam: '1666001067904-54be21f8a238',
  rasgulla: '1601050690284-8f618f3f56f7',
  jalebi: '1605197161473-5dc7e8f8df4e',
  pakora: '1626082927389-6f9d4d9dbb8f',
  samosa: '1601050690291-4c2f3c9f72d4',
  kulcha: '1625944525533-473cc2c16d8a',
  kulfi: '1570197788417-0e82375c9371',
  payasam: '1604329760239-d79f3c0c426b',
  halwa: '1631452180902-54eb11b4b7a5',
  korma: '1574484283845-4e123dca2656',
  kofta: '1596797038784-1f8cc5b64cf2',
  tikka: '1525755662778-989d0524087e',
  naan: '1517248135467-4c7edcad34c4',
  tandoori: '1529692236671-f1dc66f32f2b',
  dhokla: '1589301760014-d929f3979dbc',
  handvo: '1606491956680-cf2b3dc32f0a',
  kadhi: '1546833999-b9f581a1996d',
  tameta: '1604908812830-4f315e8f22fb',
  shaak: '1543352634-a1c51d9f1fa7',
  patra: '1604329760661-e71dc83f8f26',
  kachori: '1601050690291-4c2f3c9f72d4',
  misal: '1606491956689-2ea866880c84',
  bhel: '1526318896980-cf78c088247c',
  puri: '1630383249896-424e482df921',
  kathi: '1610057099443-fde8c4d50f91',
  keema: '1603360946369-dc9bb6258143',
  bonda: '1630383249896-424e482df921',
  bhature: '1625944525533-473cc2c16d8a',
  makhani: '1546833999-b9f581a1996d',
  bharta: '1604908177522-0403f8b9f8f6',
  makki: '1601050690597-df0568f70950',
  baati: '1606491956680-cf2b3dc32f0a',
  churma: '1631452180902-54eb11b4b7a5',
  gatte: '1543352634-a1c51d9f1fa7',
  sangri: '1512621776951-a57141f2eefd',
  maas: '1603360946369-dc9bb6258143',
  ilish: '1611171711914-0f457f0f04b5',
  chingri: '1565680018434-b513d7a6f3a5',
  mangsho: '1606491956394-5b8b6a5be0f6',
  posto: '1604329760661-e71dc83f8f26',
  shukto: '1543352634-a1c51d9f1fa7',
  luchi: '1601050690597-df0568f70950',
  bhetki: '1611171711914-0f457f0f04b5',
  pithla: '1546833999-b9f581a1996d',
  bhakri: '1512058564366-18510be2db19',
  vangi: '1604908177522-0403f8b9f8f6',
  thalipeeth: '1512058564366-18510be2db19',
  sukka: '1604908554168-42a6e5d6c8c7',
  salan: '1604908812830-4f315e8f22fb',
  haleem: '1546833999-b9f581a1996d',
  cafreal: '1604908554168-42a6e5d6c8c7',
  vindaloo: '1603360946369-638ca45c6f24',
  xacuti: '1604909053196-e57c3b7f9f58',
  bebinca: '1499636136210-6f4ee915583e',
  puttu: '1512058564366-18510be2db19',
  thoran: '1543352634-a1c51d9f1fa7',
  molee: '1611171711914-0f457f0f04b5',
  parotta: '1610057099443-fde8c4d50f91',
  erissery: '1604329760661-e71dc83f8f26',
  hakka: '1617093727343-374698b1b08d',
  gobi: '1604908177522-0403f8b9f8f6',
  chilli: '1534939561126-855b8675edd7',
  schezwan: '1536304993881-ff6e9eefa2a6',
  chopsuey: '1617093727343-374698b1b08d',
  khar: '1543352634-a1c51d9f1fa7',
  tenga: '1611171711914-0f457f0f04b5',
  pitika: '1604908812830-4f315e8f22fb',
  gushtaba: '1603360946369-dc9bb6258143',
  nadru: '1604329760661-e71dc83f8f26',
  chukka: '1604909052743-94e8387f6dc0',
  kuzhambu: '1604909053196-e57c3b7f9f58',
  paniyaram: '1589301760014-d929f3979dbc',
  kurma: '1574484283845-4e123dca2656',
  kaalan: '1604908177522-0403f8b9f8f6',
  chaat: '1526318896980-cf78c088247c',
  lassi: '1551024709-81671997a4e5',
  meetha: '1499636136210-6f4ee915583e',
  "kharoli-diya-borali": "1611171711914-0f457f0f04b5",
  "mati-dali-kosu-xaak": "1546833999-b9f581a1996d",
  "til-pora-bilahi-maas": "1628294896516-2d4a3e9f17e6",
  "hahor-logot-lai-xaak": "1467003909585-2f8a72700288",
  "koni-posola-bhurta": "1559847844-5315695dadae",
  "joha-saul-bhapa-pitha": "1512058564366-18510be2db19",
  "bhetki-khar-tenga": "1611171711914-0f457f0f04b5",
  "masor-tenga-jolokia": "1628294896516-2d4a3e9f17e6",
  "pura-bilahi-pitika": "1604908812830-4f315e8f22fb",
  "bhapot-koni-paturi": "1611171711914-0f457f0f04b5",
  "pitika-trio-axomiya": "1604908812830-4f315e8f22fb",
  "rajma-gogji-yakhni": "1574484284002-952d92456975",
  "nadru-chaman-kaliya": "1604329760661-e71dc83f8f26",
  "tamatar-tschok-gaad": "1611171711914-0f457f0f04b5",
  "kashmiri-rogan-aloo": "1604908177078-694be6ea0f3d",
  "doodhi-yakhni-mutton": "1606491956394-5b8b6a5be0f6",
  "ver-masala-tchaaman": "1603894584373-5ac82b2ae398",
  "kesar-badam-pulao-koshur": "1596797038530-2c107229654b",
  "marchwangan-anda": "1559847844-5315695dadae",
  "walnut-haakh-paneer": "1603894584373-5ac82b2ae398",
  "muji-chetin-chutney": "1526318896980-cf78c088247c",
  "kashmiri-dum-chole": "1626132647523-66f5bf380027",
  "sonth-saunf-fish-curry": "1628294896516-2d4a3e9f17e6",
  "kashmiri-methi-rogan-josh": "1603360946369-dc9bb6258143",
  "kashmiri-punjabi-kebab-curry": "1529193591184-b1d58069ecdd",
  "walnut-rajma-yakhni": "1574484284002-952d92456975",
  "nadru-saffron-korma": "1574484283845-4e123dca2656",
  "yakhni-prawn-koshur": "1565680018434-b513d7a6f3a5",
  "kozhi-puli-milagu-kuzhambu": "1604909053196-e57c3b7f9f58",
  "eral-thokku-seeraga": "1565680018434-b513d7a6f3a5",
  "chettinad-vazhakkai-chops": "1604908177522-0403f8b9f8f6",
  "kollu-milagu-masiyal": "1546833999-b9f581a1996d",
  "muttai-kara-kuzhambu": "1559847844-5315695dadae",
  "nandu-poondu-varuval": "1562967916-eb82221dfb92",
  "kathirikai-milagu-roast": "1604908177522-0403f8b9f8f6",
  "kambu-kozhukattai-kurma": "1574484283845-4e123dca2656",
  "seeraga-samba-mutton-choru": "1563379091339-03246963d29a",
  "karuveppilai-paneer-pepper-fry": "1603894584373-5ac82b2ae398",
  "murungakkai-mutton-soup": "1606491956394-5b8b6a5be0f6",
  "kadalai-urundai-kuzhambu": "1604909053196-e57c3b7f9f58",
  "pacha-milagai-chicken-roast": "1604908554168-42a6e5d6c8c7",
  "vazhaipoo-kozhi-cutlet": "1604908554168-42a6e5d6c8c7",
  "thakkali-milagu-rasam": "1625944239037-8d7c6f9b8d7f",
  "poondu-era-puli-curry": "1610057099431-d73a1c9d2d6e",
  "kola-urundai-pepper-masala": "1603360946369-dc9bb6258143",
  "nethili-podi-fry": "1519708227418-c8fd9a32b7a2",
  "karaikudi-fish-kuzhambu": "1628294896516-2d4a3e9f17e6",
  "mutton-chinna-vengayam-thokku": "1603360946369-dc9bb6258143",
  "chettinad-south-coconut-adai": "1512058564366-18510be2db19",
  "pepper-crab-kuzhambu": "1562967916-eb82221dfb92",
  "sukka-mutton-masiyal": "1603360946369-dc9bb6258143",
  "prawn-thengai-roast": "1565680018434-b513d7a6f3a5",
  "karaikudi-tomato-rice": "1536304993881-ff6e9eefa2a6",
};

function normalizeImageKeyword(keyword: string): string {
  return keyword.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function resolveImageId(keyword: string): string | undefined {
  const normalized = normalizeImageKeyword(keyword);
  if (!normalized) return undefined;
  if (RECIPE_IMAGE_KEYWORDS[normalized]) return RECIPE_IMAGE_KEYWORDS[normalized];
  for (const part of normalized.split('-')) {
    if (part && RECIPE_IMAGE_KEYWORDS[part]) return RECIPE_IMAGE_KEYWORDS[part];
  }
  return undefined;
}

function buildImageUrl(imageId: string): string {
  return `${UNSPLASH_BASE_URL}${imageId}${UNSPLASH_QUERY}`;
}

/** Prefer the longest matching dish keyword so "Paneer Pav Bhaji" maps to pav-bhaji, not paneer. */
function resolveImageIdFromTitle(normalizedTitle: string): string | undefined {
  if (RECIPE_IMAGE_KEYWORDS[normalizedTitle]) {
    return RECIPE_IMAGE_KEYWORDS[normalizedTitle];
  }

  const sortedKeywords = Object.entries(RECIPE_IMAGE_KEYWORDS).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [keyword, imageId] of sortedKeywords) {
    if (normalizedTitle.includes(keyword)) {
      return imageId;
    }
  }

  return undefined;
}

export function imageForRecipe(title: string, imageKeyword?: string): string {
  const fromKeyword = imageKeyword ? resolveImageId(imageKeyword) : undefined;
  if (fromKeyword) {
    return buildImageUrl(fromKeyword);
  }

  const normalizedTitle = normalizeImageKeyword(title);
  const fromTitle = resolveImageIdFromTitle(normalizedTitle);
  if (fromTitle) {
    return buildImageUrl(fromTitle);
  }

  return buildImageUrl(RECIPE_IMAGE_KEYWORDS.curry);
}
