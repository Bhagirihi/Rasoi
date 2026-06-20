export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsvRow(cells: Array<string | number | null | undefined>): string {
  return cells.map(escapeCsvCell).join(',');
}

export function buildSponsorAnalyticsCsv(input: {
  filters: { brand?: string; placement?: string; days: number };
  summary: Array<{
    brandName: string;
    placement: string;
    impressions: number;
    taps: number;
    tapRate: number;
  }>;
  totals: { impressions: number; taps: number; tapRate: number };
  events: Array<{
    eventType: string;
    brandName: string;
    placement: string;
    userName: string | null;
    city: string | null;
    sponsorId: string | null;
    partner: string | null;
    query: string | null;
    createdAt: Date;
  }>;
}): string {
  const lines: string[] = [];

  lines.push(`# Rasoi sponsor analytics export`);
  lines.push(`# Period: last ${input.filters.days} days`);
  if (input.filters.brand) lines.push(`# Brand filter: ${input.filters.brand}`);
  if (input.filters.placement) lines.push(`# Placement filter: ${input.filters.placement}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push('');

  lines.push(toCsvRow(['Summary — totals', '', '', '', '']));
  lines.push(toCsvRow(['Impressions', 'Taps', 'Tap rate %', '', '']));
  lines.push(toCsvRow([input.totals.impressions, input.totals.taps, input.totals.tapRate, '', '']));
  lines.push('');

  lines.push(toCsvRow(['Summary — by brand & placement', '', '', '', '']));
  lines.push(toCsvRow(['Brand', 'Placement', 'Impressions', 'Taps', 'Tap rate %']));
  for (const row of input.summary) {
    lines.push(toCsvRow([row.brandName, row.placement, row.impressions, row.taps, row.tapRate]));
  }
  lines.push('');

  lines.push(toCsvRow(['Event log', '', '', '', '', '', '', '']));
  lines.push(
    toCsvRow([
      'Event type',
      'Brand',
      'Placement',
      'User',
      'City',
      'Sponsor ID',
      'Partner',
      'Query',
      'Timestamp (IST)',
    ]),
  );

  for (const event of input.events) {
    lines.push(
      toCsvRow([
        event.eventType,
        event.brandName,
        event.placement,
        event.userName ?? 'Guest',
        event.city ?? '',
        event.sponsorId ?? '',
        event.partner ?? '',
        event.query ?? '',
        event.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ]),
    );
  }

  return `${lines.join('\n')}\n`;
}

export function sponsorAnalyticsExportFilename(filters: {
  brand?: string;
  placement?: string;
  days: number;
}): string {
  const parts = ['rasoi-sponsor-analytics'];
  if (filters.brand) {
    parts.push(filters.brand.toLowerCase().replace(/[^a-z0-9]+/gi, '-'));
  }
  if (filters.placement) {
    parts.push(filters.placement);
  }
  parts.push(`${filters.days}d`);
  parts.push(new Date().toISOString().slice(0, 10));
  return `${parts.join('-')}.csv`;
}
