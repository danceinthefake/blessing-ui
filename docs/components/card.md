---
title: Card
---

<script setup>
import CardBasic from "../demos/CardBasic.vue";
</script>

# Card

<p class="bless-lead">Flat surface</p>

One item in a set of similar items — an episode, a product, a person — laid out as a box with an optional label, media and footer. For a single block of content use a [Panel](./panel) or a [Section](./section).

<Demo title="Basic">
  <CardBasic />
  <template #code>

<<< ../demos/CardBasic.vue

  </template>
</Demo>

- `href` makes the whole card one link, and everything in it becomes the link's name. So keep it short, and don't put buttons or other links inside a linked card; they can't be reached properly inside another link. If the card needs actions, leave `href` off and link the title instead.
- `label` is the skewed tag on top (`labelColor` to colour it); `surface` and `bordered` set the box.

## Usage

```ts
import { BlessCard } from "blessing-ui";
```

## API

<PropsTable name="BlessCard" />
