---
title: Continue watching
---

# Continue watching

<p class="bless-lead">Items with the place where you stopped, and a remove button</p>

Puts the shows and episodes that the viewer did not finish at the top of a home page. For a row of new shows, use the [poster row](./poster-row).

<Demo title="Basic">
  <ContinueWatchingBasic />
  <template #code>

<<< ../demos/ContinueWatchingBasic.vue

  </template>
</Demo>

- `items` is a list. Each item has an `id`, a `title`, an `image`, an `href`, and the `progress` from 0 to 1. It can also have a `subtitle` and the length in `minutes`.
- The place where the viewer stopped shows as a bar on the picture and in words. With `minutes`, the words give the time left, such as "29 min left". Without it, they give the percent done.
- Each card is one link. The ✕ button emits `remove` with the id. Its name has the title, so each button is clear on its own.
- The row scrolls sideways. If the list is empty, nothing shows.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and the functions `left`, `done`, and `remove`.

## Usage

```ts
import { BlessContinueWatching } from "blessing-ui";
```

## API

<PropsTable name="BlessContinueWatching" />

<script setup>
import ContinueWatchingBasic from "../demos/ContinueWatchingBasic.vue";
</script>
