---
title: Lyrics
---

<script setup>
import LyricsBasic from "../demos/LyricsBasic.vue";
</script>

# Lyrics

<p class="bless-lead">The lines of a song that follow the playback</p>

Shows the words of a song while it plays. For the words of a talk, with speakers, use the [transcript](./transcript).

<Demo title="Basic">
  <LyricsBasic />
  <template #code>

<<< ../demos/LyricsBasic.vue

  </template>
</Demo>

- `lines` is a list of lines. Each line has the `time` it starts, in seconds, and its `text`.
- `position` is the place of the song now, in seconds. Give it from the time of your player.
- The line that plays is bigger and full strength, and it has a bar in the accent color and `aria-current`.
- The box scrolls by itself to keep that line in the middle. Only the box scrolls, not the page. Under reduced motion, it jumps without a slide.
- Each line is a button that emits `seek` with its time.
- The box is a region that the keyboard can reach and scroll.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and `seek` (a function).

## Usage

```ts
import { BlessLyrics } from "blessing-ui";
```

## API

<PropsTable name="BlessLyrics" />
