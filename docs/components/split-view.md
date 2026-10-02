---
title: SplitView
---

<script setup>
import SplitViewBasic from "../demos/SplitViewBasic.vue";
</script>

# SplitView

<p class="bless-lead">Master / detail with a draggable divider</p>

A list on one side and what you picked on the other — mail, files, settings. On a wide view both show with a divider to drag; on a narrow one they take turns, with a Back button. For two panes that always show, use [Resizable](./resizable), which this is built on.

<Demo title="Basic">
  <SplitViewBasic />
  <template #code>

<<< ../demos/SplitViewBasic.vue

  </template>
</Demo>

- `#master` is the list and `#detail` the content. The master slot gets `open()`, which shows the detail when the view is stacked and does nothing when both panes are on screen, so the same click handler works at every width.
- The view looks at its own width, not the window's: under `breakpoint` (default 560 px) it stacks. Resize the window and it switches without a reload.
- Stacked, `v-model:detail` says which pane shows. Opening the detail moves focus to it; **Back** returns to the list and focuses it, and fires `back`. Nothing is left focused on a hidden element.
- `v-model` is the master's width in % (`min` and `max` limit it, 20 to 60 by default). With `storage-key` the divider is remembered in `localStorage`; a missing, broken or out-of-range value is ignored.
- The divider itself is Resizable's: a focusable separator, arrows move it, Home and End go to the limits, Enter or a double-click resets it.

## Usage

```ts
import { BlessSplitView } from "blessing-ui";
```

## API

<PropsTable name="BlessSplitView" />
