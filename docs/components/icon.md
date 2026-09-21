---
title: Icon
---

<script setup>
import IconBasic from "../demos/IconBasic.vue";
</script>

# Icon

<p class="bless-lead">SVG slot wrapper</p>

No icon set is bundled — a set is a dependency and a style, and the library's own controls make do with type (×, ‹ ›, ✓, ▾). `BlessIcon` is the box any SVG goes in: it sizes it, colours it with the surrounding text, and handles the accessibility switch. Paste an SVG, or render a component from a set inside it.

Sets that sit well with thin Roboto: [Lucide](https://lucide.dev) and [Tabler](https://tabler.io/icons) (1.5–2px strokes, no fill). A stroke icon (`fill="none" stroke="currentColor"`) keeps its own attributes; a bare-path icon with no `fill` is filled with the text colour.

Size it to the text beside it — `size="sm"` in a button, `md` in a line of body text, or any CSS length. Decorative icons (next to a label that already says it) get no `label` and are hidden from screen readers; an icon that carries the meaning on its own gets `label`, which makes it `role="img"`.

<Demo title="Basic">
  <IconBasic />
  <template #code>

<<< ../demos/IconBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessIcon } from "blessing-ui";
```

## API

<PropsTable name="BlessIcon" />
