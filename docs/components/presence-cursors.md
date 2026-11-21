---
title: PresenceCursors
---

# PresenceCursors

<p class="bless-lead">The live pointers of other people over an area</p>

Shows where other people point in a shared document, board, or canvas, each with a name tag. The component only draws. Your app sends the positions to the server and back, for example with a Phoenix channel and Presence. To list who is here, use an [avatar group](./avatar-group) too.

<Demo title="Basic">
  <PresenceCursorsBasic />
  <template #code>

<<< ../demos/PresenceCursorsBasic.vue

  </template>
</Demo>

- Put the shared content in the default slot. `cursors` is a list of `{ id, name, x, y, color }`. `x` and `y` go from 0 to 1 across the area, so people with screens of different sizes agree. `x` counts from the start edge, so a right-to-left page works too.
- `move` sends the local pointer in the same form, and `null` when the pointer leaves. It sends on each pointer move, so limit what you send, for example once per animation frame. Set `track` to `false` to stop it.
- Each person gets one of the chart colors from their `id`, so the color stays the same between renders. Set `color` to a token name or any CSS color to choose it.
- A tag moves to its new spot with a short transition, and with no transition under reduced motion.
- The layer is hidden from screen readers, because pointer positions have no meaning without sight. Say who is here in words, for example with an avatar group.

## Usage

```ts
import { BlessPresenceCursors, type BlessPresenceCursor } from "blessing-ui";
```

## API

<PropsTable name="BlessPresenceCursors" />

<script setup>
import PresenceCursorsBasic from "../demos/PresenceCursorsBasic.vue";
</script>
