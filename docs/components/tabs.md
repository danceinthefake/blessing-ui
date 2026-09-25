---
title: Tabs
---

<script setup>
import TabsBasic from "../demos/TabsBasic.vue";
import TabsManual from "../demos/TabsManual.vue";
</script>

# Tabs

<p class="bless-lead">ARIA tablist</p>

Switching between views of the same thing that don't need to be seen together — details / reviews / specs. Not for navigation between pages (that's links), and not for steps (that's [Stepper](./stepper)).

<Demo title="Basic">
  <TabsBasic />
  <template #code>

<<< ../demos/TabsBasic.vue

  </template>
</Demo>

<Demo title="Manual">
  <TabsManual />
  <template #code>

<<< ../demos/TabsManual.vue

  </template>
</Demo>

- One Tab stop for the tab row; arrows move between tabs (in right-to-left pages too), Home / End jump. `activation="manual"` waits for Enter or Space before switching, for panels that are slow to show.
- Each panel is labelled by its tab. `#tab` renders a tab's content yourself.

## Usage

```ts
import { BlessTabs } from "blessing-ui";
```

## API

<PropsTable name="BlessTabs" />
