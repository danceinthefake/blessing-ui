---
title: Ticket view
---

<script setup>
import TicketViewBasic from "../demos/TicketViewBasic.vue";
</script>

# Ticket view

<p class="bless-lead">A help desk ticket with the customer, the messages, the state, and a reply box</p>

Shows one support request in a help desk. An agent reads the thread, writes a reply or an internal note, and sets the state. For the time limit of the ticket, add the [SLA timer](./sla-timer).

<Demo title="Basic">
  <TicketViewBasic />
  <template #code>

<<< ../demos/TicketViewBasic.vue

  </template>
</Demo>

- `subject`, `number`, `customer`, and `messages` are required. The customer has a `name` and an optional `email`.
- Each message has an `id`, `from`, a `role`, a `time` as text, and a `body`. The role is `customer`, `agent`, or `note`.
- An internal note has a dashed edge, a tint, and the words "Internal note". It must never look like a reply, because the customer does not see it.
- `priority` is `low`, `normal` (default), `high`, or `urgent`. It shows as a mark and a word.
- `v-model:status` is `open`, `pending`, or `solved`, in a native menu.
- The reply box has two modes: Reply and Internal note. In note mode, the box is dashed and says that only the team sees it. The button emits `reply` with the text and `true` for a note.
- Change the words with `labels` or a [label pack](../guide/translating): the three states, the four priorities, `status`, `priority`, `reply`, `note`, `send`, `addNote`, `internal`, and `placeholder`.

## Usage

```ts
import { BlessTicketView } from "blessing-ui";
```

## API

<PropsTable name="BlessTicketView" />
