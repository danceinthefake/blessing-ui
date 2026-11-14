---
title: Gestur
---

<script setup>
import GesturesBasic from "../../demos/GesturesBasic.vue";
</script>

# Gestur

<p class="bless-lead">Empat composable pointer event untuk mouse, sentuhan, dan pena. Semuanya terpasang ke ref elemen dan tidak melakukan apa pun di server.</p>

<Demo title="Keempatnya">
  <GesturesBasic />
  <template #code>

<<< ../../demos/GesturesBasic.vue

  </template>
</Demo>

```ts
import { usePan, useSwipe, useLongPress, useTouchRepeat } from "blessing-ui";

usePan(el, ({ dx, dy, phase, event }) => {}, { pointerTypes? });
// dx/dy from the press point; phase: start | move | end | cancel; pointer capture is taken
// pointerTypes: ["touch"] to ignore mouse and pen

const { direction } = useSwipe(el, (dir, pan) => {}, { threshold?: 40, axis?: "x" | "y" | "both" });
// fires once, on release, when the dominant-axis distance exceeds threshold — not during the drag
// direction: Ref<"left" | "right" | "up" | "down" | undefined>

const { pressing } = useLongPress(el, (event) => {}, { ms?: 500, tolerance?: 8 });
// fires after ms held; cancelled if the pointer moves more than tolerance px

useTouchRepeat(el, () => {}, { delay?: 400, interval?: 100 });
// fires on press, again after delay, then every interval while held — the ± stepper
```

`BlessSlideItem`, `BlessTabPanels`, `BlessPullToRefresh`, `BlessInputNumber`, dan usap tepi di `BlessLayout` memakai composable ini. Ref-nya harus elemen DOM. `ref` pada komponen Bless adalah instance komponen. Bungkus komponen dengan `<span>` (seperti di demo) atau pakai elemen yang diekspos komponen itu.

## `touch-action`

Browser menggulir saat disentuh kecuali Anda melarangnya, dan ia memutuskan sebelum handler Anda berjalan. Atur `touch-action` pada elemen, agar keduanya tidak berebut:

- `pan-y`: Anda mengambil gerakan mendatar, dan halaman tetap bisa digulir tegak (bilah usap, carousel)
- `pan-x`: kebalikannya (pegangan laci tegak)
- `none`: Anda mengambil semuanya (pelat yang bisa diseret, bantalan tanda tangan)

Lupa mengatur ini adalah alasan umum gestur "bisa dengan mouse tetapi tidak di ponsel".

## Jangan jadi satu-satunya cara {#never-the-only-way}

Gestur adalah jalan pintas, bukan kontrolnya. Usap-untuk-hapus juga memerlukan tombol hapus yang terlihat (`BlessSlideItem` menampilkan aksinya saat diketuk). Menu tekan-lama memerlukan tombol yang membuka menu yang sama. Nilai yang diatur dengan menggeser memerlukan isian atau tombol panah. Pengguna keyboard dan teknologi bantu tidak pernah melihat gestur.

## Berikutnya

Pembantu platform yang bukan gestur (ukuran, layar penuh, visibilitas, gulir, dan loading bar) ada di [Composable browser](./browser).
