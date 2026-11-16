---
title: SKU field
---

<script setup>
import SkuFieldBasic from "../demos/SkuFieldBasic.vue";
</script>

# SKU field

<p class="bless-lead">A field for a barcode or a SKU that takes a scanner and checks the code</p>

Takes product codes in a warehouse, a shop, or an ERP. A SKU (stock keeping unit) is your own code for a product. Most barcode scanners act as a keyboard: they type the code fast and press Enter.

<Demo title="Basic">
  <SkuFieldBasic />
  <template #code>

<<< ../demos/SkuFieldBasic.vue

  </template>
</Demo>

- `v-model` is the code. Enter, or a scanner, emits `scan` with it.
- With `kind="barcode"` (default), the field keeps only digits. It checks GS1 numbers (EAN-8, UPC-A, EAN-13, and GTIN-14) with their check digit. A wrong number is marked as not valid, says so, and does not scan.
- With `kind="sku"`, the field makes the code upper case and keeps letters, digits, dots, dashes, and the "_" sign. It does not check the code.
- `clearOnScan` empties the field after each scan, for a run of scans.
- A hidden status line says each scanned code.
- `label` sets the name of the field (default "Barcode" or "SKU"). Change the other words with `labels` or a [label pack](../guide/translating): `hint`, `valid`, `invalid`, and `scanned` (a function).

The `gs1Valid` function checks a GS1 number. It is exported for your own views.

## Usage

```ts
import { BlessSkuField } from "blessing-ui";
```

## API

<PropsTable name="BlessSkuField" />
