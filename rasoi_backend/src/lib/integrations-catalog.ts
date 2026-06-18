import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

export type IntegrationStatus = 'live' | 'configured' | 'test' | 'planned' | 'optional';

export type IntegrationEntry = {
  id: string;
  name: string;
  category: 'Mobile monetization' | 'Mobile app' | 'Backend & data' | 'Email & auth' | 'Marketing & ops';
  purpose: string;
  usedIn: string[];
  account: string;
  envVars: string[];
  status: IntegrationStatus;
  statusNote: string;
  consoleUrl?: string;
  docsPath?: string;
};

export type EmailAccountEntry = {
  email: string;
  role: string;
  usedFor: string[];
  notes?: string;
};

export type EmailExclusionNote = {
  label: string;
  detail: string;
};

/** Public contact is LEGAL_CONTACT_EMAIL — these stay separate on purpose. */
export const INTEGRATION_EMAIL_EXCLUSIONS: EmailExclusionNote[] = [
  {
    label: 'admin@rasoi.app',
    detail:
      'Admin console login only (/admin). Not shown to app users. Override seed with ADMIN_EMAIL in backend .env.',
  },
  {
    label: 'my.website.email2@gmail.com',
    detail:
      'Private Google account for AdMob console, AdMob MCP OAuth, and Cursor Gmail MCP (device QA). Not the public support address.',
  },
  {
    label: 'User sign-in emails',
    detail:
      'Each user’s own email at login/register. OTP delivery uses Supabase Auth SMTP — configure sender separately in Supabase Dashboard if you want mail from cooking@.',
  },
  {
    label: 'firebase-adminsdk-…@rasoi-app-prod.iam.gserviceaccount.com',
    detail: 'Firebase service account for FCM push — not a mailbox.',
  },
];

/** Operator reference — no secrets. Update when accounts or providers change. */
export const INTEGRATION_EMAIL_ACCOUNTS: EmailAccountEntry[] = [
  {
    email: LEGAL_CONTACT_EMAIL,
    role: 'Public support, legal & sponsors',
    usedFor: [
      'Privacy policy and Terms contact',
      'Sponsor applications (website)',
      'Mobile Settings footer & feedback',
      'Website footer and mailto links',
    ],
    notes: 'Primary public address. Cloudflare Email Routing → Gmail inbox for receive/send.',
  },
  {
    email: 'admin@rasoi.app',
    role: 'Admin console (default seed)',
    usedFor: ['Rasoi admin login at /admin'],
    notes: 'Override with ADMIN_EMAIL in backend .env before production seed.',
  },
  {
    email: 'Gmail (Supabase SMTP)',
    role: 'Auth OTP sender',
    usedFor: ['Mobile email sign-in codes via Supabase Auth'],
    notes:
      'Set in Supabase Dashboard → Authentication → SMTP (smtp.gmail.com:587 + Google App Password). Sender name: Rasoi App.',
  },
  {
    email: 'my.website.email2@gmail.com',
    role: 'Google · AdMob & dev tooling',
    usedFor: [
      'AdMob console owner (pub-4173581536398147)',
      'AdMob MCP OAuth (.cursor/mcp-servers/admob)',
      'Cursor Gmail MCP — read OTP during device QA',
    ],
    notes: 'Same Google account for AdMob app registration and local MCP auth. Gmail IMAP: gmail-imap/.env.',
  },
  {
    email: 'firebase-adminsdk-fbsvc@rasoi-app-prod.iam.gserviceaccount.com',
    role: 'Firebase service account',
    usedFor: ['FCM v1 push via Expo EAS', 'Meal notification delivery to Android'],
    notes: 'Google service account (not Gmail). Project: rasoi-app-prod.',
  },
];

