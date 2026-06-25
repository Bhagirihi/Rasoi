const FRACTION_MAP: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '1.25': '1¼',
  '1.5': '1½',
  '1.75': '1¾',
  '2.5': '2½',
};

function formatScaledNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const key = String(rounded);
  if (FRACTION_MAP[key]) return FRACTION_MAP[key];
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1).replace(/\.0$/, '');
}

function scaleQuantityToken(token: string, multiplier: number): string {
  const fractionMatch = token.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const value = Number(fractionMatch[1]) / Number(fractionMatch[2]);
    return formatScaledNumber(value * multiplier);
  }

  const rangeMatch = token.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    const low = Number(rangeMatch[1]) * multiplier;
    const high = Number(rangeMatch[2]) * multiplier;
    return `${formatScaledNumber(low)}–${formatScaledNumber(high)}`;
  }

  const numberMatch = token.match(/^(\d+(?:\.\d+)?)/);
  if (!numberMatch) return token;

  const scaled = Number(numberMatch[1]) * multiplier;
  return token.replace(numberMatch[1], formatScaledNumber(scaled));
}

/** Scale leading quantities in ingredient names (e.g. "2 cups Rice" → "4 cups Rice" at 2×). */
export function scaleIngredientLabel(name: string, multiplier: number): string {
  if (multiplier === 1) return name;
  const trimmed = name.trim();
  const match = trimmed.match(/^([\d./\s–-]+)\s+(.+)$/);
  if (!match) return name;
  const scaledQty = scaleQuantityToken(match[1].trim(), multiplier);
  return `${scaledQty} ${match[2]}`;
}

export function servingMultiplierLabel(multiplier: number, householdSize: number): string {
  const baseServes = householdSize;
  const scaled = Math.max(1, Math.round(baseServes * multiplier));
  return `Serves ~${scaled}`;
}
