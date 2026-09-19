import type { BlessNavItem } from "blessing-ui";

export const navItems: BlessNavItem[] = [
  { label: "Home", href: "#home" },
  { label: "News", href: "#news", meta: "04.04", badge: true },
  { label: "On Air", href: "#onair" },
  { label: "Story", href: "#story" },
  { label: "Character", href: "#character" },
  { label: "Staff & Cast", href: "#staff" },
  { label: "Music", href: "#music" },
  { label: "Blu-ray & DVD", href: "#bd", badge: "BOX" },
  { label: "Shop", href: "https://example.com", external: true },
];
