---
title: Ticket
---

<script setup>
import TicketBasic from "../demos/TicketBasic.vue";
</script>

# Ticket

<p class="bless-lead">An event ticket with a tear line, the seat, and a QR code</p>

Shows a ticket after a person books it, on a page or in a list of orders. The main part holds the event and its details, and the stub holds the code to scan at the door. To choose the seat first, use the [seat picker](./seat-picker).

<Demo title="Basic">
  <TicketBasic />
  <template #code>

<<< ../demos/TicketBasic.vue

  </template>
</Demo>

- `event` is the name, as a heading, and `subtitle` is a line under it.
- `date`, `time`, `venue`, `seat`, and `holder` are text. If you leave one out, it does not show.
- `qr` is the module grid of the code, for example `encode(code).data` from [uqr](https://github.com/unjs/uqr). The [QR code](./qr-code) component draws it. `code` shows the code as text under it. Without both, the ticket has no stub.
- A dashed tear line with a notch at each end splits the two parts. On a narrow screen, the stub goes under the main part.
- The QR code has the code in its name for screen readers. Change the words with `labels` or a [label pack](../guide/translating): `date`, `time`, `venue`, `seat`, `holder`, and `code`.

## Usage

```ts
import { BlessTicket } from "blessing-ui";
```

## API

<PropsTable name="BlessTicket" />
