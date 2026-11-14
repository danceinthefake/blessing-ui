---
title: Ukuran bundle
---

<script setup>
import SizesTable from "../../demos/SizesTable.vue";
</script>

# Ukuran bundle

Setiap komponen adalah file sendiri dengan stylesheet sendiri, sehingga aplikasi Anda hanya membayar komponen yang diimpor. Tabel ini menunjukkan tambahan ukuran satu komponen saat Anda mengimpornya sendirian.

<Demo title="Setiap komponen">
  <SizesTable />
  <template #code>

<<< ../../demos/SizesTable.vue

  </template>
</Demo>

## Cara angka ini dibuat

- Pemeriksaan memasang paket yang sudah dikemas ke sebuah aplikasi contoh, seperti Anda memasangnya dari npm.
- Pemeriksaan membundel setiap komponen sendirian dengan Vite, diperkecil, lalu meng-gzip JS dan CSS-nya.
- Vue tidak dihitung, karena aplikasi Anda sudah memilikinya. Token desain (sekitar 2 KB) juga tidak dihitung, karena aplikasi memuatnya sekali untuk semua komponen.
- Komponen yang memakai komponen lain ikut menghitungnya. Misalnya, `BlessDataTable` termasuk paginasi dan select-nya.
- `BlessEditor`, `BlessChart`, dan `BlessMarkdown` tidak menghitung Tiptap, Unovis, dan marked, yang Anda pasang sendiri.

Dua komponen yang berbagi satu bagian hanya membayarnya sekali di aplikasi Anda, jadi jumlah dua baris lebih besar dari biaya sebenarnya bila dipakai bersama. Pemeriksaan berjalan di setiap push, sehingga tabel ini sesuai dengan kode terbaru. Untuk melihat biaya seluruh library, baca [Instalasi](./install).
