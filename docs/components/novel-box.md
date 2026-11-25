---
title: NovelBox
---

# NovelBox

<p class="bless-lead">Visual-novel text box with speaker plate and typed line</p>

`BlessNovelBox` is the voice of an app: a frosted translucent sheet with a subtle accent rim, a leaning −10° speaker nameplate, and an editorial serif line (`--bless-font-serif`) that types out letter by letter. Screen readers receive the full line immediately through hidden screen-reader text. Under calm motion (`data-motion="calm"`) or `prefers-reduced-motion: reduce`, the whole line appears at once and the continue cursor stays still.

Pass `avatar` for a circular speaker portrait, `emblem` to show the neutral 5-petal Blessing flower medallion, or use the `#portrait` slot for custom art. Pass `interactive` when the visitor can advance through a sequence of lines: pressing the continue button while a line is typing finishes it immediately, and pressing it again emits `next`. Omit `text` to render static or formatted markup in the default slot.

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
