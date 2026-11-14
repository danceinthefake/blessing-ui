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

That is all. Every component is a named ESM export with its own stylesheet attached, so a bundler pulls in only what you import. A button alone is about 1 KB of JS and 1 KB of CSS gzipped, plus about 2 KB of tokens once. [Bundle size](./sizes) shows the cost of each component. The package entry imports `tokens.css`, so the `--bless-*` custom properties exist as soon as you import anything from the library. Bundlers honor the `sideEffects` field of the package. All current bundlers do.

To load all styles up front, for example with no bundler or with a CDN, import the full sheet once:

```ts
import "blessing-ui/style.css"; // tokens + every component's styles, ~37 KB gzipped
```

## Auto-import

You can write `<BlessButton>` in a template with no `import` line. Each component then comes from its own file, with only its own styles, and the tokens load once.

In Nuxt, add the module. It needs nothing else, and it also makes in-app links use `NuxtLink`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["blessing-ui/nuxt"],
});
```

In Vite, use [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) with the resolver of the library:

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { BlessingUiResolver } from "blessing-ui/resolver";

export default defineConfig({
  plugins: [vue(), Components({ resolvers: [BlessingUiResolver()] })],
});
```

The resolver and the module know only the names of components. Import functions, keys, and types, such as `provideLabels` and `blessLinkKey`, from `blessing-ui` as before.

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
- `@nuxt/kit` `^3.15` or `^4` is an **optional** peer. Only `blessing-ui/nuxt` uses it, and every Nuxt app already has it.
- `marked` `^18` is an **optional** peer. Only `BlessMarkdown` uses it, and you pass its `lexer` to the component, so the library never loads it. If you do not use Markdown, ignore the peer warning.
- `@tiptap/vue-3` `^3` is an **optional** peer. Only `BlessEditor` uses it. If you use the editor, install it. Otherwise, ignore the peer warning.
- Evergreen browsers. Hard requirements: the Popover API, `<dialog>`, `color-mix()`, CSS nesting. No polyfills are shipped.
- Progressive features degrade quietly where the browser does not support them:
  - `field-sizing`: the Textarea `autogrow` stays fixed-height.
  - `appearance: base-select`: `BlessSelect` styles its dropdown on Chrome 135 and later. Other browsers show the native picker, unstyled.
  - `@property`: the lean snaps instead of animating.
  - `:has()`: a checkbox or switch label does not lean while its input has focus.
- Fonts are not bundled. See [Fonts](./fonts).

## With a router

All components that render a link render a plain `<a>` by default. These components include `BlessSidebarNav`, `BlessButton href`, cards, list items, breadcrumbs, pagination, menus, tabs, and the tree. Provide the link component of your router once, and they use it for in-app paths. You then get client-side navigation, active state, and (in Nuxt) prefetching without wiring `@select` everywhere:

```ts
// Vue Router
import { RouterLink } from "vue-router";
import { blessLinkKey } from "blessing-ui";
app.provide(blessLinkKey, RouterLink);
```

In Nuxt, the `blessing-ui/nuxt` module provides `NuxtLink` for you. Without the module, add a plugin:

```ts
// plugins/blessing.ts
import { blessLinkKey } from "blessing-ui";
import { NuxtLink } from "#components";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(blessLinkKey, NuxtLink);
});
```

To use another link component in Nuxt, provide it in a plugin of your own. Your plugin runs after the module, so your component wins.

Rule: an `href` that starts with `/` or is a bare relative path goes to the router as `to`. Anything else stays a native `<a>`: a scheme (`https:`, `mailto:`), a protocol-relative `//`, a `#hash`, or `external: true`. The library imports nothing from any router.

## Next

[Dark mode](./dark-mode) follows the OS out of the box. [Palettes](./palettes) selects the accent that the whole library wears. The [Design language](../design/) explains why the library looks and behaves this way.
