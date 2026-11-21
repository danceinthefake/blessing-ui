---
title: Webhook log
---

# Webhook log

<p class="bless-lead">Sent events with the status, the time, and a retry button</p>

Shows the events that your service sent to the server of a customer, and what the server replied. A failed delivery has a button that sends it again. For the lines of a log file, use the [log viewer](./log-viewer).

<Demo title="Basic">
  <WebhookLogBasic />
  <template #code>

<<< ../demos/WebhookLogBasic.vue

  </template>
</Demo>

- `deliveries` is a list of deliveries. Each delivery has an `id`, an `event`, and a `time` as text. It can also have the HTTP `status`, the `duration` in ms, the `request` body, and the `response` body.
- A status from 200 to 299 is delivered, another status is failed, and no status is pending. Each state has a dot of its own shape and a word, so the color is not the only sign.
- A click on a row opens the request and the response. A body that is not text shows as JSON.
- A failed delivery has a "Send again" button that emits `retry` with the id. While you send it again, put the id in `retrying`, and the button shows a spinner.
- The log is a region. Each row is a native `details` element, so the keyboard opens it. Change the words with `labels` or a [label pack](../guide/translating): `title`, `pending`, `ok`, `failed`, `retry`, `request`, `response`, and `empty`.

## Usage

```ts
import { BlessWebhookLog } from "blessing-ui";
```

## API

<PropsTable name="BlessWebhookLog" />

<script setup>
import WebhookLogBasic from "../demos/WebhookLogBasic.vue";
</script>
