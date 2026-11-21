---
title: Transcript
---

# Transcript

<p class="bless-lead">Lines of text that follow the time of the media</p>

Shows the words of an episode or a video, line by line. The current line follows the time of the media, and a click on the time of a line plays from there. For the chapters of an episode, use the [chapter list](./chapter-list).

<Demo title="Basic">
  <TranscriptBasic />
  <template #code>

<<< ../demos/TranscriptBasic.vue

  </template>
</Demo>

- `cues` is a list of lines. Each line has a `start` in seconds, the `text`, an optional `speaker`, and an optional `end`. With no `end`, a line lasts until the next line starts.
- `time` is the time of the media now, in seconds. Set it from the `timeupdate` event of an `audio` or `video` element.
- A click on the time of a line emits `seek` with its start. Set the `currentTime` of your media to it.
- The current line has a bar, a background, and bold words. Earlier lines are gray. If the speaker changes, the name of the new speaker shows.
- With `follow` (on by default), the box scrolls to keep the current line in the middle. Only the box scrolls, never the page. Set the height of the box with the `--bless-transcript-height` CSS variable (default `20rem`).
- The box is a region that the keyboard can scroll. The current line has `aria-current="time"`. Change the words with `labels` or a [label pack](../guide/translating): `title`, and `seek` (a function of the time).

## Usage

```ts
import { BlessTranscript } from "blessing-ui";
```

## API

<PropsTable name="BlessTranscript" />

<script setup>
import TranscriptBasic from "../demos/TranscriptBasic.vue";
</script>
