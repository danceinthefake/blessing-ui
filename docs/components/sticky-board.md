---
title: Sticky board
---

<script setup>
import StickyBoardBasic from "../demos/StickyBoardBasic.vue";
</script>

# Sticky board

<p class="bless-lead">Sticky notes that you add, edit, color, and move</p>

Collects ideas on a board, for a planning call or a workshop. Each note has its own place, which the team can change. For cards in columns, use the [Kanban board](./kanban). For an endless canvas, use the [infinite canvas](./infinite-canvas).

<Demo title="Basic">
  <StickyBoardBasic />
  <template #code>

<<< ../demos/StickyBoardBasic.vue

  </template>
</Demo>

- `v-model` is the list of notes. Each note has an `id`, a `text`, a place `x` and `y` in pixels, and a `color`: `yellow`, `pink`, `blue`, or `green`.
- "Add a note" puts a new empty note on the board and moves the focus into it.
- Type in a note to change its text. The ◐ button changes its color, and the ✕ button deletes it.
- Drag the handle at the top of a note to move it. With the keyboard, focus the handle and press the arrow keys: 10 pixels a step, and 40 with Shift. A note stays inside the board.
- `height` sets the height of the board in pixels (default 360).
- The notes keep a light paper color in both themes, with dark text on it. Each note and its text field have a name, such as "Note 2". Change the words with `labels` or a [label pack](../guide/translating): `board`, `add`, `move`, `color`, `remove`, and `note` (a function of the number).

## Usage

```ts
import { BlessStickyBoard } from "blessing-ui";
```

## API

<PropsTable name="BlessStickyBoard" />
