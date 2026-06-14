import type { ReactNode } from 'react';

import { PremiumFrame } from '@/components/PremiumDecor';

type JamvanuFrameProps = {
  headline: ReactNode;
  tagline?: ReactNode;
  children: ReactNode;
  stat?: ReactNode;
  /** Maps screen → decor layout */
  decor?: 'hero' | 'dinner' | 'pantry' | 'recipes' | 'partners' | 'notifications' | 'final';
};

export function JamvanuFrame({ headline, tagline, children, decor = 'hero' }: JamvanuFrameProps) {
  return (
    <PremiumFrame headline={headline} tagline={tagline} decor={decor}>
      {children}
    </PremiumFrame>
  );
}
