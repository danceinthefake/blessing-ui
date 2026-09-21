---
title: Kbd
---

<script setup>
import KbdBasic from "../demos/KbdBasic.vue";
</script>

# Kbd

<p class="bless-lead">Key combo</p>

A shortcut hint: beside a menu item, in a tooltip, in the command palette (which renders these itself), in a "press ← / → to navigate" line. `keys` takes the combo as an array and joins it with +; a single key can go in the slot. The markup is the HTML spec's own — a `<kbd>` of `<kbd>`s — so assistive tech reads it as keys, and the uppercase is CSS only: "Ctrl" stays "Ctrl" when read aloud.

Show the symbol the user's platform shows: ⌘ on a Mac, Ctrl elsewhere. The component doesn't detect the platform; pass what fits (`navigator.platform` or your own setting).

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
