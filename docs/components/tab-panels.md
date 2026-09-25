---
title: TabPanels
---

<script setup>
import TabPanelsBasic from "../demos/TabPanelsBasic.vue";
</script>

# TabPanels

<p class="bless-lead">Swipeable panel pager</p>

Swipeable panels that go with a set of tabs on phones — the content under [Tabs](./tabs), [BottomTabs](./bottom-tabs) or a segmented control, changed by the tabs or by a sideways swipe.

<Demo title="Basic">
  <TabPanelsBasic />
  <template #code>

<<< ../demos/TabPanelsBasic.vue

  </template>
</Demo>

- `v-model` is the current panel's key, shared with the tabs; `next()` / `prev()` step in code; `loop` wraps.
- Each panel is a group named by its key. The tabs themselves stay the keyboard way in; the swipe is extra.

## Usage

```ts
import { BlessTabPanels } from "blessing-ui";
```

## API

<PropsTable name="BlessTabPanels" />
