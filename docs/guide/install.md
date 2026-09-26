# Install

::: code-group

```sh [pnpm]
pnpm add blessing-ui
```

```sh [npm]
npm install blessing-ui
```

```sh [yarn]
yarn add blessing-ui
```

```sh [bun]
bun add blessing-ui
```

:::

```vue
<script setup lang="ts">
import { BlessButton, BlessSection } from "blessing-ui";
</script>

<template>
  <BlessSection title="News">
    <BlessButton>More</BlessButton>
  </BlessSection>
</template>
```

That's it. Every component is a named ESM export with its own stylesheet attached, so a bundler pulls in only what you import — a button alone is about 1.5 KB of JS and 1 KB of CSS gzipped, plus 4 KB of tokens once. The package entry imports `tokens.css`, so the `--bless-*` custom properties exist as soon as anything from the library does. (Bundlers honour the package's `sideEffects` field; all current ones do.)

If you'd rather load all styles up front — no bundler, or a CDN — import the full sheet once:

```ts
import "blessing-ui/style.css"; // tokens + every component's styles, ~26 KB gzipped
```

## Tokens only

If you only want the design tokens (no components), follow the same [design language](../design/): ink at rest, the lean on attention, the accent only on what is chosen.

```css
@import "blessing-ui/tokens.css";
.tab {
  color: var(--bless-color-text);
  transform: skewX(var(--bless-skew));
}
.tab:hover,
.tab:focus-visible {
  --bless-skew: var(--bless-lean);
}
.tab[aria-selected="true"] {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
```

## Requirements

- Vue `^3.5`.
- `@tiptap/vue-3` `^3` is an **optional** peer — only `BlessEditor` uses it. Install it if you use the editor; ignore the peer warning otherwise.
- Evergreen browsers. Hard requirements: the Popover API, `<dialog>`, `color-mix()`, CSS nesting. No polyfills are shipped.
- Progressive, degrade quietly where missing: `field-sizing` (Textarea `autogrow` stays fixed-height), `appearance: base-select` (`BlessSelect` styles its dropdown on Chrome 135+; elsewhere the native picker shows, unstyled), `@property` (the lean snaps instead of animating), `:has()` (a checkbox or switch label doesn't lean while its input has focus).
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

[Dark mode](./dark-mode) follows the OS out of the box; [Palettes](./palettes) picks which accent the whole library wears. The [Design language](../design/) explains why it looks and behaves the way it does.
