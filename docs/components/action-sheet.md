---
title: ActionSheet
---

<script setup>
import ActionSheetBasic from "../demos/ActionSheetBasic.vue";
</script>

# ActionSheet

<p class="bless-lead">Action list in a bottom drawer</p>

A short list of actions from the bottom of a phone screen — share, edit, delete. On wide screens a [DropdownMenu](./dropdown-menu) next to the button fits better.

<Demo title="Basic">
  <ActionSheetBasic />
  <template #code>

<<< ../demos/ActionSheetBasic.vue

  </template>
</Demo>

- A [Drawer](./drawer) holding buttons: Esc, the backdrop and Cancel close it. `@select` fires for a chosen action and `@cancel` only when it was dismissed without one.
- `danger` marks destructive actions; `grid` lays icons out in a grid; `cancel` (default) adds the Cancel row.

## Usage

```ts
import { BlessActionSheet } from "blessing-ui";
```

## API

<PropsTable name="BlessActionSheet" />
