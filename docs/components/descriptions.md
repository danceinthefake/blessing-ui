---
title: Descriptions
---

# Descriptions

<p class="bless-lead">Label and value pairs for a detail page</p>

A list of facts about one thing, such as an order, a user, or an episode. Each fact is a label and a value. Use it on a detail page or in a side panel. For many rows of the same kind, use a [table](./table). For one number with a trend, use a [stat](./stat).

<Demo title="Basic">
  <DescriptionsBasic />
  <template #code>

<<< ../demos/DescriptionsBasic.vue

  </template>
</Demo>

- `items` is a list of `{ label, value }`. An item with no `value` shows a dash.
- The `value` slot gets `{ item, index }`, for a badge, a link, or anything else.
- `columns` sets the most columns. A column is never narrower than 12rem, so on a phone the pairs stack in one column. Set `--bless-descriptions-min` to change that width.
- `bordered` puts the pairs in one plate, with lines between them (see [fuse when grouped](../design/)).
- It renders a native `<dl>`, so screen readers announce a description list and pair each label with its value.

## Usage

```ts
import { BlessDescriptions } from "blessing-ui";
```

## API

<PropsTable name="BlessDescriptions" />

<script setup>
import DescriptionsBasic from "../demos/DescriptionsBasic.vue";
</script>
