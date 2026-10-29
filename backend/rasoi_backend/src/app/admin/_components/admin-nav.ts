export type AdminNavItem = {
  href: string;
  label: string;
  /** Shown in page list tables / overview quick links */
  shortDescription?: string;
  exact?: boolean;
};

export type AdminNavSection = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    items: [
      {
        href: '/admin',
        label: 'Overview',
        shortDescription: 'Stats, sync, payments, and quick links',
        exact: true,
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      {
        href: '/admin/kitchen-styles',
        label: 'Kitchen styles',
        shortDescription: 'Onboarding cuisine cards',
      },
      {
        href: '/admin/recipes',
        label: 'Recipes',
        shortDescription: 'Recipe library and publishing',
      },
      {
        href: '/admin/announcements',
        label: 'Home announcements',
        shortDescription: 'Modal and banner campaigns',
      },
    ],
  },
  {
    id: 'monetization',
    label: 'Monetization',
    items: [
      {
        href: '/admin/sponsors',
        label: 'Sponsors',
        shortDescription: 'Brand placements in the app',
      },
      {
        href: '/admin/sponsor-analytics',
        label: 'Sponsor analytics',
        shortDescription: 'Impressions, taps, and CSV export',
      },
      {
        href: '/admin/sponsor-applications',
        label: 'Sponsor applications',
        shortDescription: 'Inbound partnership requests',
      },
      {
        href: '/admin/payments',
        label: 'Payments',
        shortDescription: 'Rasoi Plus paywall toggle',
      },
      {
        href: '/admin/promo-codes',
        label: 'Promo codes',
        shortDescription: 'Trial extensions and discounts',
      },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    items: [
      {
        href: '/admin/partners',
        label: 'Partner links',
        shortDescription: 'Checkout links by region (IN, US, CA, AU)',
      },
      {
        href: '/admin/affiliate-events',
        label: 'Partner checkout events',
        shortDescription: 'Grocery and delivery tap log',
      },
    ],
  },
  {
    id: 'members',
    label: 'Members',
    items: [
      {
        href: '/admin/users',
        label: 'Members',
        shortDescription: 'Accounts, plans, and notifications',
      },
      {
        href: '/admin/pantry-defaults',
        label: 'Pantry defaults',
        shortDescription: 'Starter ingredients for new users',
      },
      {
        href: '/admin/feedback',
        label: 'User reports',
        shortDescription: 'Bugs, suggestions, and feedback',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        href: '/admin/integrations',
        label: 'Integrations',
        shortDescription: 'Services, email, OTA rollback',
      },
    ],
  },
];

/** Flat list — keeps older imports working */
export const adminNavItems = adminNavSections.flatMap((section) => section.items);

export type ActiveAdminNav = {
  section: AdminNavSection;
  item: AdminNavItem;
  isNested: boolean;
};

export function findActiveAdminNav(pathname: string): ActiveAdminNav | null {
  for (const section of adminNavSections) {
    for (const item of section.items) {
      const matchesExact = item.exact && pathname === item.href;
      const matchesPrefix =
        !item.exact && (pathname === item.href || pathname.startsWith(`${item.href}/`));

      if (matchesExact || matchesPrefix) {
        return {
          section,
          item,
          isNested: pathname !== item.href,
        };
      }
    }
  }

  return null;
}

export function nestedAdminPageLabel(pathname: string): string {
  if (pathname.endsWith('/new')) return 'New';
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (last && last !== 'admin' && !adminNavItems.some((item) => item.href.endsWith(`/${last}`))) {
    return 'Edit';
  }
  return 'Details';
}

export function getAdminSectionLabel(href: string): string {
  return findActiveAdminNav(href)?.section.label ?? 'Rasoi Console';
}
