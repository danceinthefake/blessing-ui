---
title: Episode list
---

<script setup>
import EpisodeListBasic from "../demos/EpisodeListBasic.vue";
</script>

# Episode list

<p class="bless-lead">The episodes of a season with the length, a summary, and the progress</p>

Lists the episodes of a show or a podcast, on its page. For one row of shows, use the [poster row](./poster-row).

<Demo title="Basic">
  <EpisodeListBasic />
  <template #code>

<<< ../demos/EpisodeListBasic.vue

  </template>
</Demo>

- `episodes` is a list of episodes. Each episode has an `id`, a `number`, a `title`, and the length in `minutes`. It can also have a `summary`, an `image`, and the `progress` from 0 to 1.
- The progress shows as a bar on the picture and in words: "28 min left", or "Watched" near the end.
- The picture is the play button. Its name says which episode it plays, such as "Play episode 2: Pick a microphone". A click emits `play` with the id.
- `current` is the id of the episode that plays now. It has a bar in the accent color, the words "Playing now", and `aria-current`.
- The summary shows two lines at most.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `watched`, `playing`, and the functions `play`, `length`, and `left`.

## Usage

```ts
import { BlessEpisodeList } from "blessing-ui";
```

## API

<PropsTable name="BlessEpisodeList" />
