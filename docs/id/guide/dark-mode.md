# Mode gelap

<script setup>
import ThemeToggleBasic from "../../demos/ThemeToggleBasic.vue";
</script>

Abu-abu dibalik. Isian warna aksen tetap sama, tetapi warna teksnya (juga teks danger dan info) menjadi lebih terang, sehingga tetap terbaca di atas abu-abu gelap. `--bless-font-weight-thin` berubah dari 100 menjadi 300, karena garis tipis terlihat lebih tipis sebagai teks terang di latar gelap. Daftar lengkap perubahannya ada di [Token → Yang dibalik](./tokens#what-flips-what-swaps).

Secara bawaan, tema mengikuti `prefers-color-scheme`. Paksa salah satu tema dengan `data-theme` di `<html>`:

```html
<html data-theme="dark"></html>
```

`data-theme="light"` memaksa tema terang, juga di sistem operasi yang gelap. Library juga mengatur `color-scheme`, sehingga kontrol bawaan, scrollbar, dan isian formulir mengikuti tema.

<Demo title="Kontrolnya">
  <ThemeToggleBasic />
  <template #code>

<<< ../../demos/ThemeToggleBasic.vue

  </template>
</Demo>

`BlessThemeToggle` adalah kontrol yang siap pakai. Situs ini memakainya. Secara bawaan, ia satu tombol ☀/☾. Pakai `mode="group"` untuk pilihan terang, sistem, dan gelap.

## `useTheme()`

```ts
import { useTheme } from "blessing-ui";
const { theme, isDark, set, toggle } = useTheme();
// theme: "light" | "dark" | "system" — persisted in localStorage("bless-theme")
```

`toggle()` berpindah ke kebalikan dari yang sedang _tampil_. Dari `system` di sistem operasi yang gelap, ia pindah ke `light`, sehingga klik pertama selalu mengubah sesuatu. `set("system")` mengembalikan kendali ke sistem operasi.

## Tanpa kedipan saat dimuat {#no-flash-on-load}

`useTheme()` menerapkan pilihan yang tersimpan setelah aplikasi terpasang (setelah hidrasi, agar markup dari server tetap cocok). Di halaman statis atau hasil render server, ini menyisakan satu frame tema bawaan sebelum pilihan gelap yang tersimpan diterapkan. Atur atributnya sebelum halaman digambar, dengan skrip inline di `<head>`:

```html
<script>
  try {
    const t = localStorage.getItem("bless-theme");
    if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
    const p = localStorage.getItem("bless-palette");
    if (p) document.documentElement.dataset.palette = p;
  } catch {}
</script>
```

Nuxt: `app.head.script: [{ innerHTML: "…", tagPosition: "head" }]` di `nuxt.config`. Tidak perlu yang lain. Anda tidak perlu membungkus komponen dengan `BlessClientOnly` untuk tema. Hanya atribut `aria-pressed` pada tombol tema yang menunggu klien, sehingga library mengaturnya setelah hidrasi.

## Mengganti palet gelap

Definisikan ulang token di kedua selector yang dipakai `tokens.css`: yang dipaksa dan yang mengikuti sistem operasi. Muat penggantinya **setelah** `tokens.css`:

```css
:root[data-theme="dark"] {
  --bless-color-surface: #1c1e22;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bless-color-surface: #1c1e22;
  }
}
```
