---
title: Accordion
---

<script setup>
import AccordionBasic from "../demos/AccordionBasic.vue";
</script>

# Accordion

<p class="bless-lead">Collapsibles, one open at a time</p>

A set of [Collapsible](./collapsible)s where opening one closes the others — an FAQ, a settings list. Use it when only one answer matters at a time; if people compare several, let them stay open (`type="multiple"`).

<Demo title="Basic">
  <AccordionBasic />
  <template #code>

<<< ../demos/AccordionBasic.vue

  </template>
</Demo>

- Built on native `<details name>`, so the browser closes the others and find-in-page opens a match. Enter or Space toggles an item.
- Each `BlessAccordionItem` takes a `title` (or `#title`), `v-model:open` and `disabled`.

## Usage

```ts
import { BlessAccordion, BlessAccordionItem } from "blessing-ui";
```

## API

### BlessAccordion

<PropsTable name="BlessAccordion" />

### BlessAccordionItem

<PropsTable name="BlessAccordionItem" />
