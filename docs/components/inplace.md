---
title: Inplace
---

<script setup>
import InplaceBasic from "../demos/InplaceBasic.vue";
</script>

# Inplace

<p class="bless-lead">Click-to-edit</p>

A value shown as text until someone clicks it to change it — a title, a name in a list. It keeps a page readable when editing is occasional. When most visitors will edit, show the field.

<Demo title="Basic">
  <InplaceBasic />
  <template #code>

<<< ../demos/InplaceBasic.vue

  </template>
</Demo>

- Opening moves focus into the first control of `#content`; Esc, the × (`closable`) or the `close` slot prop close it and put focus back on the text.
- The `#display` button needs text that says it can be edited — the value itself usually does, but an empty value needs a placeholder ("Add a title").

## Usage

```ts
import { BlessInplace } from "blessing-ui";
```

## API

<PropsTable name="BlessInplace" />
