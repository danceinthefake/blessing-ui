---
title: ButtonGroup
---

<script setup>
import ButtonGroupBasic from "../demos/ButtonGroupBasic.vue";
</script>

# ButtonGroup

<p class="bless-lead">Joined buttons</p>

A set of related actions that read as one control — a pager, prev/next, a range picker. The buttons touch, share edges, and the outer corners belong to the group. The group stands upright and leans as one plate when any button in it is hovered or focused; `orientation="vertical"` stacks them, and the stack leans once rather than as a staircase of plates. Give the group a `label`; it becomes `role="group"`'s name.

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
