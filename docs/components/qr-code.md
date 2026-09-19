---
title: QrCode
---

<script setup>
import QrCodeBasic from "../demos/QrCodeBasic.vue";
</script>

# QrCode

<p class="bless-lead">QR code SVG from a module matrix (uqr)</p>

<Demo title="Basic">
  <QrCodeBasic />
  <template #code>

<<< ../demos/QrCodeBasic.vue

  </template>
</Demo>

## Install

No encoder is bundled. [uqr](https://github.com/unjs/uqr) (~10 KB, ESM, zero deps) gives the module matrix:

```sh
pnpm add uqr
```

```ts
import { encode } from "uqr";
const matrix = encode("https://…", { ecc: "M" }).data; // boolean[][]
```

Modules stay square and default to dark-on-white regardless of theme (inverted codes scan poorly); only the optional `frame` adds a skewed accent plate behind the tile.

## Usage

```ts
import { BlessQrCode } from "blessing-ui";
```

## API

<PropsTable name="BlessQrCode" />
