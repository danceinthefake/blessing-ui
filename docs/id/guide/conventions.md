# Konvensi

Apa yang berlaku di semua 442 komponen. Jika sebuah komponen melanggar salah satu aturan ini, itu bug.

## API

- **Nama.** Pakai awalan `Bless` dan satu komponen per file: `BlessButton` di `src/components/BlessButton.vue`. Export-nya bernama. Tidak ada plugin yang perlu dipasang, dan tidak ada yang global.
- **Prop menerima key token, tidak pernah nilai mentah.** Misalnya: `color="accent"`, `size="sm"`, `weight="thin"`. Jika Anda ingin warna yang bukan token, tambahkan tokennya.
- **`v-model` untuk keadaan utama.** Model bernama mencakup sisanya: `v-model:open` (dialog, popover, laci), `v-model:step`, `v-model:selected`, `v-model:collapsed`, dan `v-model:left` / `:right` di layout.
- **Event.** `update:*` ada untuk setiap model. Apa pun yang mendaftar hal yang bisa dinavigasi (nav, menu, tree, daftar) memancarkan `select(item, event)`. Jika Anda mengatur rute sendiri, panggil `preventDefault()` pada event itu. Atau [berikan tautan router](./install#with-a-router) dan jangan memanggilnya. Event siklus hidupnya adalah `close`, `cancel`, `confirm`, `finish`, dan `submit`. `close` menyembunyikan panel yang bisa dibuka lagi. `dismiss` menghapus pemberitahuan (alert, banner). `finish` muncul saat kerja sebuah bagian selesai: langkah terakhir, digit terakhir, akhir animasi.
- **Boolean.** Prop boolean menyebut apa yang dinyalakannya, tidak pernah `no…`. Untuk mematikan bagian yang menyala secara bawaan, berikan `false`, misalnya `:addable="false"`.
- **Slot lebih dulu daripada render prop.** Nama yang berulang: `#prefix` / `#suffix` (ikon di samping teks), `#title`, `#media`, `#actions`, `#footer`, `#icon`, `#trigger` (benda tempat popover berlabuh). Slot dengan nama yang sama berarti tempat yang sama di setiap komponen.

## CSS

- **CSS global, dengan namespace lewat kelas.** Tanpa `<style scoped>`, tanpa shadow DOM, tanpa CSS-in-JS, tanpa ketergantungan Tailwind. Kelasnya `bless-<component>`, bagiannya `bless-<component>__<part>`, modifier-nya `bless-<component>--<modifier>`.
- **Ganti dengan selector biasa.** Tanpa `:deep` dan tanpa `!important`:

  ```css
  .bless-button {
    letter-spacing: 0.2em;
  }
  ```

- **Atau ganti token di satu bagian** untuk mengubah nilai, bukan aturan:

  ```css
  .dense-table {
    --bless-lean: 0deg; /* no lean in a dense grid */
    --bless-space-3: 8px;
  }
  ```

- Stylesheet setiap komponen terikat pada modulnya, sehingga mengimpor komponen juga mengimpor CSS-nya. `blessing-ui/style.css` adalah keseluruhannya. Pakai untuk memuat CSS sekali.

## Aksesibilitas

- **Elemen bawaan lebih dulu.** Pakai `<button>`, `<dialog>`, `<details>`, `<select>`, `<input type=range|date|time|color|file>`, dan Popover API. Platform harus benar-benar tidak punya bagiannya sebelum Anda menulis pembungkus.
- **Peran dan nama pada semua yang majemuk**: menu, listbox, tablist, grid, tree, dialog, switch, dan slider. Setiap kontrol yang hanya berisi ikon punya `aria-label`. Setiap isian terhubung ke labelnya (`BlessField` melakukannya untuk Anda).
- **Kata bawaan bisa diganti.** Prop `labels` memberi teks yang diucapkan komponen untuk Anda, misalnya tombol, petunjuk, dan pengumuman pembaca layar. Prop ini `Partial`, sehingga Anda hanya mengganti yang perlu. Pesan yang membawa angka atau nama adalah fungsi dari keduanya: `:labels="{ grabbed: (i, n) => `Diambil ${i} dari ${n}` }"`. Untuk mengganti kata banyak komponen sekaligus, pakai [paket label](./translating).

  Setiap komponen yang mengucapkan kata sendiri mengambilnya dari `labels`. Ini termasuk satu kata, misalnya tombol tutup Modal (`labels.close`). Ini juga termasuk pesan yang berupa fungsi dari nama atau angka, misalnya `labels.remove` (Combobox, FileInput) dan `labels.page` (Pagination).

  Kata awal sebuah komponen adalah prop biasa dengan nilai bawaan itu, sehingga tidak perlu entri `labels`. Prop itu adalah `label`, `placeholder`, dan `emptyText`. Keadaan kosong DataView dan SwipeDeck juga menerima `labels.empty` (atau slot `#empty`).

- **Keyboard**: tombol panah bergerak di dalam komponen majemuk (tab, menu, tree, grid, carousel, langkah). Tombol ← dan → mengikuti arah baca di RTL. `Home` dan `End` melompat ke item pertama dan terakhir. `Esc` menutup apa pun yang melayang. `Enter` dan `Space` mengaktifkan. Cincin fokusnya `2px` aksen dengan `outline-offset: 2px`, hanya pada `:focus-visible`.
- **Kontras**: token teks minimal 4.5:1 di atas `bg` dan `surface` di kedua tema. Isian yang membawa teks juga membawanya minimal 4.5:1 (accent, badge, info, danger). `prefers-reduced-motion` mengatur setiap durasi menjadi nol.

## Kepedulian {#care}

Kepedulian mengalahkan setiap aturan lain di sini. Jika tampilan dan kepedulian berbeda pendapat, kepedulian yang menang ([bahasa desain](../design/)).

- **Gerakan selalu bisa disela.** Transisi berbalik dari posisinya saat itu. Tidak ada yang menunggu animasi selesai sebelum merespons. Apa pun yang bergerak sendiri berhenti untuk orangnya. Putar otomatis carousel berhenti saat hover dan fokus. Toast berhenti selama pointer atau fokus ada di atasnya. Splash terlewati dengan klik atau `Esc`.
- **Gerakan dikurangi berarti instan.** Durasi menjadi `0s`. Gerakan dari skrip (gulir halus, putar otomatis, animasi tinggi, splash) memeriksa `reducedMotion()` dan melewatinya. Kedua pembantu diekspor untuk kode Anda sendiri. Saat orang meminta gerakan yang lebih sedikit, `reducedMotion()` bernilai `true`. `scrollBehavior()` mengembalikan `"smooth"` atau `"auto"` sesuai itu: `el.scrollTo({ top: 0, behavior: scrollBehavior() })`.
- **Kontras mengalahkan tampilan.** Lihat baris kontras di bawah Aksesibilitas. Jika sebuah palet tidak bisa memenuhinya, palet itu mengganti token teksnya. Aturannya tetap.
- **Urungkan lebih dulu daripada konfirmasi.** Agar sebuah aksi bisa dibatalkan, jalankan aksinya dan tawarkan **Urungkan** di [toast](/components/toaster). Simpan [dialog konfirmasi](/components/alert-dialog) untuk hal yang tidak bisa ditarik kembali.

## Aturan desain

Enam aturan [bahasa desain](../design/), sebagaimana tampil di library, lalu sisa tampilannya.

- **Kemiringan khas, kontrol tetap tegak.** Tombol pil, toggle, chip, dan isian garis bawah berdiri tegak saat diam maupun saat di-hover/fokus, merespons dengan geser nada aman-AA, isian hover lembut (`--bless-color-hover`), dan angkat pegas halus (`--bless-hover-lift`, menjadi `0px` pada gerakan dikurangi/tenang). Kemiringan khas −10° (`--bless-lean`, dicerminkan di RTL) khusus dipakai pada label aplikasi persegi, eyecatch, pelat nama `BlessNovelBox`, `BlessSkew`, dan watermark tampilan.
- **Warna berarti terpilih.** Hal yang diam berupa tinta dan garis tepi. Aksen hanya muncul pada hal yang terpilih, aktif, terbuka, ditekan, atau selesai. Contohnya kotak yang dicentang, tab saat ini, dan bagian bilah progres yang terisi. Cincin fokus tetap aksen. Tombol utama berupa tinta penuh dan terisi aksen saat ditekan. Prop `color="accent"` tetap tersedia untuk pengguna, tetapi library tidak pernah memakainya sebagai bawaan saat diam.
- **Menyatu saat berkelompok.** Hal yang satu kelompok berbagi satu pelat. ButtonGroup menyatukan tepi luarnya; InputGroup adalah satu isian; ToggleGroup berbagi garis tepi; rentang tanggal yang terpilih adalah satu pita. Setiap bagian yang sendirian tetap punya tepinya sendiri.
- **Meluap, sekali saja.** Pertumbuhan tampil sebagai sesuatu yang melampaui bingkainya: watermark dan judul menggantung melewati bagiannya, bilah Progress yang selesai melewati jalurnya. Paling banyak satu hal meluap per layar, atau ia tidak lagi berarti apa-apa.
- **Menulis di halaman.** Isian adalah garis datar ber-radius `0px` tempat Anda menulis, bukan kotak untuk diisi. Ia transparan dengan garis bawah tipis, dan garis aksen tumbuh di bawahnya saat Anda menulis. Membaca berubah menjadi menulis di tempat—pakai [Inplace](/components/inplace), bukan formulir edit terpisah.
- **Hover aman-AA, tidak pernah memudar.** Hover tidak lagi menurunkan kontras dengan `opacity: 0.6` (`--bless-hover-opacity: 1`). Kontrol interaktif menggeser nada atau latar lembut (`--bless-color-hover` / `--bless-color-surface-2`) dan terangkat halus (`--bless-hover-lift`). Kemunculan mengikuti tiga lapis [gerak](./motion): naik lembut untuk sebagian besar, sibakan kotak teks untuk bagian yang berbicara, dan flair yang bisa dipilih.
- **Cahaya, bukan garis.** Kartu dan panel melayang tanpa garis tepi di atas kertas porselen terang (`Daylight`), amber (`Senja`), atau kobalt berbintang (`Night`) dengan bayangan lembut bernuansa tinta (`--bless-shadow-sm` / `--bless-shadow-plate`), sementara kaca buram (`--bless-color-surface-glass`) dipakai untuk kotak dialog seperti `BlessNovelBox`.
- **Tiga suara tipografi**: **Plus Jakarta Sans** (`--bless-font-sans`) huruf normal untuk UI, **Newsreader** (`--bless-font-serif`) untuk judul editorial, kutipan, dan dialog, serta monospace tabular (`--bless-font-mono`) untuk waktu dan metadata.

## Bentuk {#shape}

Geometri lembut yang disesuaikan dengan peran tiap elemen:

- `--bless-radius: 14px` — kartu, panel, dialog, dan popover.
- `--bless-radius-plate: 6px` — pelat persegi miring (label aplikasi, pelat nama `BlessNovelBox`, tooltip).
- `--bless-radius-pill: 999px` — tombol, switch, chip, dan lencana sapuan lembut.
- `--bless-petal: 999px` — avatar bulat, potret, tombol radio, knob, dan cincin progres.
- `0px` — isian garis bawah naskah (`BlessInput`, `BlessTextarea`, `BlessSelect`, dsb.).

Atur keempat token radius ke `0` jika Anda ingin kembali ke pelat persegi tajam. Bentuk tetes milik [logo](../design/brand#mark).

Lihat [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) untuk peta jalan dan alasan di balik setiap fase.
