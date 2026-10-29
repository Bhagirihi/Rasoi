import { permanentRedirect } from 'next/navigation';

import { MARKET_PATHS } from '@/lib/markets';

export default function CaShortRedirect() {
  permanentRedirect(MARKET_PATHS.CA);
}
