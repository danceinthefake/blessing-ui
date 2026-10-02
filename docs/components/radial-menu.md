---
title: RadialMenu
---

<script setup>
import RadialMenuBasic from "../demos/RadialMenuBasic.vue";
</script>

# RadialMenu

<p class="bless-lead">Press-and-hold or right-click radial menu</p>

A short ring of actions that appears where you pressed: a few well-known choices, reached by direction instead of reading a list. Keep it to three to eight actions and never make it the only way to do something. For longer or nested commands, use a [ContextMenu](./context-menu).

<Demo title="Basic">
  <RadialMenuBasic />
  <template #code>

<<< ../demos/RadialMenuBasic.vue

  </template>
</Demo>

- Wrap the area it belongs to. It opens on **right-click**, on a **long touch** (`holdMs`, default 450 ms), and from the keyboard with the **menu key** or **Shift+F10**, which opens it at the focused element. A touch that moves more than 8 px is a scroll, not a hold.
- Buttons sit on a circle (`radius`, 84 px by default) from the top, clockwise. The menu is kept on screen: near an edge the whole ring shifts inward.
- With a mouse, click a button. With a finger, keep it down after the menu opens and **slide toward a button**: the wedge you point at lights up and its name shows in the centre; **let go to choose**, or lift inside the centre to leave the ring open and tap.
- Keyboard: focus starts on the first action; **↑ ↓ ← →** move (wrapping, skipping disabled ones), **Home** and **End** jump, **Enter** or **Space** choose, **Esc** closes and puts focus back.
- `select` fires with the item; `v-model:open` mirrors the state. `#item="{ item, index }"` draws a button's face; by default it is `icon`, or the label's first letter. Each button keeps its full `label` as its name for screen readers.
- Mouse-only or touch-only features are not required: everything reachable by pointer has the keyboard route above.

## Usage

```ts
import { BlessRadialMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessRadialMenu" />
