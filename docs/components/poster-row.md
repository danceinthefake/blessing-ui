---
title: Poster row
---

# Poster row

<p class="bless-lead">A row of posters that scrolls, with arrow buttons and the keyboard</p>

Shows a shelf of shows, films, or albums on a streaming home page. Stack many rows for many shelves.

<Demo title="Basic">
  <PosterRowBasic />
  <template #code>

<<< ../demos/PosterRowBasic.vue

  </template>
</Demo>

- `title` names the row. The row is a section named by that title.
- `items` is a list of posters. Each poster has an `id`, a `title`, an `image`, and an `href`. It can also have a `meta` line.
- `shape` is `tall` (default, 2 by 3), `wide` (16 by 9), or `square`.
- The row scrolls sideways and snaps to each poster. The ‹ and › buttons scroll by one width. Each button turns off at its end of the row.
- Each poster is one link, so Tab moves from poster to poster, and the row scrolls with the focus.
- Outside reduced motion, the scroll is smooth and a poster grows a little on hover.
- Change the words with `labels` or a [label pack](../guide/translating): `previous` and `next`.

## Usage

```ts
import { BlessPosterRow } from "blessing-ui";
```

## API

<PropsTable name="BlessPosterRow" />

<script setup>
import PosterRowBasic from "../demos/PosterRowBasic.vue";
</script>
