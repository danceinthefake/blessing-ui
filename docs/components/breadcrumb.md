---
title: Breadcrumb
---

<script setup>
import BreadcrumbBasic from "../demos/BreadcrumbBasic.vue";
</script>

# Breadcrumb

<p class="bless-lead">Trail</p>

Where a page sits in a hierarchy of three or more levels, each step a link back up. A flat site doesn't need one, and it doesn't replace the main navigation.

<Demo title="Basic">
  <BreadcrumbBasic />
  <template #code>

<<< ../demos/BreadcrumbBasic.vue

  </template>
</Demo>

- The last item is the current page (`aria-current="page"`) and is not a link.
- Links go through your router when one is provided ([Install](/guide/install#with-a-router)).
- `separator` is drawn, not read; `#item` renders an item yourself with `{ item, last }`.

## Usage

```ts
import { BlessBreadcrumb } from "blessing-ui";
```

## API

<PropsTable name="BlessBreadcrumb" />
