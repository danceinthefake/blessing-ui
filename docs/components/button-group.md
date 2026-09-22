---
title: ButtonGroup
---

<script setup>
import ButtonGroupBasic from "../demos/ButtonGroupBasic.vue";
</script>

# ButtonGroup

<p class="bless-lead">Joined buttons</p>

A set of related actions that read as one control — a pager, prev/next, a range picker. The buttons touch, share edges, and the outer corners belong to the group. `orientation="vertical"` stacks them on one leaning plate rather than a staircase of plates. Give the group a `label`; it becomes `role="group"`'s name.

Each button is its own tab stop and carries no selection state. For an exclusive choice with `aria-pressed` — Day / Week / Month where one is _on_ — use [ToggleGroup](./toggle); for a main action with a menu beside it, [SplitButton](./split-button); for several groups with one tab stop and arrow-key roving, [Toolbar](./toolbar).

<Demo title="Basic">
  <ButtonGroupBasic />
  <template #code>

<<< ../demos/ButtonGroupBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessButtonGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessButtonGroup" />