export const INTEGRATION_SERVICES: IntegrationEntry[] = [
  {
    id: 'admob',
    name: 'Google AdMob',
    category: 'Mobile monetization',
    purpose: 'Banner ads when no native sponsor is active on Home, Recipes, Pantry, Saved, Recipe detail, Settings, Paywall.',
    usedIn: ['rasoi_mobile/components/AdMobBanner.tsx', 'react-native-google-mobile-ads', 'app.json plugin'],
    account: 'my.website.email2@gmail.com · pub-4173581536398147 · com.rasoi.app',
    envVars: [
      'app.json → androidAppId: ca-app-pub-4173581536398147~9898362276',
      'constants/admob.ts → banner unit IDs',
      '.cursor/mcp-servers/admob (Cursor MCP)',
    ],
    status: 'configured',
    statusNote:
      '5 production banner units (Home, Recipes, Pantry, Saved, Recipe detail). Rebuild release APK/AAB to serve real ads.',
    consoleUrl: 'https://apps.admob.com/',
    docsPath: '.cursor/mcp-servers/admob/README.md',
  },
  {
    id: 'revenuecat',
    name: 'RevenueCat',
    category: 'Mobile monetization',
    purpose: 'Planned App Store / Play subscription billing for Rasoi Plus (monthly ₹49, yearly ₹499).',
    usedIn: [
      'rasoi_mobile/services/payments/',
      'EXPO_PUBLIC_PAYMENT_PROVIDER=revenuecat',
      'rasoi_backend/api/billing/confirm (webhook verify — planned)',
    ],
    account: 'RevenueCat project (not linked yet)',
    envVars: ['EXPO_PUBLIC_REVENUECAT_IOS_KEY', 'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY', 'EXPO_PUBLIC_PAYMENT_PROVIDER'],
    status: 'planned',
    statusNote: 'Provider stub active. Install react-native-purchases + map product IDs when payments admin toggle is ON.',
    consoleUrl: 'https://app.revenuecat.com/',
    docsPath: 'rasoi_mobile/PAYMENTS.md',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    category: 'Mobile monetization',
    purpose: 'Optional UPI/cards checkout if you add web or hybrid billing.',
    usedIn: ['rasoi_mobile/constants/payments.ts', 'services/payments/index.ts'],
    account: 'Razorpay dashboard (optional)',
    envVars: ['EXPO_PUBLIC_RAZORPAY_KEY_ID'],
    status: 'planned',
    statusNote: 'Not wired. Alternative to RevenueCat for India UPI flows.',
    consoleUrl: 'https://dashboard.razorpay.com/',
    docsPath: 'rasoi_mobile/PAYMENTS.md',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'Mobile app',
    purpose: 'Crash reporting, performance traces, and session replay on mobile.',
    usedIn: ['@sentry/react-native', 'rasoi_mobile/utils/sentry.ts', 'app.json Sentry plugin'],
    account: 'Sentry org: rasoi-app · project: rasoi-mobile',
    envVars: ['EXPO_PUBLIC_SENTRY_DSN'],
    status: 'configured',
    statusNote: 'Set DSN in mobile .env before release APK/AAB builds.',
    consoleUrl: 'https://sentry.io/',
    docsPath: 'README.md',
  },
  {
    id: 'expo-eas',
    name: 'Expo / EAS',
    category: 'Mobile app',
    purpose: 'Builds, OTA config, push credentials, Android signing.',
    usedIn: ['eas.json', 'expo-notifications', 'app.json extra.eas.projectId'],
    account: 'Expo owner: @takeyshi · project: rasoi',
    envVars: ['EXPO_PUBLIC_EAS_PROJECT_ID', 'EAS credentials on expo.dev'],
    status: 'configured',
    statusNote: 'Production keystore + FCM v1 linked for com.rasoi.app.',
    consoleUrl: 'https://expo.dev/accounts/takeyshi/projects/rasoi',
    docsPath: 'rasoi_mobile/docs/PUSH_SETUP.md',
  },
  {
    id: 'firebase-fcm',
    name: 'Firebase (FCM)',
    category: 'Mobile app',
    purpose: 'Android push delivery for meal reminders and trial nudges.',
    usedIn: ['google-services.json', 'fcm-service-account.json', 'Expo push + backend cron'],
    account: 'Firebase project: rasoi-app-prod',
    envVars: ['google-services.json', 'FCM service account on EAS'],
    status: 'configured',
    statusNote: 'Service account uploaded to EAS. Backend sends via expo-server-sdk.',
    consoleUrl: 'https://console.firebase.google.com/',
    docsPath: 'rasoi_mobile/docs/PUSH_SETUP.md',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Backend & data',
    purpose: 'PostgreSQL (rasoi schema), Auth OTP, Realtime sync for recipes/sponsors.',
    usedIn: ['rasoi_backend Prisma', 'rasoi_mobile Supabase Auth client', 'meal notifications'],
    account: 'Supabase project (see NEXT_PUBLIC_SUPABASE_URL)',
    envVars: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'DIRECT_URL',
    ],
    status: 'live',
    statusNote: 'Primary database + auth. SMTP Gmail configured in Supabase dashboard.',
    consoleUrl: 'https://supabase.com/dashboard',
    docsPath: 'rasoi_backend/README.md',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Backend & data',
    purpose: 'Hosts API, admin console, marketing site at rasoiapplication.in.',
    usedIn: ['rasoi_backend Next.js', 'Git integration deploy', 'daily keep-alive cron'],
    account: 'Vercel project (rasoi_backend root)',
    envVars: ['NEXT_PUBLIC_SITE_URL', 'CRON_SECRET', 'JWT_SECRET', 'SUPABASE_*'],
    status: 'live',
    statusNote: 'Production: https://rasoiapplication.in',
    consoleUrl: 'https://vercel.com/dashboard',
    docsPath: 'docs/HOSTINGER.md',
  },
  {
    id: 'hostinger',
    name: 'Hostinger DNS',
    category: 'Backend & data',
    purpose: 'Domain rasoiapplication.in → Vercel (DNS CNAME).',
    usedIn: ['Marketing domain', 'APK download links'],
    account: 'Hostinger domain panel',
    envVars: ['DNS only — no app env var'],
    status: 'live',
    statusNote: 'www and apex point to Vercel.',
    consoleUrl: 'https://hpanel.hostinger.com/',
    docsPath: 'docs/HOSTINGER.md',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'Marketing & ops',
    purpose: 'Meal notification cron every 15 min + Instagram campaign schedule.',
    usedIn: ['.github/workflows/meal-notifications.yml', 'instagram-campaign.yml'],
    account: 'GitHub repo: Bhagirihi/Rasoi',
    envVars: ['CRON_SECRET', 'MEAL_NOTIFICATIONS_URL (GitHub secrets)'],
    status: 'configured',
    statusNote: 'Calls /api/cron/meal-notifications on production API.',
    consoleUrl: 'https://github.com/Bhagirihi/Rasoi/actions',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Marketing & ops',
    purpose: 'Organic growth posts and scheduled ad creatives for @rasoi_app.',
    usedIn: ['.cursor/mcp-servers/instagram', 'GitHub cron campaign'],
    account: 'Instagram @rasoi_app',
    envVars: ['INSTAGRAM_USERNAME / PASSWORD (local MCP .env only)'],
    status: 'optional',
    statusNote: 'Credentials in local MCP .env — not in Vercel.',
    consoleUrl: 'https://www.instagram.com/rasoi_app/',
    docsPath: 'docs/marketing/INSTAGRAM_SEO.md',
  },
  {
    id: 'affiliate-partners',
    name: 'Affiliate partners',
    category: 'Mobile monetization',
    purpose: 'Deep links to Blinkit, Zepto, Instamart, Zomato, Swiggy from recipes and pantry.',
    usedIn: ['Partner admin /admin/partners', 'rasoi_mobile affiliate checkout'],
    account: 'Partner affiliate programs (per brand)',
    envVars: ['Managed in admin Partner links — no global API key'],
    status: 'live',
    statusNote: 'URLs editable in admin without app rebuild.',
    consoleUrl: '/admin/partners',
  },
];

