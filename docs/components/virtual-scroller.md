---
title: VirtualScroller
---

<script setup>
import VirtualScrollerBasic from "../demos/VirtualScrollerBasic.vue";
import VirtualScrollerDynamic from "../demos/VirtualScrollerDynamic.vue";
</script>

# VirtualScroller

<p class="bless-lead">Windowed list for long data</p>

A list too long to render at once — thousands of log lines, a big contact list. It renders only what's in view. Under a few hundred rows, a plain list is simpler and works with find-in-page.

<Demo title="Basic">
  <VirtualScrollerBasic />
  <template #code>

<<< ../demos/VirtualScrollerBasic.vue

  </template>
</Demo>

<Demo title="Dynamic heights">
  <VirtualScrollerDynamic />
  <template #code>

<<< ../demos/VirtualScrollerDynamic.vue

  </template>
</Demo>

- Each row tells screen readers the real length and its position ("12 of 10,000"), though only a window is in the page.
- `itemHeight` is exact; with `dynamic` it's an estimate and each row is measured. `scrollTo(index)` jumps to a row.
- Find-in-page can't see rows that aren't rendered; give long lists a search of their own.

## Usage

```ts
import { BlessVirtualScroller } from "blessing-ui";
```

## API

<PropsTable name="BlessVirtualScroller" />
