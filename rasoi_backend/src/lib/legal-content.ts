export const LEGAL_CONTACT_EMAIL = 'cooking@rasoiapplication.in';
export const GRIEVANCE_OFFICER_EMAIL = 'cooking@rasoiapplication.in';
export const GRIEVANCE_OFFICER_NAME = 'Rasoi Privacy Grievance Officer';

export const privacySections = [
  {
    title: 'Who we are',
    body:
      'Rasoi ("we", "us") operates the Rasoi Android app and website at rasoiapplication.in. We help Indian home cooks discover recipes, manage a pantry list, and optionally open partner grocery or delivery apps.',
  },
  {
    title: 'Information we collect',
    body:
      'Account: name, email, optional phone, diet or cuisine preferences, and saved recipes or pantry items. Usage: plan tier, in-app searches, partner checkout taps, and push notification tokens if you enable reminders. Device & diagnostics: Firebase Analytics and Crashlytics, Sentry error reports (and optional session replay when enabled), AdMob advertising identifiers on free/trial plans, and approximate location (city/coordinates) if you grant permission. Purchase history is processed by Google Play and RevenueCat for Rasoi Plus subscriptions. We do not sell your personal data.',
  },
  {
    title: 'How we use information',
    body:
      'To authenticate you, personalise recipe recommendations, sync your kitchen preferences across devices, send meal reminders you opt into, measure app reliability, show relevant ads on free/trial plans, and understand partner checkout usage. Partner links open third-party apps (Blinkit, Zepto, Instamart, Zomato, Swiggy); those services have their own privacy policies. Rasoi may earn a fee when you shop via affiliate partner links where a program applies.',
  },
  {
    title: 'Storage, transfers, and security',
    body:
      'Data is stored on secure cloud infrastructure (Supabase PostgreSQL, Vercel). Some processors (Supabase, Vercel, Sentry, Google/Firebase, RevenueCat) may process data outside India under contractual safeguards. Email login uses one-time codes via Supabase Auth — Rasoi does not store your password. Access to production systems is restricted to authorised operators.',
  },
  {
    title: 'Your choices',
    body:
      'You may update preferences in Settings, disable notifications, log out, export your data, or delete your account in Settings (registered users confirm email). You may also email us for privacy requests. Guest mode is for temporary browsing; create an account to sync data across devices.',
  },
  {
    title: 'Retention',
    body:
      'We keep account data while your account is active. Affiliate, sponsor, and search analytics events may be retained up to 12 months for product improvement, then aggregated or deleted. When you delete your account, we remove your profile and linked tokens; anonymised analytics may remain.',
  },
  {
    title: 'Children',
    body:
      'Rasoi is a general-audience cooking app and is not directed at children under 18 without verifiable parental consent. We do not knowingly collect personal information from children under 18. If you believe a child provided data, contact us to delete it.',
  },
  {
    title: 'Grievance officer (India DPDP)',
    body: `For privacy complaints or grievances under applicable Indian law, contact our Grievance Officer: ${GRIEVANCE_OFFICER_NAME}, ${GRIEVANCE_OFFICER_EMAIL}. We aim to acknowledge requests within 72 hours and resolve them within 30 days where required.`,
  },
  {
    title: 'Changes',
    body:
      'We may update this policy as the app evolves. The "Last updated" date below reflects the latest version. Material changes may require renewed consent in the app.',
  },
  {
    title: 'Contact',
    body: `Questions about privacy: ${LEGAL_CONTACT_EMAIL}`,
  },
] as const;

export const termsSections = [
  {
    title: 'Acceptance',
    body:
      'By downloading or using Rasoi you agree to these Terms. If you do not agree, do not use the app.',
  },
  {
    title: 'The service',
    body:
      'Rasoi provides recipe discovery, pantry matching, saved favourites, and optional links to third-party grocery or food-delivery apps. Recipe content is for home cooking guidance only — always follow safe food handling and check allergens for your household. Calorie counts and diet filters are approximate and not medical advice.',
  },
  {
    title: 'Accounts',
    body:
      'You are responsible for activity on your account. Keep your email access secure. Guest accounts are temporary. We may suspend accounts that abuse the service or attempt fraud.',
  },
  {
    title: 'Rasoi Plus and partners',
    body:
      'Paid features, trials, and partner checkout may change. Purchases through Google Play are subject to Google billing terms; tax may be collected by Google where applicable. Rasoi is not responsible for third-party order fulfilment, pricing, delivery times, or availability. Affiliate partner links may earn Rasoi a commission — this is disclosed in the app.',
  },
  {
    title: 'Intellectual property',
    body:
      'Rasoi branding, app design, and curated content are owned by Rasoi or its licensors. Do not copy, scrape, or redistribute app content without permission.',
  },
  {
    title: 'Disclaimer',
    body:
      'Recipes and nutritional information are provided "as is" without warranty. Rasoi is not liable for cooking outcomes, allergic reactions, or reliance on partner links. Use your judgment in the kitchen.',
  },
  {
    title: 'Limitation of liability',
    body:
      'To the maximum extent permitted by law, Rasoi is not liable for indirect or consequential damages arising from use of the app.',
  },
  {
    title: 'Governing law',
    body:
      'These Terms are governed by the laws of India. Disputes shall be subject to the courts of Ahmedabad, Gujarat, unless mandatory consumer protection law requires otherwise.',
  },
  {
    title: 'Contact',
    body: `Support and legal enquiries: ${LEGAL_CONTACT_EMAIL}`,
  },
] as const;
