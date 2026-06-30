export type DeleteAccountReason =
  | 'not_using'
  | 'missing_recipes'
  | 'too_many_notifications'
  | 'technical_issues'
  | 'privacy_concerns'
  | 'other';

export const DELETE_ACCOUNT_REASONS: {
  id: DeleteAccountReason;
  label: string;
}[] = [
  { id: 'not_using', label: "I don't use the app anymore" },
  { id: 'missing_recipes', label: "Couldn't find the recipes I wanted" },
  { id: 'too_many_notifications', label: 'Too many notifications' },
  { id: 'technical_issues', label: 'App issues or bugs' },
  { id: 'privacy_concerns', label: 'Privacy concerns' },
  { id: 'other', label: 'Other' },
];

export function getDeleteAccountReasonLabel(reason: DeleteAccountReason): string {
  return DELETE_ACCOUNT_REASONS.find((item) => item.id === reason)?.label ?? reason;
}
