---
title: Kbd
---

<script setup>
import KbdBasic from "../demos/KbdBasic.vue";
</script>

# Kbd

<p class="bless-lead">Key combo</p>

A shortcut hint: beside a menu item, in a tooltip, in the command palette (which renders these itself), or in a "press ← / → to move" line. `keys` takes the combo as an array and joins it with +. A single key can go in the slot. The markup is the own markup of the HTML spec (a `<kbd>` of `<kbd>`s), so assistive tech reads it as keys. The uppercase is CSS only: "Ctrl" stays "Ctrl" when read aloud.

Show the symbol the user's platform shows: ⌘ on a Mac, Ctrl elsewhere. The component does not detect the platform. Pass what fits (`navigator.platform` or your own setting).

<Demo title="Basic">
  <KbdBasic />
  <template #code>

<<< ../demos/KbdBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessKbd } from "blessing-ui";
```

## API

<PropsTable name="BlessKbd" />
