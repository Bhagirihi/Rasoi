import { permanentRedirect } from 'next/navigation';

import { MARKET_PATHS } from '@/lib/markets';

export default function AuShortRedirect() {
  permanentRedirect(MARKET_PATHS.AU);
}
