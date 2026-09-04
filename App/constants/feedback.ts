export type FeedbackCategory = 'issue' | 'suggestion' | 'other';

export const FEEDBACK_CATEGORIES: {
  id: FeedbackCategory;
  label: string;
  description: string;
}[] = [
  {
    id: 'issue',
    label: 'Report an issue',
    description: 'Something broken or not working as expected.',
  },
  {
    id: 'suggestion',
    label: 'Suggestion',
    description: 'Ideas to improve recipes, UI, or features.',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'General feedback or questions for the team.',
  },
];
