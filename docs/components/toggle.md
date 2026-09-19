---
title: Toggle
---

<script setup>
import ToggleBasic from "../demos/ToggleBasic.vue";
import ToggleGroupBasic from "../demos/ToggleGroupBasic.vue";
</script>

# Toggle

<p class="bless-lead">Pressed buttons</p>

<Demo title="Basic">
  <ToggleBasic />
  <template #code>

<<< ../demos/ToggleBasic.vue

  </template>
</Demo>

<Demo title="Group Basic">
  <ToggleGroupBasic />
  <template #code>

<<< ../demos/ToggleGroupBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessToggle, BlessToggleGroup } from "blessing-ui";
```

## API

### BlessToggle

<PropsTable name="BlessToggle" />

### BlessToggleGroup

<PropsTable name="BlessToggleGroup" />
