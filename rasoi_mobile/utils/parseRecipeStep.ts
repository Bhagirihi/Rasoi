export type ParsedRecipeStep = {
  title: string;
  durationLabel?: string;
  body: string;
  tip?: string;
};

const TIP_PATTERN =
  /\b(Pro tip|The [^.]+ trick|Tip):\s*(.+)$/i;

const TITLE_RULES: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /\b(rinse|wash|slice|tear|cube|cut|chop|gather|soak|drain|spread)\b/i, title: 'Prep ingredients' },
  { pattern: /\b(heat oil|temper|tadka|mustard seeds|jeera|rai)\b/i, title: 'Temper the aromatics' },
  { pattern: /\b(saut[eé]|onion|garlic|ginger)\b/i, title: 'Sauté the aromatics' },
  { pattern: /\b(add turmeric|toss|coat|bread pieces|main grain|hero)\b/i, title: 'Cook the main ingredient' },
  { pattern: /\b(simmer|pressure-cook|steam|cover|boil)\b/i, title: 'Cook through' },
  { pattern: /\b(finish|serve|garnish|rest)\b/i, title: 'Finish and serve' },
];

function inferStepTitle(step: string, index: number, total: number): string {
  const lower = step.toLowerCase();
  for (const rule of TITLE_RULES) {
    if (rule.pattern.test(lower)) return rule.title;
  }

  if (index === 0) return 'Prep';
  if (index === total - 1) return 'Finish and serve';

  const firstClause = step.split(/[.;]/)[0]?.trim() ?? step;
  if (firstClause.length <= 44) return firstClause;
  return `${firstClause.slice(0, 41).trim()}…`;
}

function inferDurationLabel(index: number, total: number, prepTime: number): string | undefined {
  if (total <= 1) return `${prepTime} mins`;
  if (index === 0) return 'Prep';
  if (index === total - 1) return '1–2 mins';

  const cookMinutes = Math.max(
    2,
    Math.round((Math.max(prepTime, total * 2) - 2) / Math.max(1, total - 1)),
  );
  return `${cookMinutes} mins`;
}

function extractTip(step: string): { body: string; tip?: string } {
  const match = step.match(TIP_PATTERN);
  if (!match) return { body: step };

  const tip = match[2]?.trim();
  const body = step.slice(0, match.index).trim().replace(/[.;]\s*$/, '');
  return {
    body: body || step.replace(TIP_PATTERN, '').trim(),
    tip,
  };
}

export function parseRecipeStep(
  step: string,
  index: number,
  total: number,
  prepTime: number,
): ParsedRecipeStep {
  const { body, tip } = extractTip(step);

  return {
    title: inferStepTitle(body, index, total),
    durationLabel: inferDurationLabel(index, total, prepTime),
    body,
    tip,
  };
}

export function parseRecipeSteps(
  steps: string[],
  prepTime: number,
): ParsedRecipeStep[] {
  return steps.map((step, index) => parseRecipeStep(step, index, steps.length, prepTime));
}
