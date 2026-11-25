# Suasana & mode gelap

Blessing UI memiliki tiga suasana waktu: **Daylight** (kertas hangat `#EDE6E1` dan tinta `#262228`), **Senja** (`data-theme="golden"`, kertas amber hangat), dan **Night** (`data-theme="dark"`, kertas malam ungu gelap dengan tepi atas tipis di permukaan terangkat). Di Night, isian warna aksen tetap sama sementara warna teksnya (juga danger dan info) menjadi lebih terang agar kontras terjaga, dan `--bless-font-weight-thin` berubah dari 100 menjadi 300. Daftar lengkap perubahannya ada di [Token → Yang dibalik](./tokens#what-flips-what-swaps).

Secara bawaan, suasana mengikuti `prefers-color-scheme`. Paksa suasana apa pun dengan `data-theme` di `<html>`:

```html
<html data-theme="golden"></html>
<html data-theme="dark"></html>
```

`data-theme="light"` memaksa Daylight bahkan di sistem operasi gelap. Library juga mengatur `color-scheme`, sehingga kontrol bawaan, scrollbar, dan isian formulir mengikuti suasana.

<Demo title="Kontrolnya">
  <ThemeToggleBasic />
  <template #code>

<<< ../../demos/ThemeToggleBasic.vue

  </template>
</Demo>

`BlessThemeToggle` adalah kontrol yang siap pakai. Situs ini memakainya di bilah atas. Secara bawaan ia satu tombol matahari/bulan. Pakai `mode="group"` untuk pilihan Terang, Sistem, Senja, dan Gelap.

## `useTheme()`

```ts
import { useTheme } from "blessing-ui";
const { theme, isDark, set, toggle } = useTheme();
// theme: "light" | "dark" | "golden" | "system" — persisted in localStorage("bless-theme")
```

`toggle()` berpindah ke kebalikan dari yang sedang _tampil_. Dari `system` di sistem operasi yang gelap, ia pindah ke `light`, sehingga klik pertama selalu mengubah sesuatu. `set("golden")` memilih Senja, dan `set("system")` mengembalikan kendali ke sistem operasi.

## Tanpa kedipan saat dimuat {#no-flash-on-load}

`useTheme()` menerapkan pilihan yang tersimpan setelah aplikasi terpasang (setelah hidrasi, agar markup dari server tetap cocok). Atur atributnya sebelum halaman digambar dengan skrip inline di `<head>`:

```html
<script>
  try {
    const t = localStorage.getItem("bless-theme");
    if (t === "dark" || t === "light" || t === "golden") document.documentElement.dataset.theme = t;
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

<script setup>
import ThemeToggleBasic from "../../demos/ThemeToggleBasic.vue";
</script>
