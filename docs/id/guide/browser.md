---
title: Browser
---

# Browser

Pembungkus kecil untuk API platform. Semuanya aman untuk SSR (terpasang saat komponen terpasang) dan dibersihkan saat komponen dilepas.

<Demo title="Langsung: ubah ukuran kotak, gulir halaman, ganti tab">
  <BrowserBasic />
  <template #code>

<<< ../../demos/BrowserBasic.vue

  </template>
</Demo>

```ts
import {
  useResizeObserver,
  useFullscreen,
  useVisibility,
  useScroll,
  useLoadingBar,
  useMedia,
  useHash,
  reducedMotion,
  scrollBehavior,
} from "blessing-ui";

const { width, height } = useResizeObserver(el); // the element's box, live
const { active, enter, exit, toggle } = useFullscreen(el?); // document if no el
const { visible } = useVisibility(); // document.visibilityState === "visible"
const { x, y, direction } = useScroll(el?); // window if no el; direction: "up" | "down" | null
const { start, stop, set, track } = useLoadingBar(); // drives BlessLoadingBar; nested start/stop, track(promise)
const matches = useMedia("(min-width: 800px)"); // Ref<boolean>
const hash = useHash(); // Ref<string> of location.hash, two-way — what BlessModal `hash` uses
reducedMotion(); // boolean, read now: did the person ask for less motion?
el.scrollTo({ top: 0, behavior: scrollBehavior() }); // "smooth", or "auto" under reduced motion
```

`useLoadingBar` menghitung panggilan. Setiap `start()` memerlukan `stop()`. Saat hitungan mencapai nol, bilahnya tersembunyi. `track(promise)` membungkus kedua panggilan itu. `BlessLayout` memakai nilai `direction` dari `useScroll` untuk menyembunyikan dan menampilkan header-nya.

`useFullscreen().enter()` hanya bekerja dari aksi pengguna, misalnya klik atau tekanan tombol. Browser menolak layar penuh yang diminta saat komponen terpasang atau oleh timer.

`reducedMotion()` membaca preferensi pada saat dipanggil. Pakai untuk keputusan sekali saja sebelum Anda menggulir atau memulai animasi. Untuk nilai yang selalu diperbarui, pakai `useMedia("(prefers-reduced-motion: reduce)")`, seperti di demo. Kedua pembantu gerak ini membantu gerakan yang Anda tulis sendiri tetap memegang [aturan kepedulian](./conventions#care).

<script setup>
import BrowserBasic from "../../demos/BrowserBasic.vue";
</script>
