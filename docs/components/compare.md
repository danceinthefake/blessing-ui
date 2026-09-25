---
title: Compare
---

<script setup>
import CompareBasic from "../demos/CompareBasic.vue";
</script>

# Compare

<p class="bless-lead">Before / after slider</p>

Two images of the same frame — a retouch, a restoration, a colour grade — with a divider to drag between them. For two things side by side that aren't the same frame, lay them out next to each other instead.

<Demo title="Basic">
  <CompareBasic />
  <template #code>

<<< ../demos/CompareBasic.vue

  </template>
</Demo>

- It is a native range on top: drag anywhere, or focus it and use the arrow keys. The value is how much of `#after` shows, read out as "60% after".
- `orientation="vertical"` splits top and bottom. In right-to-left pages the reveal starts from the right, with the range.
- Give both images the same size and real `alt` text; `label` names the control.

## Usage

```ts
import { BlessCompare } from "blessing-ui";
```

## API

<PropsTable name="BlessCompare" />
