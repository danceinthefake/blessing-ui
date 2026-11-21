---
title: ConnectionStatus
---

# ConnectionStatus

<p class="bless-lead">Online, offline, or reconnecting</p>

A small line that tells people when the app lost its connection and when it came back. Use it in a live app, for example one on a Phoenix socket, where work stops without a connection. For a message that people must act on, use an [alert](./alert) or a [banner](./banner) instead.

<Demo title="Basic">
  <ConnectionStatusBasic />
  <template #code>

<<< ../demos/ConnectionStatusBasic.vue

  </template>
</Demo>

- The component listens to the browser's `online` and `offline` events by itself. `state` adds your socket's state: `online`, `connecting`, or `offline`. When the browser is offline, that wins over `state`.
- While the connection is good, the line is empty. After a problem, "Back online" shows for four seconds, and then the line is empty again. Set `always` to show the online state too, for example in a status bar.
- The line is a status, so a screen reader speaks each change once, without moving focus. The status stays in the page while it is empty, so the first problem is spoken too.
- The dot is green, amber, or red. The words carry the same meaning, so color is never the only signal. The amber dot pulses while the app reconnects, and it stops under reduced motion.
- The first render assumes online, because the server cannot know. The browser's real state is read after mount.
- Change the words with `labels` or a [label pack](../guide/translating): `online`, `back`, `connecting`, and `offline`.

## Usage

```ts
import { BlessConnectionStatus } from "blessing-ui";
```

## API

<PropsTable name="BlessConnectionStatus" />

<script setup>
import ConnectionStatusBasic from "../demos/ConnectionStatusBasic.vue";
</script>
