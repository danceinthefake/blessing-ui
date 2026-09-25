---
title: Rating
---

<script setup>
import RatingBasic from "../demos/RatingBasic.vue";
</script>

# Rating

<p class="bless-lead">Star rating on native radios</p>

A score out of a few — for someone to give one, or to show one. Stars are a coarse signal; for anything that needs a reason, pair them with a comment field.
<Demo title="Basic">
<RatingBasic />
<template #code>

<<< ../demos/RatingBasic.vue

  </template>
</Demo>

- Native radios: arrow keys choose; clicking the chosen star again clears it.
- `readonly` shows a score as one image named "Rating: 4 of 5". It is not a disabled control, so it isn't read as dimmed.
- `name` submits the value with a form; `label` names the group; `icon` changes the glyph.

## Usage

```ts
import { BlessRating } from "blessing-ui";
```

## API

<PropsTable name="BlessRating" />
