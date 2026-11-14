# Palet

<script setup>
import { BlessPaletteToggle } from "blessing-ui";
import PaletteRetint from "../../demos/PaletteRetint.vue";
</script>

Secara bawaan, aksennya adalah merah muda Megumi. Lima keluarga aksen lain hanya sejauh satu tombol: kelopak lain dari logo, dan satu di tengahnya. Masing-masing dinamai menurut anggota lingkaran yang memberi nama pada library ini (lihat [cerita](../design/story)). Palet hanya menukar keluarga aksen. Abu-abu, huruf, dan geometri tetap sama, dan mode gelap bekerja di atasnya.

<div style="margin:16px 0"><BlessPaletteToggle /></div>

<Demo title="Semua yang terpilih ikut berganti warna, tekan juga tombolnya">
  <PaletteRetint />
  <template #code>

<<< ../../demos/PaletteRetint.vue

  </template>
</Demo>

Kelopak adalah warna sang karakter. Logo dan contoh warna memakainya. Isian memakai `accent`, yaitu kelopak yang diperdalam secukupnya agar teks putih mencapai 4.5:1. Teks memakai `accent-text`, potongan yang lulus 4.5:1 di atas latar pada tiap tema. Teks termasuk item navigasi aktif, tautan, dan baris terpilih.

| Palet     | Kelopak                                                                                                                                   | Aksen     | Teks      | Teks (gelap) | Catatan                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | ------------ | ------------------------------------------------------------------------------------- |
| `megumi`  | <span style="display:inline-block;width:14px;height:14px;background:#e85078;border:1px solid var(--bless-color-border)"></span> `#e85078` | `#cc466a` | `#b63c5c` | `#e95b80`    | kelopak atas: bawaan, tanpa atribut                                                   |
| `utaha`   | <span style="display:inline-block;width:14px;height:14px;background:#e03028;border:1px solid var(--bless-color-border)"></span> `#e03028` | `#e03028` | `#c62b23` | `#e7625c`    | kelopak kanan: merah                                                                  |
| `izumi`   | <span style="display:inline-block;width:14px;height:14px;background:#4090d0;border:1px solid var(--bless-color-border)"></span> `#4090d0` | `#367ab1` | `#306d9d` | `#63a6db`    | kelopak kanan bawah: biru langit                                                      |
| `michiru` | <span style="display:inline-block;width:14px;height:14px;background:#b878b0;border:1px solid var(--bless-color-border)"></span> `#b878b0` | `#996492` | `#885882` | `#b878b0`    | kelopak kiri bawah: ungu muda                                                         |
| `eriri`   | <span style="display:inline-block;width:14px;height:14px;background:#c8e018;border:1px solid var(--bless-color-border)"></span> `#c8e018` | `#6b7e00` | `#5f7000` | `#a3bf0a`    | kelopak kiri: `#c8e018` terlalu pucat untuk teks putih, jadi ia menjadi `accent-soft` |
| `tomoya`  | <span style="display:inline-block;width:14px;height:14px;background:#5870f8;border:1px solid var(--bless-color-border)"></span> `#5870f8` | `#546aec` | `#4a5dcf` | `#6f84f9`    | milik sang pendiri: nila, tidak ada di logo                                           |

## Pemakaian

```html
<html data-palette="utaha"></html>
```

```ts
import { useTheme, blessPalettes } from "blessing-ui";
const { palette, setPalette } = useTheme(); // persisted in localStorage("bless-palette")
setPalette("izumi");
setPalette("megumi"); // back to the default
```

`BlessPaletteToggle` adalah kontrol yang siap pakai. Ia menampilkan satu contoh warna per palet dan mengatur `aria-pressed` pada yang aktif.

Library menerapkan pilihan yang tersimpan setelah hidrasi, seperti tema. Di halaman statis atau hasil render server, ini menyisakan satu frame palet bawaan. Untuk menghindarinya, atur atributnya di `<head>`. [Skrip anti-kedip](./dark-mode#no-flash-on-load) menangani kedua kunci.

## Token yang diatur tiap palet

Token berikut membentuk sebuah palet: `--bless-color-accent`, `-accent-soft`, `-accent-2`, `-accent-text`, `-badge`, dan `-chart-1`. `accent-text` di mode gelap juga dinaikkan sampai 4.5:1 di atas abu-abu gelap. Untuk menyetel palet, ganti token mana pun setelah `tokens.css`.

Palet buatan Anda adalah blok `[data-palette="…"]` baru dengan token-token itu, dengan tetap memegang [janji aksen](./tokens#color-pairs): `accent` membawa teks putih pada 4.5:1, dan `accent-text` mencapai 4.5:1 di atas `bg` dan `surface` di kedua tema. Atur sendiri atributnya di `<html>`.

```css
:root[data-palette="kato"] {
  --bless-color-accent: #b0406a; /* fills: white text on it ≥ 4.5:1 */
  --bless-color-accent-text: #a13a61; /* text on bg/surface ≥ 4.5:1 (light) */
  --bless-color-accent-soft: #f2b3c8; /* highlights */
  --bless-color-accent-2: #d06088; /* hover step */
  --bless-color-badge: #b0406a; /* BlessBadge color="badge" */
  --bless-color-chart-1: #b0406a;
}
/* dark greys need a lighter text cut (repeat under @media (prefers-color-scheme: dark) if you follow the OS) */
:root[data-palette="kato"][data-theme="dark"] {
  --bless-color-accent-text: #ec7aa2;
}
```

`setPalette()` dan `BlessPaletteToggle` hanya mengenal enam palet bawaan (`blessPalettes`). Palet buatan tidak muncul di tombol pilihan dan tidak bertahan setelah `setPalette` dipanggil.
