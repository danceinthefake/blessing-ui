---
title: NovelBox
---

# NovelBox

<p class="bless-lead">Visual-novel text box with speaker plate and typed line</p>

`BlessNovelBox` is the voice of an app: a warm sheet with a leaning name plate and a line that types out letter by letter. Screen readers receive the full line immediately through hidden screen-reader text. Under calm motion (`data-motion="calm"`) or `prefers-reduced-motion: reduce`, the whole line appears at once.

Pass `interactive` when the visitor can advance through a sequence of lines: pressing the continue button while a line is typing finishes it immediately, and pressing it again emits `next`. Omit `text` to render static or formatted markup in the default slot.

<Demo title="Interactive lines">
  <NovelBoxBasic />
  <template #code>

<<< ../demos/NovelBoxBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessNovelBox } from "blessing-ui";
```

## API

<PropsTable name="BlessNovelBox" />

<script setup>
import NovelBoxBasic from "../demos/NovelBoxBasic.vue";
</script>
