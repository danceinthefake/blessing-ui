---
title: SwipeDeck
---

<script setup>
import SwipeDeckBasic from "../demos/SwipeDeckBasic.vue";
</script>

# SwipeDeck

<p class="bless-lead">Stack of cards to accept, reject or skip, with undo</p>

Go through a pile one card at a time — triage a queue, vet applicants, sort photos. Each card gets a verdict and leaves the deck. For items you arrange rather than judge, use [Sortable](./sortable) or [Kanban](./kanban).

<Demo title="Basic">
  <SwipeDeckBasic />
  <template #code>

<<< ../demos/SwipeDeckBasic.vue

  </template>
</Demo>

- `v-model` is the cards still to decide, top first; each verdict removes the top card. Cards past the third are not rendered, so a long deck stays cheap.
- Drag the top card: right to **accept**, left to **reject**, up to **skip**. A stamp fades in as you pass the way, and the card springs back unless you cross `threshold` (default 100 px).
- Keyboard: focus the deck, **→** accepts, **←** rejects, **↑** skips, **Backspace** or **Ctrl+Z** undoes. The arrows keep their physical direction under RTL, like the drag. Each verdict is announced with the number left.
- The buttons under the deck do the same; `:controls="false"` hides them. `labels` renames the verdicts (`{ accept: "Keep", reject: "Toss" }`).
- `decide(item, decision)` fires for every verdict and `undo(item)` when a card comes back. Undo steps back through the whole history, newest first.
- `#card="{ item, index }"` draws a card, `#empty` the end screen. The component exposes `accept()`, `reject()`, `skip()` and `undo()`.
- Motion respects `prefers-reduced-motion`: cards just disappear.

## Usage

```ts
import { BlessSwipeDeck } from "blessing-ui";
```

## API

<PropsTable name="BlessSwipeDeck" />
