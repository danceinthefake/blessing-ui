---
title: Menerjemahkan library
---

<script setup>
import LabelsSwitch from "../../demos/LabelsSwitch.vue";
</script>

# Menerjemahkan library

Beberapa komponen mengucapkan kata untuk Anda: tombol "Copy", tautan "Show more", pesan pembaca layar seperti "Copied to clipboard". Anda bisa mengganti semuanya di satu tempat. Berikan sebuah paket label (label pack) ke library, dan setiap komponen di bawahnya memakai paket itu.

```ts
import { provideLabels } from "blessing-ui";

// in your root component's setup
provideLabels({
  BlessCopyButton: { copy: "Copiar", copied: "Copiado" },
  BlessPoll: { vote: "Votar", votes: (n) => `${n} votos` },
});
```

Anda juga bisa memberikannya untuk seluruh aplikasi: `app.provide(blessLabelsKey, pack)`.

<Demo title="Ganti bahasa">
  <LabelsSwitch />
  <template #code>

<<< ../../demos/LabelsSwitch.vue

  </template>
</Demo>

## Bahasa Indonesia

Library menyertakan satu paket lengkap: `labelsId`, dalam bahasa Indonesia. Paket ini berisi setiap kata dari setiap komponen yang punya prop `labels`.

```ts
import { labelsId, provideLabels } from "blessing-ui";

provideLabels(labelsId);
```

Untuk mengganti beberapa kata, sebarkan paketnya lalu ganti kata itu: `{ ...labelsId, BlessPoll: { ...labelsId.BlessPoll, vote: "Coblos" } }`.

Untuk menulis paket lengkap untuk bahasa lain, beri paket Anda tipe `BlessLabelsFull`. Pemeriksaan tipe lalu memberi tahu setiap kata yang belum ada, juga ketika versi baru library menambah kata.

## Cara kerjanya

Paket memetakan nama komponen ke objek `labels` milik komponen itu. Tabel API setiap komponen menunjukkan kata apa saja yang dimilikinya. Pesan yang memuat angka atau nama adalah fungsi dari angka atau nama itu, sehingga bentuk jamak bisa mengikuti aturan bahasa Anda.

Untuk setiap kata, komponen memilih sumber pertama yang memilikinya:

1. Prop `labels` pada komponen itu.
2. Paket label.
3. Kata bawaan dalam bahasa Inggris.

Anda bisa mencampurnya. Pakai paket untuk seluruh aplikasi, dan prop `labels` untuk satu tempat yang memerlukan kata lain.

## Ganti bahasa saat aplikasi berjalan

Berikan ref atau getter, dan kata-katanya berubah saat nilainya berubah. Demo di atas melakukannya dengan `computed`. Library i18n Anda bisa membangun paket dari file pesannya. Library tidak memuat bahasa sendiri. Selain `labelsId`, library tidak menyertakan terjemahan.

## Yang tidak dicakup paket

Paket mencakup komponen yang punya prop `labels`. Kata-kata berikut tetap terpisah:

- Prop yang menamai satu hal, seperti `label`, `placeholder`, dan `emptyText`. Anda memberikannya di setiap komponen.
- `BlessPasswordMeter`, yang `labels`-nya berupa daftar kata kekuatan sandi secara berurutan.
- Tanggal, angka, dan zona waktu. Semuanya memakai `Intl` dengan prop `locale`, atau bahasa browser.

Arah teks juga terpisah. Atur `dir` dan `lang` di `<html>`, seperti yang ditunjukkan [panduan kanan-ke-kiri](./rtl).
