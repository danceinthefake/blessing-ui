---
title: Kanan-ke-kiri
---

# Kanan-ke-kiri

```html
<html dir="rtl" lang="ar"></html>
```

Atur `dir="rtl"` di `<html>` atau di bagian mana pun, dan library mengikutinya. Tata letaknya memakai properti logis di semua tempat (`inline-start` / `inline-end`, `text-align: start`). Label, tepi aksen, badge, imbuhan input, dan tag kartu tercermin tanpa kelas tambahan. Kemiringan ikut berbalik dengan arah baca. `--bless-lean` didefinisikan ulang di bawah `[dir="rtl"]`. Sudut kelopak juga, tetapi hanya setelah Anda menyalakannya. Tidak ada yang miring saat diam, jadi arahkan kursor ke kontrol di demo untuk melihatnya miring ke arah lain. Badge mengambil arah dari teksnya sendiri, sehingga "NEW!" berhuruf Latin tetap utuh di dalam teks Arab. Tombol ← dan → di tab, menu, carousel, tree, dan stepper mengikuti urutan baca, bukan arah fisik panah. Carousel bergulir dari awal inline-nya. Prop sudut (`position="top-end"` di watermark, indikator, toast, dan tombol kembali ke atas) dan speed dial juga mengikuti arah baca.

Atur juga `lang`. Atribut ini menentukan pilihan font dan pemenggalan kata. `useTheme()` tidak mengatur arah. Arah adalah urusan lapisan i18n Anda, yang tahu bahasanya. Untuk mencoba seluruh situs dengan cara ini, jalankan `document.documentElement.dir = "rtl"` di konsol devtools.

<Demo title="Balikkan">
  <RtlBasic />
  <template #code>

<<< ../../demos/RtlBasic.vue

  </template>
</Demo>

## Yang tetap fisik

Apa pun yang Anda _sebut_ dengan satu sisi tetap di sisi itu. Ini janji dari prop tersebut, bukan bawaan tata letak:

- `placement="left"` di popover, tooltip, dropdown, dan hover card
- laci `left` / `right` di `BlessLayout` dan `BlessStage`, serta `side` di `BlessSheet`

Jika tata letak RTL Anda memerlukan sisi lain, berikan sisi yang lain.

## Font

`--bless-font-sans` berisi Roboto dan Noto Sans JP. Untuk Arab atau Ibrani, tambahkan font aksara itu di depan dalam pengganti Anda, misalnya `--bless-font-sans: "Noto Sans Arabic", Roboto, …`. Ukuran yang berdasar metrik tetap sama. Label huruf kapital yang berjarak aman. Browser tidak memberi jarak pada aksara bersambung, sehingga huruf Arab tetap tersambung.

<script setup>
import RtlBasic from "../../demos/RtlBasic.vue";
</script>
