---
title: Bahasa desain
---

<Eyecatch kicker="Volume 04 · desain" title="Bahasa desain" num="04" :level="1" accent />

Blessing UI mengambil enam benang filosofis dari _Saenai Heroine no Sodatekata_ sebagai aturan desainnya. Saat diam, sebuah kontrol tenang dan tegak. Saat diperhatikan, ia miring. Pilihan mengisinya dengan warna. Kelompok menyatukannya dengan tetangganya. Di sini benang-benang itu adalah prinsip abstrak. Semuanya tidak terikat pada karakter, palet, atau warna mana pun. [Cerita](./story) menjelaskan dari mana tampilan ini berasal. [Merek](./brand) menunjukkan cara menggambarnya.

## Enam benang

Seri ini dibangun di atas enam gagasan. Beberapa karakter menjalani setiap gagasan, dan tidak ada satu karakter pun yang memilikinya sendiri:

| Benang                         | Gagasan dalam seri                                                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Seni dan cinta                 | Sebagian panggilan meminta Anda meninggalkan orang yang membentuk Anda. Seri ini menolak menyebutnya hanya pengkhianatan atau hanya keberanian. |
| Arketipe dan keaslian          | Genre adalah lemari kostum. Menjadi asli berarti menolak memakai salah satunya, dan dilihat dengan tepat oleh seseorang yang mau melihat.       |
| Kemungkinan dan komitmen       | Kisah harem hidup dari pintu-pintu yang terbuka. Tumbuh dewasa berarti akhirnya menutupnya, dan menerima kehilangan itu.                        |
| Penikmat yang menjadi pencipta | Mencintai sebuah cerita berarti menerimanya. Membuatnya berarti bertanggung jawab atasnya. Gairah harus menjadi keahlian.                       |
| Harga diri dan rasa memiliki   | Harga diri adalah baju zirah, dan zirah menahan teman di luar. Rasa memiliki bertanya apa yang kita letakkan, dan apakah itu memang diri kita.  |
| Bakat dan takut dilampaui      | Bakat mengangkat yang membawanya dan mengusik semua orang di sampingnya. Murid membalas guru dengan melampauinya.                               |

## Aturan

Setiap benang menjadi satu aturan yang ditunjukkan komponen: sebuah perilaku, sebuah bentuk, atau batas atas apa yang akan dilakukan library.

| Benang                         | Aturan                          | Di dalam library                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seni dan cinta                 | **Kepedulian di atas tontonan** | Setiap gerakan bisa disela. Gerakan dikurangi berarti instan. Aksi yang merusak lebih memilih urungkan daripada dialog konfirmasi. Kontras mengalahkan tampilan. Orang lebih merasakan aturan ini daripada melihatnya, tetapi ini tetap sebuah aturan.                                                                                                                                                                                                         |
| Arketipe dan keaslian          | **Miring saat diperhatikan**    | Kontrol berdiri tegak dan polos saat diam. Saat di-hover, difokus, atau ditekan, kontrol miring −10° (`--bless-lean`, dicerminkan di RTL). Ia menunjukkan karakternya hanya kepada orang yang berinteraksi dengannya. Isian miring selama Anda menulis di dalamnya, dan sebuah grup miring sebagai satu. Cincin fokus tetap ada, sehingga kemiringan tidak pernah menjadi satu-satunya tanda. Hanya huruf tampilan (watermark dan logo) yang miring saat diam. |
| Kemungkinan dan komitmen       | **Warna berarti terpilih**      | Hal yang diam berupa tinta dan garis tepi. Hal yang terpilih (dipilih, aktif, terbuka, ditekan, atau selesai) terisi aksen. Hover tidak pernah menambah warna. Cincin fokus dan tautan tetap memakai aksen, sehingga tetap mudah ditemukan. Letak warna di layar memberi tahu apa yang diputuskan orang itu.                                                                                                                                                   |
| Penikmat yang menjadi pencipta | **Menulis di halaman**          | Isian adalah garis tempat Anda menulis, bukan kotak untuk diisi. Garis aksen tumbuh di bawahnya saat Anda menulis. Membaca berubah menjadi menulis di tempat, jadi pakai [Inplace](/components/inplace), bukan formulir edit terpisah.                                                                                                                                                                                                                         |
| Harga diri dan rasa memiliki   | **Menyatu saat berkelompok**    | Hal yang satu kelompok berbagi satu pelat. ButtonGroup adalah satu garis tepi dan miring sebagai satu. InputGroup adalah satu isian. ToggleGroup juga satu pelat. Rentang tanggal yang terpilih adalah satu pita. Setiap bagian yang sendirian tetap punya tepinya sendiri.                                                                                                                                                                                    |
| Bakat dan takut dilampaui      | **Meluap, sekali saja**         | Pertumbuhan tampil sebagai sesuatu yang melampaui bingkainya. Watermark dan judul menggantung melewati bagiannya, dan bilah Progress yang selesai melewati jalurnya. Paling banyak satu hal meluap per layar. Jika lebih banyak yang meluap, tidak ada yang berarti lagi.                                                                                                                                                                                      |

