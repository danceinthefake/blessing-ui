---
title: Toc
---

<script setup>
import TocBasic from "../demos/TocBasic.vue";
</script>

# Toc

<p class="bless-lead">Table of contents with current heading</p>

A list of the headings on a page, with the current one marked. Use it beside a long article or a docs page. A short page does not need one.

<Demo title="Basic">
  <TocBasic />
  <template #code>

<<< ../demos/TocBasic.vue

  </template>
</Demo>

- Give `items` as `{ id, label, level? }`. Or leave `items` out, and the component collects the headings that match `selector` (default `h2, h3`) after mount. A heading without an `id` is skipped.
- `level` indents an item. In automatic mode an `h3` has level 1.
- The current heading gets `aria-current="location"`. The component uses [`useScrollSpy`](../guide/scroll-spy), so `rootMargin` works the same way.
- The observer reads its targets one time. If your headings change, remount the component with a `key`.
- `label` names the navigation landmark. It is "On this page" by default.

## Usage

```ts
import { BlessToc } from "blessing-ui";
```

## API

<PropsTable name="BlessToc" />
