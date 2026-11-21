---
title: Reading progress
---

# Reading progress

<p class="bless-lead">A thin bar that fills as the reader scrolls an article</p>

Shows how much of a long article is behind the reader, and how many minutes are left. Put it once on the page of an article. For the progress of a task, use the [progress bar](./progress).

<Demo title="Basic">
  <ReadingProgressBasic />
  <template #code>

<<< ../demos/ReadingProgressBasic.vue

  </template>
</Demo>

- With no `target`, the bar follows the scroll of the whole page, at the top of the window.
- Set `target` to the article, as an element or a CSS selector, to follow only that part of the page. If the target scrolls by itself, as in the example, the bar follows the scroll of the target.
- `position` is `fixed` (default) at the top of the window, or `sticky` at the top of the box that holds the bar.
- `minutes` shows the minutes left under the end of the bar. The count uses the words in the target and `wpm`, the words that a reader reads in a minute (default 230).
- At the end of the article, the bar emits `finish` once.
- Set the height of the bar with the `--bless-reading-height` CSS variable (default `3px`). The bar is a progress bar for screen readers. Change the words with `labels` or a [label pack](../guide/translating): `label`, and `left` (a function of the minutes).

## Usage

```ts
import { BlessReadingProgress } from "blessing-ui";
```

## API

<PropsTable name="BlessReadingProgress" />

<script setup>
import ReadingProgressBasic from "../demos/ReadingProgressBasic.vue";
</script>
