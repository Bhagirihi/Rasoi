export type SyncMemberResult =
  | { status: 'created'; userId: string; email: string }
  | { status: 'updated'; userId: string; email: string }
  | { status: 'linked'; userId: string; email: string }
  | { status: 'skipped'; reason: string; email?: string }
  | { status: 'error'; message: string; email?: string };

export type SyncMembersSummary = {
  created: number;
  updated: number;
  linked: number;
  skipped: number;
  errors: number;
  details: SyncMemberResult[];
};

export type SyncRecipesSummary = {
  synced: number;
  orphansRemoved: number;
};

export type SyncKitchenStylesSummary = {
  synced: number;
};

export type SupabaseDataSyncSummary = {
  members: SyncMembersSummary;
  recipes: SyncRecipesSummary;
  kitchenStyles: SyncKitchenStylesSummary;
};

export function formatSyncMembersSummary(summary: SyncMembersSummary): string {
  const parts = [
    `${summary.created} created`,
    `${summary.updated} updated`,
    `${summary.linked} linked`,
  ];
  if (summary.skipped > 0) parts.push(`${summary.skipped} skipped`);
  if (summary.errors > 0) parts.push(`${summary.errors} errors`);
  return parts.join(', ');
}
