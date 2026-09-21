---
title: BlockUI
---

<script setup>
import BlockUIBasic from "../demos/BlockUIBasic.vue";
</script>

# BlockUI

<p class="bless-lead">Overlay that blocks its content</p>

For an area that is mid-operation and must stay visible but untouchable — a report re-running, a form saving, a table refreshing. The content is made `inert` (unreachable by mouse, keyboard and screen reader) under a 60% scrim with a spinner; focus parks on the overlay and returns to where it was when `blocked` goes false. Content that isn't there _yet_ is [Skeleton](./skeleton)'s job; a page-level, non-blocking signal is [LoadingBar](./loading-bar).

`#indicator` replaces the spinner (a message, a progress bar). `fullscreen` fixes the overlay over the whole viewport — the page, not an open `<dialog>`, which lives in the top layer above it; to block a dialog, put the `BlessBlockUI` inside it.

<Demo title="Basic">
  <BlockUIBasic />
  <template #code>

<<< ../demos/BlockUIBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessBlockUI } from "blessing-ui";
```

## API

<PropsTable name="BlessBlockUI" />
