# Install

```sh
pnpm add blessing-ui
```

```ts
import { BlessButton } from "blessing-ui";
```

That's it. Every component is a named ESM export with its own stylesheet attached, so a bundler pulls in only what you import — a button alone is about 1 KB of JS and 2 KB of CSS gzipped. The package entry imports `tokens.css`, so the `--bless-*` custom properties exist as soon as anything from the library does. (Bundlers honour the package's `sideEffects` field; all current ones do.)

If you'd rather load all styles up front — no bundler, or a CDN — import the full sheet once:

```ts
import "blessing-ui/style.css"; // tokens + every component's styles, ~26 KB gzipped
```

```vue
<script setup lang="ts">
import { BlessButton, BlessSection } from "blessing-ui";
</script>

<template>
  <BlessSection title="News">
    <BlessButton color="accent">More</BlessButton>
  </BlessSection>
</template>
```

## Tokens only

If you only want the design tokens (no components):

```css
@import "blessing-ui/tokens.css";
.btn {
  background: var(--bless-color-accent);
}
```

## Requirements

- Vue `^3.5`.
- `@tiptap/vue-3` `^3` is an **optional** peer — only `BlessEditor` uses it. Install it if you use the editor; ignore the peer warning otherwise.
- Evergreen browsers. Hard requirements: the Popover API, `<dialog>`, `color-mix()`, CSS nesting. No polyfills are shipped.
- Progressive, degrade quietly where missing: `field-sizing` (Textarea `autogrow` stays fixed-height), `appearance: base-select` (`BlessSelect` styles its dropdown on Chrome 135+; elsewhere the native picker shows, unstyled).
- Fonts are not bundled — see [Fonts](./fonts).

## With a router

Every component that renders a link — `BlessSidebarNav`, `BlessButton href`, cards, list items, breadcrumbs, pagination, menus, tabs, the tree — renders a plain `<a>` by default. Provide your router's link component once and they use it for in-app paths, so you get client-side navigation, active state and (Nuxt) prefetching without wiring `@select` everywhere:

```ts
// Vue Router
import { RouterLink } from "vue-router";
import { blessLinkKey } from "blessing-ui";
app.provide(blessLinkKey, RouterLink);
```

```ts
// Nuxt — plugins/blessing.ts
import { blessLinkKey } from "blessing-ui";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(blessLinkKey, resolveComponent("NuxtLink"));
});
```

Rule: an `href` that starts with `/` or is a bare relative path goes to the router as `to`; anything with a scheme (`https:`, `mailto:`), protocol-relative `//`, a `#hash`, or `external: true` stays a native `<a>`. Nothing from any router is imported by the library.

## Next

[Dark mode](./dark-mode) follows the OS out of the box; [Palettes](./palettes) picks which accent the whole library wears.
