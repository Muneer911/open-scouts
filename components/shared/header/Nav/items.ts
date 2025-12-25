export const NAV_ITEMS = [
  {
    labelKey: "common.header.nav.scouts",
    href: "/scouts",
  },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
