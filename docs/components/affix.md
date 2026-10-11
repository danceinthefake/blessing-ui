---
title: Affix
---

<script setup>
import AffixBasic from "../demos/AffixBasic.vue";
</script>

# Affix

<p class="bless-lead">Sticky wrapper with an offset</p>

A wrapper that sticks to the top edge of the window when the page scrolls past it. Use it for a table header, a toolbar, or a section nav. It is plain CSS `position: sticky`, with one observer that reports when it is stuck.

<Demo title="Basic">
  <AffixBasic />
  <template #code>

<<< ../demos/AffixBasic.vue

  </template>
</Demo>

- `offset` is the gap in px from the top edge, for example below a fixed header. It sets `top` and the observer margin.
- The default slot gets `stuck`. Use it to add a plate when the box leaves its resting place. `v-model:stuck` reads the same state.
- Attributes go to the sticky box, not to the probe that the component renders before it.
- Sticky positioning works only inside a parent that is taller than the box. A parent with `overflow: hidden` breaks it.
- `stuck` follows the window scroll. Inside a scroll container, sticky still works but `stuck` can be wrong.

## Usage

```ts
import { BlessAffix } from "blessing-ui";
```

## API

<PropsTable name="BlessAffix" />
