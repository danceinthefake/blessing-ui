---
title: Bill of materials
---

# Bill of materials

<p class="bless-lead">A tree of parts with quantities, and the total for one or more units</p>

A bill of materials (BOM) lists what goes into a product, part by part. It plans a build in an ERP or a workshop app.

<Demo title="Basic">
  <BillOfMaterialsBasic />
  <template #code>

<<< ../demos/BillOfMaterialsBasic.vue

  </template>
</Demo>

- `product` is the name of the product at the top. `parts` is the tree. Each part has an `id`, a `name`, and the `quantity` for one of its parent. It can also have a `sku`, a `unit`, a `cost` of one, and `children`.
- `v-model:count` is the number of products to build (default 1). Each row shows the quantity for one parent, "each", and the total for the build, "in all".
- A part with children has a button that opens and closes its group. Screen readers hear whether the group is open.
- The status line gives the cost of the raw parts for the build. A raw part is a part with no children. The same SKU in two places adds up.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `build`, and the functions `per`, `total`, `cost`, and `open`.

The `bomNeeds` function lists the raw parts and the cost. It is exported, for example to make a purchase list.

## Usage

```ts
import { BlessBillOfMaterials } from "blessing-ui";
```

## API

<PropsTable name="BlessBillOfMaterials" />

<script setup>
import BillOfMaterialsBasic from "../demos/BillOfMaterialsBasic.vue";
</script>
