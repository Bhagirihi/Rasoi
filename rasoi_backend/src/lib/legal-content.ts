export const LEGAL_CONTACT_EMAIL = 'cooking@rasoiapplication.in';

export const privacySections = [
  {
    title: 'Who we are',
    body:
      'Rasoi ("we", "us") operates the Rasoi Android app and website at rasoiapplication.in. We help Indian home cooks discover recipes, manage a pantry list, and optionally open partner grocery or delivery apps.',
  },
  {
    title: 'Information we collect',
    body:
      'Account: name, email, phone (optional), and diet or cuisine preferences you provide. Usage: saved recipes, pantry items, plan tier, and push notification tokens if you enable reminders. Device: basic app diagnostics and crash reports via Sentry when configured. We do not sell your personal data.',
  },
  {
    title: 'How we use information',
    body:
      'To authenticate you, personalise recipe recommendations, sync your kitchen preferences across devices, send meal reminders you opt into, and improve app reliability. Partner checkout links open third-party apps (Blinkit, Zepto, Instamart, Zomato, Swiggy); those services have their own privacy policies.',
  },
  {
    title: 'Storage and security',
    body:
      'Data is stored on secure cloud infrastructure (Supabase, Vercel). Passwords are not stored by Rasoi for email login — one-time codes are handled by Supabase Auth. Access to production systems is restricted to authorised operators.',
  },
  {
    title: 'Your choices',
    body:
      'You may update preferences in Settings, disable notifications, log out, or request account deletion by emailing us. Guest mode uses a temporary account that is not intended for long-term storage of personal data.',
  },
  {
    title: 'Children',
    body:
      'Rasoi is a general-audience cooking app and is not directed at children under 13. We do not knowingly collect personal information from children.',
  },
  {
    title: 'Changes',
    body:
      'We may update this policy as the app evolves. The "Last updated" date below reflects the latest version. Continued use after changes means you accept the updated policy.',
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
      'Rasoi provides recipe discovery, pantry matching, saved favourites, and optional links to third-party grocery or food-delivery apps. Recipe content is for home cooking guidance only — always follow safe food handling and check allergens for your household.',
  },
  {
    title: 'Accounts',
    body:
      'You are responsible for activity on your account. Keep your email access secure. Guest accounts are temporary. We may suspend accounts that abuse the service or attempt fraud.',
  },
  {
    title: 'Rasoi Plus and partners',
    body:
      'Paid features, trials, and partner checkout may change during early access. Purchases through app stores or payment partners are subject to their billing terms. Rasoi is not responsible for third-party order fulfilment, pricing, or availability.',
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
