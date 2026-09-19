# Install

```sh
pnpm add blessing-ui vue
```

```ts
// main.ts
import "blessing-ui/style.css"; // tokens + every component's styles
```

Then import components where you use them. Everything is a named ESM export and tree-shakes per component.

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
