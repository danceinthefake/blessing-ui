# Pembuat tema

<script setup>
import ThemeMaker from "../../demos/ThemeMaker.vue";
</script>

Pilih satu warna kelopak dan beri nama palet. Halaman ini membuat token aksen lainnya dari kelopak itu dan menjaga [janji aksen](./tokens#color-pairs). Pratinjau di bawah memakai palet baru dan mengikuti tema terang atau gelap situs ini.

<ThemeMaker />

## Memakai palet

1. Salin CSS ke stylesheet yang dimuat setelah `tokens.css`.
2. Pasang atribut pada `<html>`, misalnya `<html data-palette="mine">`.

Halaman ini membuat enam token dan satu potongan mode gelap, seperti yang dijelaskan [Palet](./palettes#token-yang-diatur-tiap-palet):

- `accent` adalah kelopak yang digelapkan sampai teks putih di atasnya mencapai 4.5:1.
- `accent-text` adalah kelopak yang digelapkan sampai mencapai 4.5:1 pada `bg` dan `surface`.
- `accent-text` gelap adalah kelopak yang diterangkan sampai mencapai 4.5:1 pada `bg` dan `surface` gelap.
- `chart-1` adalah kelopak yang digelapkan sampai mencapai 3:1 pada `bg` dan `surface`.
- `accent-soft` dan `accent-2` adalah warna kelopak yang lebih terang. Jika kelopak terlalu pucat untuk teks putih, kelopak itu sendiri menjadi `accent-soft`.
- `badge` sama dengan `accent`.

Enam palet bawaan keluar dari langkah yang sama, dengan selisih satu atau dua tingkat. Abu-abu, huruf, dan geometri tidak berubah. Untuk menyetel satu nilai, ubah nilai itu di CSS.

`setPalette()` dan `BlessPaletteToggle` hanya mengenal enam palet bawaan. Untuk palet Anda sendiri, pasang atributnya sendiri.