export type BackendEnvStatus = {
  supabase: boolean;
  database: boolean;
  jwt: boolean;
  cron: boolean;
  siteUrl: boolean;
  adminEmail: string;
};

export function getBackendEnvStatus(): BackendEnvStatus {
  return {
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    ),
    database: Boolean(process.env.DATABASE_URL?.trim()),
    jwt: Boolean(process.env.JWT_SECRET?.trim()),
    cron: Boolean(process.env.CRON_SECRET?.trim()),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    adminEmail: process.env.ADMIN_EMAIL?.trim() || 'admin@rasoi.app',
  };
}

const STATUS_LABELS: Record<IntegrationStatus, string> = {
  live: 'Live',
  configured: 'Configured',
  test: 'Test mode',
  planned: 'Planned',
  optional: 'Optional',
};

const STATUS_TONE: Record<
  IntegrationStatus,
  'success' | 'gold' | 'warning' | 'neutral'
> = {
  live: 'success',
  configured: 'success',
  test: 'warning',
  planned: 'neutral',
  optional: 'neutral',
};

export function getIntegrationStatusLabel(status: IntegrationStatus): string {
  return STATUS_LABELS[status];
}

export function getIntegrationStatusTone(
  status: IntegrationStatus,
): 'success' | 'gold' | 'warning' | 'neutral' {
  return STATUS_TONE[status];
}

export function groupIntegrationsByCategory(
  entries: IntegrationEntry[],
): Record<string, IntegrationEntry[]> {
  return entries.reduce<Record<string, IntegrationEntry[]>>((acc, entry) => {
    acc[entry.category] ??= [];
    acc[entry.category].push(entry);
    return acc;
  }, {});
}
