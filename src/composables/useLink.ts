import { inject, type Component, type InjectionKey } from "vue";

/**
 * Provide your router's link component once and every anchor-rendering component
 * (SidebarNav, Button, Card, ListItem, Breadcrumb, Pagination, menus, tabs, tree) renders it
 * for in-app paths — `app.provide(blessLinkKey, RouterLink)` (Nuxt: `resolveComponent("NuxtLink")`).
 * Nothing is imported from any router; without a provider everything stays a plain <a>.
 */
export const blessLinkKey: InjectionKey<Component> = Symbol("bless-link");

/** true for a same-app path the router should handle: starts with "/" or is a bare relative path */
export const isRouterHref = (href: string) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);

export type BlessLinkTag = { is: string | Component; attrs: Record<string, unknown> };

/** resolves what to render for an href: the provided link component with `to`, or <a href> */
export function useLink() {
  const Link = inject(blessLinkKey, null);
  return (href: string | undefined, external?: boolean, fallback: string = "a"): BlessLinkTag => {
    if (!href) return { is: fallback, attrs: {} };
    if (Link && !external && isRouterHref(href)) return { is: Link, attrs: { to: href } };
    return {
      is: "a",
      attrs: {
        href,
        target: external ? "_blank" : undefined,
        rel: external ? "noopener" : undefined,
      },
    };
  };
}
