import { permanentRedirect } from 'next/navigation';

import { MARKET_PATHS } from '@/lib/markets';

export default function NzShortRedirect() {
  permanentRedirect(MARKET_PATHS.NZ);
}
