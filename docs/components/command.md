---
title: Command
---

<script setup>
import CommandBasic from "../demos/CommandBasic.vue";
import CommandInline from "../demos/CommandInline.vue";
</script>

# Command

<p class="bless-lead">⌘K palette</p>

<Demo title="Basic">
  <CommandBasic />
  <template #code>

<<< ../demos/CommandBasic.vue

  </template>
</Demo>

<Demo title="Inline">
  <CommandInline />
  <template #code>

<<< ../demos/CommandInline.vue

  </template>
</Demo>

## Usage

```ts
import { BlessCommand } from "blessing-ui";
```

## API

<PropsTable name="BlessCommand" />
