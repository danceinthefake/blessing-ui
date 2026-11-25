# Token

Semua gaya membaca custom property `--bless-*` dari `tokens.css`. Jumlahnya 91. Untuk mengganti tema seluruh aplikasi, ganti nilainya di `:root`. Untuk mengganti nilai tertentu di satu bagian, ganti di bagian itu. Palet dan mode gelap tetap berlaku untuk seluruh aplikasi, karena keduanya diatur lewat atribut di `<html>`.

```css
:root {
  --bless-lean: -6deg; /* a gentler lean */
  --bless-font-sans: "Inter", system-ui, sans-serif;
}
```

Untuk mengganti aksen, pilih sebuah [palet](./palettes) atau definisikan palet lengkap. Aksen adalah satu keluarga (`accent`, `accent-text`, `accent-soft`, `accent-2`, `badge`, `chart-1`) dengan aturan kontras. Jika Anda hanya mengganti `accent`, sisanya tetap memakai merah muda Megumi.

<Demo title="Token warna, langsung: ganti tema atau palet di navigasi">
  <TokenSwatches />
</Demo>

| Grup               | Prop                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Warna              | `--bless-color-{text,text-muted,bg,surface,surface-glass,surface-2,watermark,accent,accent-soft,accent-2,accent-text,danger,danger-text,badge,warning,success,info,info-text,on-accent,on-text,on-light,border,hover,rule,backdrop,media-bg,chart-1..5}`, `--bless-light`, `--bless-sky`, `--bless-edge` |
| Font               | `--bless-font-sans`, `--bless-font-serif`, `--bless-font-mono`, `--bless-font-weight-{thin,light,normal,medium,bold}`                                                                                                               |
| Skala huruf        | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}`: `clamp()` yang lentur, 8→151px. `headline` adalah judul halaman yang menggantung (36–73px). `display` adalah watermark                                                         |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                                                  |
| Jarak              | `--bless-space-{1,2,3,4,6,8,12,16}`: dasar 4px                                                                                                                                                                                       |
| Bentuk             | `--bless-lean`, `--bless-skew`, `--bless-skew-counter`, `--bless-radius` (`14px`), `--bless-radius-plate` (`6px`), `--bless-radius-pill` (`999px`), `--bless-petal` (`999px`), `--bless-border-width`, `--bless-dash-width`          |
| Elevasi            | `--bless-shadow-sm`, `--bless-shadow-plate`, `--bless-shadow-art`, `--bless-shadow-none`. `--bless-shadow-md` adalah alias dari plate                                                                                                |
| Gerak              | `--bless-duration-{fast,base,slow,slower,enter,voice,flair,draw}`, `--bless-ease-{in-out,out,soft,snap,pop,spring,linear}`, `--bless-hover-opacity` (`1`), `--bless-hover-lift` (`-1.5px`), `--bless-press-scale`, `--bless-lean-transition` |
| Tata letak         | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`, `--bless-safe-{top,right,bottom,left}` (`env(safe-area-inset-*)`, untuk notch)                                                  |

Durasi menjadi `0s` dan `--bless-hover-lift` menjadi `0px` saat `prefers-reduced-motion` aktif.

## Yang dibalik, yang ditukar {#what-flips-what-swaps}

- **[Suasana & mode gelap](./dark-mode)** mendefinisikan ulang kertas, langit, dan tinta untuk **Senja** (`data-theme="golden"`) dan **Night** (`data-theme="dark"`): `text`, `text-muted`, `bg`, `surface`, `surface-glass`, `surface-2`, `watermark`, `border`, `hover`, `rule`, `backdrop`, `light`, `sky`, `edge`, `danger`, `danger-text`, `info-text`, `accent-text`, `chart-2..5`, dan `font-weight-thin`. Keluarga aksen tidak berubah.
- **Sebuah [palet](./palettes)** hanya menukar keluarga aksen: `accent`, `accent-soft`, `accent-2`, `accent-text`, `badge`, `chart-1`. Kertas, langit, huruf, dan geometri tetap.
- **[Kanan-ke-kiri](./rtl)** mencerminkan `lean` dan tepi logis.

## Bentuk {#shape}

Lihat [Konvensi](./conventions#shape). `--bless-radius` (`14px`) melembutkan kartu dan popover, `--bless-radius-pill` (`999px`) membulatkan tombol, switch, chip, dan lencana sapuan lembut, `--bless-radius-plate` (`6px`) membentuk label persegi miring dan pelat nama `BlessNovelBox`, serta `--bless-petal` (`999px`) membulatkan avatar dan potret. Isian garis bawah tetap datar (`0px`). `--bless-lean` (`-10deg`, dicerminkan di RTL) khusus dipakai untuk label persegi, eyecatch, pelat nama, watermark, dan pelat `.bless-lean` eksplisit. Untuk mematikan sudut bulat atau kemiringan, ganti tokennya ke `0` / `0deg`.

## Pasangan warna {#color-pairs}

- `accent-text`: aksen **sebagai teks** di atas `bg` atau `surface`. Warnanya digelapkan per palet sampai minimal 4.5:1 (tautan, navigasi aktif, baris terpilih). Isian memakai `accent`, yang diperdalam per palet agar teks putih di atasnya mencapai 4.5:1. Sebagai teks di halaman, `accent` terlalu terang, jadi pakai `accent-text`.
- **Janji aksen**, untuk palet buatan Anda: `accent` harus membawa teks putih pada 4.5:1, dan `accent-text` harus mencapai 4.5:1 di atas `bg` dan `surface` di kedua tema.
- `badge`: dipakai oleh `BlessBadge color="badge"` dan angka notifikasi. Ia satu langkah dari keluarga aksen, sehingga warnanya ikut palet dan membawa teks putih pada 4.5:1. Badge secara bawaan berwarna tinta.
- `danger` / `danger-text`: `danger` adalah isian (tombol yang merusak, tepi yang tidak valid). `danger-text` adalah teks pesan galat, minimal 4.5:1 di atas `bg` dan `surface`. Di mode terang keduanya merah yang sama. Mode gelap menaikkan teksnya satu langkah, agar tetap terbaca di abu-abu gelap. Satu merah tidak bisa melakukan kedua tugas di sana.
- `info` / `info-text`: pembagian yang sama. `info-text` untuk info sebagai teks (badge outline, judul alert).
- `on-accent`: teks di atas isian aksen, danger, atau info (putih).
- `on-text`: teks di atas isian `--bless-color-text`. Nilainya sama dengan `bg`, sehingga ikut terbalik dengan tema.
- `on-light`: teks di atas isian warning dan success, yang terlalu pucat untuk teks putih.
- `chart-1..5`: seri kategori. Semuanya minimal 3:1 di atas `bg` dan `surface` di kedua tema.

## Tailwind v4

Token adalah custom property biasa, sehingga bisa masuk ke `@theme` Tailwind. Hasilnya menjadi utility (`bg-accent`, `text-text`, `border-border`, dan lainnya). Blessing sendiri tidak bergantung pada Tailwind.

```css
@theme {
  --color-accent: var(--bless-color-accent);
  --color-text: var(--bless-color-text);
  --color-border: var(--bless-color-border);
}
```

<script setup>
import TokenSwatches from "../../demos/TokenSwatches.vue";
</script>
