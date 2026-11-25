---
title: Bahasa desain
---

<Eyecatch kicker="Volume 04 · desain" title="Bahasa desain" num="04" :level="1" accent />

Blessing UI mengambil enam benang filosofis dari _Saenai Heroine no Sodatekata_ sebagai aturan desainnya. Saat diam, sebuah kontrol tenang dan tegak. Perhatian mengangkatnya lembut; pilihan mengisinya dengan warna; label dan pelat nama membawa kemiringan −10°; kelompok menyatu dengan tetangganya. Di sini benang-benang itu adalah prinsip abstrak. Semuanya tidak terikat pada karakter, palet, atau warna mana pun. [Cerita](./story) menjelaskan dari mana tampilan ini berasal. [Merek](./brand) menunjukkan cara menggambarnya.

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
| Arketipe dan keaslian          | **Miring saat diperhatikan**    | Kontrol pil berdiri tegak saat diam dan merespons dengan geser nada aman-AA serta angkat lembut (`--bless-hover-lift`) saat di-hover tanpa memiringkan bentuk pilnya. Kemiringan khas −10° (`--bless-lean`, dicerminkan di RTL) khusus dipakai pada label aplikasi persegi, eyecatch, pelat nama pembicara, dan pelat berkelompok agar tetap terbaca dan khas. Cincin fokus tetap ada, sehingga gerak tidak pernah menjadi satu-satunya tanda. |
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

| Tombol | Saat diam                | Hover (≥ 4.5:1 AA)          | Fokus         | Ditekan      |
| ------ | ------------------------ | --------------------------- | ------------- | ------------ |
| Utama  | pil tinta penuh, tebal   | geser nada + naik pegas     | cincin aksen  | terisi aksen |
| Kedua  | pil permukaan bergaris   | isian lembut + naik pegas   | cincin aksen  | terisi aksen |

Tombol utama menonjol lewat bobotnya (penuh lawan garis tepi), bukan lewat warna. Hover tidak lagi memudarkan kontras dengan `opacity: 0.6`.

## Bentuk, suasana, dan cahaya {#shape}

Kartu dan panel memakai sudut lembut (`--bless-radius: 14px`) dengan elevasi `surface` tanpa garis tepi ("Cahaya, bukan garis"). Tombol, switch, chip, dan lencana sapuan lembut berbentuk pil bulat tanpa miring (`--bless-radius-pill`), dan isian adalah garis bawah naskah datar `0px` ("Menulis di halaman"). Kemiringan −10° (`--bless-lean`) khusus untuk label aplikasi persegi, eyecatch, dan pelat nama `BlessNovelBox`. Tiga suasana—**Daylight** porselen hangat, **Senja** keemasan, dan **Night** kobalt berbintang—mengatur kertas dan cahaya, dipadukan dengan tiga suara tipografi (sans UI, `--bless-font-serif`, dan monospace tabular) sementara enam palet memberi warna aksen. Bentuk tetes ada di [logo](./brand#mark). [Konvensi](../guide/conventions#shape) menunjukkan tokennya dalam praktik.

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
