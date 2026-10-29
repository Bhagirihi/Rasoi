import { permanentRedirect } from 'next/navigation';

import { MARKET_PATHS } from '@/lib/markets';

export default function UsShortRedirect() {
  permanentRedirect(MARKET_PATHS.US);
}
