'use client';

import { useEffect } from 'react';

import { PLAY_STORE_LISTING_URL } from '@/lib/app-download';

/** Sends humans to Google Play; crawlers still read the server-rendered page content. */
export default function PlayStoreAutoRedirect() {
  useEffect(() => {
    window.location.replace(PLAY_STORE_LISTING_URL);
  }, []);

  return (
    <p className="mt-6 text-sm leading-relaxed text-[#6b6560]">
      Redirecting to Google Play…{' '}
      <a
        href={PLAY_STORE_LISTING_URL}
        className="font-semibold text-[#c45c2a] hover:text-[#1a1a2e]"
        rel="noopener noreferrer"
      >
        Open Rasoi: Aaj Kya Banaye? on Play Store
      </a>
    </p>
  );
}
