/* Single source of truth for site navigation. Used by the hero nav,
   the footer, and the coming-soon pages. */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "how it works", href: "/how-it-works" },
  { label: "use cases", href: "/use-cases" },
  { label: "pricing", href: "/pricing" },
  { label: "docs", href: "/docs" },
];
