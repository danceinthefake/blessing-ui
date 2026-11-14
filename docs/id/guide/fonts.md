# Font

<script setup>
import FontsWeights from "../../demos/FontsWeights.vue";
</script>

`--bless-font-sans` berisi

```
"Roboto", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif
```

Muat empat ketebalan Roboto: **100** untuk suara tipis (watermark, wordmark, `BlessText weight="thin"`), **300**, **400**, dan **700**. `--bless-font-weight-thin` bernilai 100, dan mode gelap mengubahnya menjadi 300 karena garis tipis terlihat lebih tipis di latar gelap. Muat kedua ketebalan itu. Pakai 100 hanya untuk ukuran judul ke atas. Di ukuran teks biasa, garisnya terlalu tipis untuk dibaca, jadi pakai 300 atau lebih tebal.

<Demo title="Empat ketebalan">
  <FontsWeights />
  <template #code>

<<< ../../demos/FontsWeights.vue

  </template>
</Demo>

Library tidak menyertakan font, jadi Anda harus memuatnya sendiri. Anda tidak perlu file italic. Kemiringan adalah skew yang diterapkan library pada elemen, bukan huruf italic.

## Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&family=Noto+Sans+JP:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

Dua baris `preconnect` itu penting: tanpanya, tampilan pertama menunggu koneksi baru ke dua host.

## Huruf Jepang

Susunan font sudah jatuh ke Hiragino (macOS dan iOS) dan Meiryo (Windows). Setiap pembaca Jepang punya salah satunya. Noto Sans JP untuk Linux, Android, dan tampilan yang seragam. Dari Google Fonts, biayanya kecil. Hurufnya dipecah menjadi banyak potongan `unicode-range` kecil, dan halaman hanya mengunduh potongan yang diperlukan karakternya. Sebagai file utuh yang Anda host sendiri, ukurannya besar, sekitar 1–2 MB untuk dua ketebalan. Pangkas hurufnya. Jika pembaca Anda memakai Mac atau Windows, buang saja dan biarkan font sistem membawa teks Jepang. Roboto tipis adalah satu-satunya huruf yang menentukan tampilannya.

## Host sendiri

Jalan terpendek adalah [Fontsource](https://fontsource.org), yang mengemas tiap ketebalan sebagai stylesheet beserta filenya:

```sh
pnpm add @fontsource/roboto
```

```ts
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
```

Nama keluarganya tetap `"Roboto"`, jadi token tidak perlu diubah. Jika dengan tangan, sajikan filenya dan arahkan token ke nama huruf Anda:

```css
@font-face {
  font-family: "Roboto";
  font-weight: 100;
  font-display: swap;
  src: url("/fonts/roboto-thin.woff2") format("woff2");
}
/* …300, 400, 700 */

:root {
  --bless-font-sans: "Roboto", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
}
```

`font-display: swap` menjaga teks tetap terlihat selama file datang. Tanpa semua ini, susunan font jatuh ke sans bawaan sistem, yang cukup baik untuk semua hal kecuali huruf tipis.
