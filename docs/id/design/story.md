# Cerita

Blessing UI bermula dari sebuah pertanyaan. Apa yang diperlukan untuk mengubah tampilan satu situs web menjadi sistem komponen yang utuh, tanpa menyalin apa pun darinya?

## Situsnya

Situsnya adalah [saenai.tv](https://www.saenai.tv/), rumah resmi anime _Saenai Heroine no Sodatekata_. Kebanyakan situs anime ramai. Situs ini tidak. Ia memakai teks abu-abu di atas putih dan satu warna merah muda kemerahan, yang dipakai dengan hemat. Nama bagian ditulis dengan Roboto setipis rambut dalam ukuran sangat besar, didorong setengah keluar halaman seperti watermark. Tidak ada sudut yang bulat. Label dan tombol berbentuk jajaran genjang, dan semuanya miring ke arah yang sama. Hover tidak bergerak. Ia memudar. Tidak ada yang memberi bayangan buram, dan benda yang berada di atas hanya digeser. Navigasi tetap berada di seperlima kiri layar dan tidak pindah.

Situs itu terbaca seperti sistem desain yang belum pernah ditulis siapa pun. Jadi kami menuliskannya.

## Serinya

Judul yang dimiliki situs itu lebih dalam dari satu halaman web.

Logo seri ini ditulis dengan goresan yang semuanya jajaran genjang. Kemiringannya sama dan ujungnya tajam. Kemiringan itu bukan hiasan dari seorang desainer web. Ia adalah tulisan tangan waralaba itu. Musim kedua berjudul **♭**, _flat_, dan dari sinilah _Flat by design_ berasal. Logonya membawa tiga warna: merah muda, kuning jingga, dan hijau. Satu langkah lebih gelap demi kontras, ketiganya adalah aksen, `warning`, dan `success` di library ini. Kami tidak merencanakannya sebagai penghormatan. Kami menemukannya belakangan, saat memeriksa sistem terhadap sumbernya. Ini menjelaskan mengapa potongan-potongannya cocok: sejak awal mereka satu keluarga.

## Namanya

Dalam cerita, sang tokoh utama mendirikan lingkaran game doujin dan menamainya **Blessing Software**. Nama itu kemungkinan besar milik sang heroine. Karakter 恵 dibaca _Megumi_ dan berarti berkah. Seri ini tidak pernah mengatakannya terang-terangan, tetapi itulah alasan merah mudanya menjadi bawaan di sini. Library komponen adalah jenis produk yang bisa dibuat oleh lingkaran itu.

Logo lingkaran itu adalah bunga lima kelopak, satu kelopak untuk setiap anggota. Badannya lembut, dan masing-masing punya satu ujung tajam. Logo kami adalah bunga itu, digambar ulang dengan bahasa sistem. Ada lima kelopak berbentuk tetes dengan kemiringan khas, dalam warna kelima anggota. Setiap warna adalah sebuah [palet](../guide/palettes) yang bisa Anda pakai untuk seluruh library. Pendiri lingkaran duduk di tengah bunga. Warnanya juga sebuah palet, tetapi logo tetap membiarkan tengahnya kosong. Nama dan bentuknya hanya anggukan ke arah itu, tidak lebih. Lihat catatan di bagian bawah.

## Yang dipertahankan

Hal-hal ini menjadi [merek](./brand):

- Satu sudut: −10° (`--bless-lean`). Sekarang ia merespons perhatian. Tombol, tag, tab, dan isian tempat Anda mengetik miring saat hover, fokus, atau ditekan. Hanya huruf besar yang miring saat diam.
- Satu aksen di atas skala abu-abu. Merah muda sang heroine adalah bawaannya.
- Huruf tipis berukuran besar untuk suara, dan huruf kapital tebal berjarak untuk UI.
- Memudar saat hover, tidak pernah memantul. Kemunculan juga memudar, dan tidak ada yang melayang pergi.
- Pelat: apa pun yang melayang duduk di atas geseran tegas 1px berwarna aksen, tidak pernah buram.

## Yang ditambahkan

Sumbernya adalah situs pemasaran, dan sebuah library harus melakukan lebih. Semua di bawah ini milik kami:

- **Aksesibilitas.** Cincin fokus, peran ARIA pada menu, dialog, grid, dan tablist, `prefers-reduced-motion`, dan kontras AA. Untuk kontras, kami menggelapkan aksen satu langkah di mana pun ia menjadi teks. Kami memperdalam isiannya agar teks putih di atasnya mencapai 4.5:1. Kami menerangkannya untuk teks di mode gelap. Kami melakukan hal yang sama untuk merah peringatan. Situs itu tidak punya semua ini.
- **Bahasa desain.** Enam benang seri ini menjadi enam aturan: miring saat diperhatikan, warna berarti terpilih, menulis di halaman, menyatu saat berkelompok, meluap sekali saja, dan kepedulian di atas tontonan. Lihat [bahasa desain](./). Ini perbedaan terbesar dari situs itu. Merah mudanya ada pada benda yang diam. Di sini aksen hanya muncul pada apa yang dipilih seseorang.
- **Mode gelap.** Abu-abu yang sama dibalik, dengan satu pertukaran token. Huruf tipis naik satu ketebalan, karena garis tipis terlihat lebih tipis sebagai teks terang di latar gelap.
- **Token.** Setiap nilai yang ditulis mati di situs itu menjadi custom property `--bless-*`. Anda bisa menyetel ulang tampilan tanpa mengubah komponen.
- **Platform.** `<dialog>`, Popover API, `<details>`, kontrol formulir bawaan, tanggal `Intl`, dan scroll-snap. Ini bagian dari browser sendiri, diberi gaya dan tidak dibuat ulang.
- **Kanan-ke-kiri.** Properti logis di semua tempat. Kemiringan berbalik dengan arah baca.
- **Keluasan.** Situs itu memerlukan navigasi, daftar, dan modal. Library ini punya 263 komponen, dari tombol sampai tabel data sampai utas obrolan. Ia juga punya kumpulan [blok](/blocks/) siap salin. Kami memeriksa cakupannya terhadap daftar komponen [shadcn/ui](https://ui.shadcn.com/) dan [PrimeVue](https://primevue.org/), agar tidak ada yang jelas terlewat. Setiap komponen di sini adalah implementasi sendiri. Library ini tidak memakai apa pun dari kedua proyek itu.

## Yang dibengkokkan

Kami sengaja membengkokkan satu hal: kemiringan. Di situs itu, setiap pelat selalu miring. Di sini, pelat berdiri tegak saat diam. Ia hanya miring saat hover, fokus, atau ditekan. Karakter ditunjukkan kepada siapa pun yang memperhatikan. Ia bukan kostum yang dipakai semua orang. Hover tetap memudar, dan sekarang juga miring.

Sudutnya tetap persegi, juga pada bagian yang bulat di tempat lain (avatar, switch, chip, bubble obrolan, thumb). Untuk sementara bagian-bagian itu berbentuk **kelopak**, pelat miring dengan dua ujung bulat. Saat tegak dan diam, bentuk itu terbaca seperti daun, jadi bentuk tetes pindah ke logo.

Situs film waralaba ini (saenai-movie.com, 2019) menjadi lembut dua tahun setelah situs TV-nya. Ia punya tag berbentuk pil, tombol bergaris bawah, dan tanpa kemiringan. Kami mempertahankan bentuk persegi dan menjadikan kemiringan sebagai respons.

## Yang tidak diambil

Repositori ini tidak berisi logo, gambar, tekstur latar, CSS, atau JavaScript dari situs atau seri tersebut. Kami mempelajari bahasa visualnya dan menurunkannya kembali. Aset-asetnya kami biarkan di tempatnya. Data contoh di dokumentasi memakai nama karakter dan judul episode sebagai bumbu. Itu warna dari penggemar, bukan konten dari situs itu.

## Catatan

Blessing UI adalah proyek independen. Proyek ini tidak berafiliasi dengan, didukung oleh, atau terhubung dengan anime tersebut, komite produksinya, Aniplex, A-1 Pictures, penulisnya, atau penerbitnya. _Saenai Heroine no Sodatekata_, judulnya, karakter, dan gambarnya milik pemiliknya masing-masing.