<Demo title="Coba sendiri: hover, tekan, pilih, tulis, selesaikan">
  <DesignRules />
  <template #code>

<<< ../../demos/DesignRules.vue

  </template>
</Demo>

## Bobot

Benang-benang itu tidak setara. Judul seri ini tentang membesarkan seorang heroine yang tidak cocok dengan tipe mana pun. Ini menaruh keaslian dan penciptaan di pusatnya. Komitmen menggerakkan akhir ceritanya.

| Tingkat                     | Aturan                                            | Peran                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mengalahkan semuanya        | Kepedulian di atas tontonan                       | Saat aturan bertentangan, kepedulian yang menang. Kemiringan berhenti beranimasi saat gerakan dikurangi, kontras mengalahkan tampilan, dan urungkan mengalahkan dialog. |
| Ciri khas (setiap komponen) | Miring saat diperhatikan · Warna berarti terpilih | Dua aturan ini membuat library mudah dikenali, bahkan sebagai satu tombol di dalam tata letak orang lain.                                                               |
| Permukaan inti              | Menulis di halaman                                | Setiap input. Orang yang memakai library UI sendiri sedang membuat sesuatu.                                                                                             |
| Dipakai secukupnya          | Menyatu saat berkelompok · Meluap, sekali saja    | Pakai hanya di tempat yang strukturnya memintanya. Jika tidak, keduanya menjadi tontonan dan melanggar kepedulian di atas tontonan.                                     |

## Tombol

Warna berarti terpilih juga berlaku untuk tombol utama. Tombol utama yang diam adalah pilihan yang ditawarkan halaman. Ia bukan pilihan yang dibuat orang itu. Jika Anda mewarnainya, Anda memilih untuk orang itu. Ajakan bertindak yang penuh warna adalah jenis kostum siap pakai yang ditolak oleh benang keaslian.

| Tombol | Saat diam                | Hover                | Fokus                     | Ditekan      |
| ------ | ------------------------ | -------------------- | ------------------------- | ------------ |
| Utama  | isian tinta penuh, tebal | memudar, miring −10° | miring −10°, cincin aksen | terisi aksen |
| Kedua  | garis tepi tinta         | memudar, miring −10° | miring −10°, cincin aksen | terisi aksen |

Tombol utama menonjol lewat bobotnya (penuh lawan garis tepi), bukan lewat warna.

## Bentuk {#shape}

Satu bentuk: pelat tegak dengan garis tepi utuh dan persegi, untuk semua hal dari tombol sampai avatar. Kemiringan membawa identitasnya, bukan sudutnya. Bentuk tetes ada di [logo](./brand#mark). [Konvensi](../guide/conventions#shape) menunjukkan aturan ini dalam praktik.

## Gerak {#motion}

Gerak mengikuti serinya dalam tiga lapis. Sebagian besar adegan seri ini tenang, jadi lapis dasar adalah naik yang lembut saat sebuah bagian muncul. Gim dalam cerita berbicara lewat kotak teks, jadi bagian yang berbicara kepada orang (dialog, toast, tooltip) datang dengan hentakan, seperti kotak teks. Adegan komedi adalah jeda singkat, jadi lapis flair (meletup, bergoyang) hanya menyala dengan `data-flair`. Kepedulian di atas tontonan menetapkan batasnya. Gerak tenang hanya memudar, dan gerakan dikurangi di sistem mematikan semua gerak. [Panduan gerak](../guide/motion) menunjukkan token dan kelasnya.

## Isi lain volume ini

<ChapterCards :items="[
  { title: 'Merek', text: 'Logo, wordmark, dan unsur yang dipakai setiap bagian.', link: '/id/design/brand' },
  { title: 'Cerita', text: 'Dari mana tampilan ini berasal, dan apa yang kami tambahkan.', link: '/id/design/story' },
  { title: 'Jenis situs', text: '18 jenis situs, dan bagian yang melayani tiap jenis.', link: '/id/design/site-types' },
  { title: 'Kredit', text: 'Sumber, standar, dan alat yang kami pakai.', link: '/id/design/credits' },
]" />

<script setup>
import DesignRules from "../../demos/DesignRules.vue";
</script>
