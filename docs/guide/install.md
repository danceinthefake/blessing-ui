# Install

```sh
pnpm add blessing-ui vue
```

```ts
import { BlessButton } from "blessing-ui";
```

That's it — each component brings its own stylesheet, and the tokens come with the first import. Everything is a named ESM export and tree-shakes per component. If you'd rather load all styles up front (no bundler, or a CDN), import the full sheet once:

```ts
import "blessing-ui/style.css"; // tokens + every component's styles
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

- Vue ^3.5
- Evergreen browsers: the library leans on the Popover API, `<dialog>`, `field-sizing`, `color-mix()`, CSS nesting. No polyfills are shipped.
- Fonts are not bundled — see [Fonts](./fonts).
- `BlessSelect` styles the dropdown itself only where `appearance: base-select` exists (Chrome 135+); elsewhere the native picker shows, unstyled.

## Next

[Dark mode](./dark-mode) follows the OS out of the box; [Palettes](./palettes) picks which accent the whole library wears.
