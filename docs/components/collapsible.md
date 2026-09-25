---
title: Collapsible
---

<script setup>
import CollapsibleBasic from "../demos/CollapsibleBasic.vue";
</script>

# Collapsible

<p class="bless-lead">&lt;details&gt; based</p>

Content most readers can skip — an FAQ answer, advanced options, a long spec — behind a title that opens it. Several with the same `name` make an accordion where one is open at a time. Don't hide anything most people need.
<Demo title="Basic">
<CollapsibleBasic />
<template #code>

<<< ../demos/CollapsibleBasic.vue

  </template>
</Demo>

- Native `<details>`: Enter or Space toggles it, find-in-page opens it on a match, and it works before any script runs.
- `v-model:open` follows it both ways. `name` groups them (the browser closes the others).
- `#title` for a title with markup; `disabled` keeps it shut.

## Usage

```ts
import { BlessCollapsible } from "blessing-ui";
```

## API

<PropsTable name="BlessCollapsible" />
