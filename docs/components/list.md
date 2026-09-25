---
title: List
---

<script setup>
import ListBasic from "../demos/ListBasic.vue";
</script>

# List

<p class="bless-lead">Divided rows</p>

A plain vertical list of [Item](./item)s, divided by hairlines — settings rows, a contact list. For collections with paging or a layout switch, use [DataView](./data-view).

<Demo title="Basic">
  <ListBasic />
  <template #code>

<<< ../demos/ListBasic.vue

  </template>
</Demo>

- It is a `<ul role="list">`: the role keeps it announced as a list in Safari, which drops list semantics from unstyled lists.
- Put `BlessItem`s (or your own `<li>`s) in it; `divided` (default) draws the hairlines.

## Usage

```ts
import { BlessList, BlessListItem } from "blessing-ui";
```

## API

### BlessList

<PropsTable name="BlessList" />

### BlessListItem

<PropsTable name="BlessListItem" />
