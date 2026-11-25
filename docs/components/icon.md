---
title: Icon
---

# Icon

<p class="bless-lead">Built-in drawn icons and SVG slot wrapper</p>

`BlessIcon` ships a built-in set of drawn icons on a 24px grid with a 2px round stroke, sized to the type scale and colored with the surrounding text. Pass `name` for a built-in icon, or put your own SVG in the default slot (for example from [Lucide](https://lucide.dev) or [Tabler](https://tabler.io/icons)).

A stroke icon (`fill="none" stroke="currentColor"`) keeps its own attributes. A bare-path icon with no `fill` fills with the text color.

Size it to the text beside it: `size="sm"` in a button, `md` in a line of body text, or any CSS length. Decorative icons (next to a label that already says it) get no `label` and are hidden from screen readers. An icon that carries meaning on its own gets `label`, which makes it `role="img"`.

<Demo title="Built-in icons and sizes">
  <IconBasic />
  <template #code>

<<< ../demos/IconBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessIcon, blessIcons } from "blessing-ui";
```

## API

<PropsTable name="BlessIcon" />

<script setup>
import IconBasic from "../demos/IconBasic.vue";
</script>
