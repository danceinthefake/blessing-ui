---
title: Toggle
---

<script setup>
import ToggleBasic from "../demos/ToggleBasic.vue";
import ToggleGroupBasic from "../demos/ToggleGroupBasic.vue";
</script>

# Toggle

<p class="bless-lead">Pressed buttons</p>

A button that stays pressed — bold in a toolbar, a filter that's on. For a setting that applies at once, a [Switch](./switch) reads clearer; for a set of them, wrap toggles in a [ToggleGroup](#blesstogglegroup).

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

- It is a `<button aria-pressed>`, so it's read as "Bold, toggle button, pressed".
- An icon-only toggle needs `label`.
- In a ToggleGroup, `type="single"` allows one at a time (click the pressed one again to clear) and `type="multiple"` any number; give the group a `label`.

## Usage

```ts
import { BlessToggle, BlessToggleGroup } from "blessing-ui";
```

## API

### BlessToggle

<PropsTable name="BlessToggle" />

### BlessToggleGroup

<PropsTable name="BlessToggleGroup" />
