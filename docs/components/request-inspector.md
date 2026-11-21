---
title: Request inspector
---

# Request inspector

<p class="bless-lead">One HTTP request and its response, with the headers and the bodies</p>

Shows the detail of one call in a network panel, a webhook log, or an API playground.

<Demo title="Basic">
  <RequestInspectorBasic />
  <template #code>

<<< ../demos/RequestInspectorBasic.vue

  </template>
</Demo>

- `method` and `url` name the request. `status` and `status-text` give the answer.
- The status says its class in words: success, redirect, client error, or server error. An error gets a red frame.
- `duration` is the time in milliseconds, and `size` is the size of the response body in bytes.
- `request` and `response` each have `headers` and a `body`. The tabs show the headers of both, the request body, and the response body.
- A body in JSON gets indents. Each body is in a [code block](./code-block) with a copy button.
- `locale` formats the time and the size. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessRequestInspector } from "blessing-ui";
```

## API

<PropsTable name="BlessRequestInspector" />

<script setup>
import RequestInspectorBasic from "../demos/RequestInspectorBasic.vue";
</script>
