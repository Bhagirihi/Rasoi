const DELETE_ACCOUNT_REASON_LABELS: Record<string, string> = {
  not_using: "I don't use the app anymore",
  missing_recipes: "Couldn't find the recipes I wanted",
  too_many_notifications: 'Too many notifications',
  technical_issues: 'App issues or bugs',
  privacy_concerns: 'Privacy concerns',
  other: 'Other',
};

export function formatDeleteAccountFeedbackMessage(
  reason: string,
  reasonDetail?: string,
): string {
  const label = DELETE_ACCOUNT_REASON_LABELS[reason] ?? reason;
  const detail = reasonDetail?.trim();
  const message = detail ? `${label}: ${detail}` : label;
  return `[Account deletion] ${message}`.slice(0, 2000);
}
