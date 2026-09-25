---
title: Marker
---

<script setup>
import MarkerBasic from "../demos/MarkerBasic.vue";
</script>

# Marker

<p class="bless-lead">Inline status / note / separator / row</p>

A line between messages that isn't a message — a date, "New", "Megumi joined", a system note. It is a note, not a heading.

<Demo title="Basic">
  <MarkerBasic />
  <template #code>

<<< ../demos/MarkerBasic.vue

  </template>
</Demo>

- `variant`: `status` (centred tag), `note` (muted line), `separator` (labelled rule), `border` (boxed row). `shimmer` for pending or streaming states.

## Usage

```ts
import { BlessMarker } from "blessing-ui";
```

## API

<PropsTable name="BlessMarker" />
