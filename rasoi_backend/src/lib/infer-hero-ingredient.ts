/**
 * Infer the primary (hero) ingredient name from a recipe title.
 * Used by catalog generators and Supabase fix scripts so titles like
 * "Bajra Khichdi" get Bajra — not generic Millet or fallback Aloo.
 */
export function inferHeroIngredientFromTitle(title: string, fallback = 'Aloo'): string {
  const lower = title.toLowerCase();

  if (lower.includes('bajra') || lower.includes('bajri')) {
    if (
      lower.includes('rotla') ||
      lower.includes('roti') ||
      lower.includes('thepla') ||
      lower.includes('paratha') ||
      lower.includes('dhebra') ||
      lower.includes('bhakri')
    ) {
      return 'Bajra Atta';
    }
    return 'Bajra';
  }
  if (lower.includes('ragi')) return 'Ragi';
  if (lower.includes('jowar') || lower.includes('sorghum')) {
    if (lower.includes('roti') || lower.includes('rotla') || lower.includes('bhakri')) return 'Jowar Atta';
    return 'Jowar';
  }
  if (lower.includes('quinoa')) return 'Quinoa';
  if (lower.includes('oats') || lower.includes('oat ')) return 'Oats';
  if (lower.includes('brown rice')) return 'Brown Rice';
  if (lower.includes('poha')) return 'Poha';
  if (lower.includes('sweet corn') || (lower.includes('corn') && lower.includes('soup'))) return 'Sweet Corn';
  if (lower.includes('sabudana') || lower.includes('sago')) return 'Sabudana';
  if (lower.includes('raab') && (lower.includes('bajra') || lower.includes('bajri'))) return 'Bajra Atta';
  if (lower.includes('millet') && !lower.includes('bajra') && !lower.includes('ragi') && !lower.includes('jowar')) {
    return 'Millet';
  }

  if (lower.includes('fish') || lower.includes('meen') || lower.includes('maach') || lower.includes('bhetki') || lower.includes('rui') || lower.includes('salmon')) {
    return 'Fish';
  }
  if (lower.includes('prawn') || lower.includes('shrimp') || lower.includes('kolmi') || lower.includes('jhinga') || lower.includes('chemmeen')) {
    return 'Prawns';
  }
  if (lower.includes('crab')) return 'Crab';
  if (lower.includes('mutton') || lower.includes('gosht') || lower.includes('lamb') || lower.includes('beef') || lower.includes('pork')) {
    return 'Mutton';
  }
  if (lower.includes('chicken') || lower.includes('murgh') || lower.includes('kozhi') || lower.includes('piccata') || lower.includes('schnitzel')) {
    return 'Chicken';
  }
  if (lower.includes('duck')) return 'Duck';
  if (lower.includes('keema')) return 'Keema';
  if (lower.includes('egg') || lower.includes('anda') || lower.includes('omelette') || lower.includes('omelet')) {
    return 'Anda';
  }
  if (lower.includes('paneer') || lower.includes('burrata') || lower.includes('ricotta') || lower.includes('tschaman') || lower.includes('chaman')) {
    return 'Paneer';
  }
  if (lower.includes('tofu') || lower.includes('tempeh')) return 'Tofu';
  if (lower.includes('chickpea') || lower.includes('chana') || lower.includes('chole') || lower.includes('cholar')) {
    return 'Chana';
  }
  if (lower.includes('rajma')) return 'Rajma';
  if (lower.includes('tuver') || lower.includes('toor') || lower.includes('arhar')) return 'Tuver Dal';
  if (lower.includes('urad')) return 'Urad Dal';
  if (lower.includes('masoor')) return 'Masoor Dal';
  if (lower.includes('moong') || lower.includes('mung')) return 'Moong Dal';
  if (lower.includes('chana dal')) return 'Chana Dal';
  if (lower.includes('dal') || lower.includes('lentil') || lower.includes('kadhi')) return 'Moong Dal';
  if (lower.includes('mushroom')) return 'Mushroom';
  if (lower.includes('jackfruit') || lower.includes('kathal')) return 'Kathal';
  if (lower.includes('soya') || lower.includes('chaap')) return 'Soya Chunks';
  if (lower.includes('besan') || lower.includes('gatta') || lower.includes('muthia')) return 'Besan';
  if (lower.includes('rice') || lower.includes('chawal') || lower.includes('biryani') || lower.includes('pulao')) {
    return 'Basmati Chawal';
  }
  if (lower.includes('dosa') || lower.includes('idli') || lower.includes('appam') || lower.includes('uttapam')) {
    return 'Dosa Batter';
  }
  if (lower.includes('paratha') || lower.includes('roti') || lower.includes('thepla') || lower.includes('rotla') || lower.includes('missi')) {
    return 'Gehu Atta';
  }
  if (lower.includes('aloo') || lower.includes('potato') || lower.includes('bateta')) return 'Aloo';

  return fallback;
}

/** True when stored hero ingredient clearly disagrees with the recipe title. */
export function heroIngredientMismatch(title: string, heroName: string): boolean {
  const expected = inferHeroIngredientFromTitle(title, '').trim();
  if (!expected) return false;

  const hero = heroName.trim().toLowerCase();
  const exp = expected.toLowerCase();
  if (hero === exp) return false;

  // Allow canonical dal / grain variants that still match the title intent.
  if (exp.includes('dal') && hero.includes('dal') && (hero.includes(exp.split(' ')[0]!) || exp.includes(hero.split(' ')[0]!))) {
    return false;
  }
  if (exp.includes('bajra') && hero.includes('bajra')) return false;
  if (exp.includes('ragi') && hero.includes('ragi')) return false;
  if (exp.includes('jowar') && hero.includes('jowar')) return false;
  if (exp.includes('chana') && hero.includes('chana')) return false;
  if (exp.includes('dosa') && hero.includes('dosa')) return false;
  if (exp.includes('atta') && hero.includes('atta')) return false;

  if (hero === 'millet' && /bajra|ragi|jowar/i.test(title)) return true;
  if (hero === 'aloo' && /bajra|ragi|jowar|millet|quinoa|khichdi|rotla|thepla|raab/i.test(title)) return true;
  if (/bajra|ragi|jowar/i.test(title) && !/bajra|ragi|jowar|millet|atta/i.test(hero)) return true;
  if (/khichdi|khichri/i.test(title) && hero === 'millet' && /bajra|ragi|jowar/i.test(title)) return true;

  return false;
}
