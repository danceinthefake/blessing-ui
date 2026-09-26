---
title: Skew
---

<script setup>
import SkewBasic from "../demos/SkewBasic.vue";
</script>

# Skew

<p class="bless-lead">The plate everything else is made of</p>

Button, Badge, Tabs, Pagination, Steps markers, card and section labels — all a `BlessSkew`. Use it directly when you need a label the library doesn't have: a role tag, a category, a date stamp. The outer element leans by `--bless-skew`; the inner span leans back by `--bless-skew-counter`, so the text stays upright. Both are `0deg` at rest: as a `button` or link it leans on hover, focus and press; as a static label it stays upright. Always square: `--bless-radius-plate` is 0. `accent` is for a label that marks something chosen, never one at rest.

`color` fills it; `label` gives it a label's padding and type — together they make a tag. Without `label` it is a bare skew, no padding, no type, just the lean — what Button, Tabs and Pagination build on with their own sizing. `as` picks the element (`h3`, `a`, `button`, a router link).

The slot is inline: text, an icon, a badge. For a skewed _box_ with block content inside, skew a `div` yourself with the two tokens and counter-skew a child.

<Demo title="Basic">
  <SkewBasic />
  <template #code>

<<< ../demos/SkewBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessSkew } from "blessing-ui";
```

## API

<PropsTable name="BlessSkew" />
