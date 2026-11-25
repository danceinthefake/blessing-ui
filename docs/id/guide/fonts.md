# Font

Blessing UI memakai tiga suara tipografi:

1. **Sans UI (`--bless-font-sans`)**: `"Plus Jakarta Sans", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif`
2. **Serif editorial (`--bless-font-serif`)**: `"Newsreader", "Iowan Old Style", "Palatino Linotype", Georgia, serif` — dipakai untuk judul hero, tajuk artikel, kutipan, dan dialog `BlessNovelBox`.
3. **Monospace tabular (`--bless-font-mono`)**: `ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace` — dipakai untuk waktu, telemetri, dan label volume.

Muat **Plus Jakarta Sans** (ketebalan 400, 500, 600, 700) dan **Newsreader** (reguler 400 + italic 400). `--bless-font-weight-thin` bergeser dari 100 di Daylight ke 300 di Night agar watermark tampilan tetap terbaca di latar malam.

<Demo title="Tiga suara tipografi">
  <FontsWeights />
  <template #code>

<<< ../../demos/FontsWeights.vue

  </template>
</Demo>

Library tidak menyertakan font, jadi Anda memuatnya sendiri (lewat Google Fonts atau host sendiri dengan Fontsource).

## Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

Dua baris `preconnect` itu penting: tanpanya, tampilan pertama menunggu koneksi baru ke dua host.

## Huruf Jepang

Susunan font sudah jatuh ke Hiragino (macOS dan iOS) dan Meiryo (Windows). Setiap pembaca Jepang punya salah satunya. Noto Sans JP untuk Linux, Android, dan tampilan yang seragam. Dari Google Fonts, biayanya kecil karena hurufnya dipecah menjadi potongan `unicode-range` kecil. Sebagai file utuh yang Anda host sendiri, ukurannya sekitar 1–2 MB untuk dua ketebalan—pangkas hurufnya, atau biarkan font sistem membawa teks Jepang di Mac dan Windows.

## Host sendiri

Jalan terpendek adalah [Fontsource](https://fontsource.org), yang mengemas file WOFF2 variabel tanpa permintaan jaringan eksternal:

```sh
pnpm add @fontsource-variable/plus-jakarta-sans @fontsource-variable/newsreader
```

```ts
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/newsreader";
```

Lalu arahkan token ke nama keluarga variabelnya (atau biarkan nama bawaan jika Anda memakai paket non-variabel `@fontsource/plus-jakarta-sans` dan `@fontsource/newsreader`):

```css
:root {
  --bless-font-sans: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
  --bless-font-serif: "Newsreader Variable", "Newsreader", Georgia, serif;
}
```

`font-display: swap` menjaga teks tetap terlihat selama file datang. Tanpa font kustom, susunannya jatuh rapi ke sans sistem dan Georgia.

<script setup>
import FontsWeights from "../../demos/FontsWeights.vue";
</script>
