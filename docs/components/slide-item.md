---
title: SlideItem
---

<script setup>
import SlideItemBasic from "../demos/SlideItemBasic.vue";
</script>

# SlideItem

<p class="bless-lead">Swipe a row to reveal actions</p>

A list row that slides aside to show actions — archive, delete — as in phone mail apps. The same actions must be reachable without a swipe, which the keyboard does: tabbing into them slides them into view.

<Demo title="Basic">
  <SlideItemBasic />
  <template #code>

<<< ../demos/SlideItemBasic.vue

  </template>
</Demo>

- A swipe right reveals `#left`, a swipe left reveals `#right`. Without `sticky`, passing `threshold` fires `@left` / `@right` with a `reset`; with `sticky` the actions stay open until reset.

## Usage

```ts
import { BlessSlideItem } from "blessing-ui";
```

## API

<PropsTable name="BlessSlideItem" />
