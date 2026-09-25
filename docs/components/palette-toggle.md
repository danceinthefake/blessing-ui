---
title: PaletteToggle
---

<script setup>
import PaletteToggleBasic from "../demos/PaletteToggleBasic.vue";
</script>

# PaletteToggle

<p class="bless-lead">Accent palette swatches</p>

Swatches for choosing the accent palette the whole site wears — the palette picker on this site. See [Palettes](/guide/palettes) for what changes.

<Demo title="Basic">
  <PaletteToggleBasic />
  <template #code>

<<< ../demos/PaletteToggleBasic.vue

  </template>
</Demo>

- Each swatch is a pressed-state button named after its palette. The choice is saved and applied as `data-palette` on `<html>`; see [Dark mode](/guide/dark-mode#no-flash-on-load) for applying it before first paint.
- `showDefault` (on) includes the default palette's swatch, which clears any other; `label` names the group.

## Usage

```ts
import { BlessPaletteToggle } from "blessing-ui";
```

## API

<PropsTable name="BlessPaletteToggle" />
