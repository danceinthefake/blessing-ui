---
title: Machine board
---

# Machine board

<p class="bless-lead">The machines of a line with their state and how long they are in it</p>

Shows a whole line at a glance, on a big screen on the shop floor or in the office of the line lead. Such a board is often called an andon board.

<Demo title="Basic">
  <MachineBoardBasic />
  <template #code>

<<< ../demos/MachineBoardBasic.vue

  </template>
</Demo>

- `machines` is a list. Each machine has an `id`, a `name`, and a `state`. It can also have the `minutes` in that state, the `job` it makes, and a `reading`.
- The state is `running`, `idle`, `setup`, `down`, or `offline`. Each state has a mark, a word, and an edge. A down machine has a thick red frame and a tint.
- The machines that need help come first: down, offline, setup, idle, then running. `sort: false` keeps your order.
- A status line counts the machines in each state, such as "4 running, 1 down".
- Each tile is a button that emits `select` with the id, for example to open the machine.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, the five states, and the functions `since`, `time`, and `summary`.

## Usage

```ts
import { BlessMachineBoard } from "blessing-ui";
```

## API

<PropsTable name="BlessMachineBoard" />

<script setup>
import MachineBoardBasic from "../demos/MachineBoardBasic.vue";
</script>
