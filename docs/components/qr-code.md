---
title: QrCode
---

<script setup>
import QrCodeBasic from "../demos/QrCodeBasic.vue";
</script>

# QrCode

<p class="bless-lead">QR code SVG from a module matrix (uqr)</p>

A scannable code for moving something from a screen or print to a phone — a ticket, a link, Wi-Fi details. Always show what it encodes as text or a link too: it can't be scanned by the phone it's on, or by a screen reader.

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

Pass the module grid as `matrix`; any encoder works. Modules stay square and dark-on-white whatever the theme, since inverted or low-contrast codes scan badly — keep the default colours and `border`. The optional `frame` sets the tile on a plate.

- It is an image named "QR code: …" from `value` (or `label`).

## Usage

```ts
import { BlessQrCode } from "blessing-ui";
```

## API

<PropsTable name="BlessQrCode" />
