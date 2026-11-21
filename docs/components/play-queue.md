---
title: Play queue
---

# Play queue

<p class="bless-lead">The next tracks in order, which you can change and clear</p>

Shows what plays next in a music or podcast app. The order changes with the [sortable](./sortable) list, by drag or with the keyboard.

<Demo title="Basic">
  <PlayQueueBasic />
  <template #code>

<<< ../demos/PlayQueueBasic.vue

  </template>
</Demo>

- `current` is the track that plays now. It shows on top under "Now playing".
- `v-model` is the queue: the tracks after the current one, in order. Each track has an `id`, a `title`, and the length in `seconds`. It can also have an `artist` and an `image`.
- Each row has a grip to move it. Drag the grip, or focus it and use the keys of the sortable list. Screen readers hear each move.
- The picture of a track is a button that emits `play` with the id. The ✕ button removes the track. Both buttons have the title of the track in their name.
- The head of the queue shows the number of tracks and their total time. "Clear the queue" empties it.
- Change the words with `labels` or a [label pack](../guide/translating): `now`, `next`, `empty`, `clear`, and the functions `play`, `remove`, and `total`.

## Usage

```ts
import { BlessPlayQueue } from "blessing-ui";
```

## API

<PropsTable name="BlessPlayQueue" />

<script setup>
import PlayQueueBasic from "../demos/PlayQueueBasic.vue";
</script>
