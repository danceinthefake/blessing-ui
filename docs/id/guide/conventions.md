# Konvensi

Apa yang berlaku di semua 389 komponen. Jika sebuah komponen melanggar salah satu aturan ini, itu bug.

## API

- **Nama.** Pakai awalan `Bless` dan satu komponen per file: `BlessButton` di `src/components/BlessButton.vue`. Export-nya bernama. Tidak ada plugin yang perlu dipasang, dan tidak ada yang global.
- **Prop menerima key token, tidak pernah nilai mentah.** Misalnya: `color="accent"`, `size="sm"`, `weight="thin"`. Jika Anda ingin warna yang bukan token, tambahkan tokennya.
- **`v-model` untuk keadaan utama.** Model bernama mencakup sisanya: `v-model:open` (dialog, popover, laci), `v-model:step`, `v-model:selected`, `v-model:collapsed`, dan `v-model:left` / `:right` di layout.
- **Event.** `update:*` ada untuk setiap model. Apa pun yang mendaftar hal yang bisa dinavigasi (nav, menu, tree, daftar) memancarkan `select(item, event)`. Jika Anda mengatur rute sendiri, panggil `preventDefault()` pada event itu. Atau [berikan tautan router](./install#with-a-router) dan jangan memanggilnya. Event siklus hidupnya adalah `close`, `cancel`, `confirm`, `finish`, dan `submit`.
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

  Komponen-komponen ini punya prop `labels`:

  - Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList, PickList, Marquee, Uploader.
  - Editor (per key alat), Stepper, Tour, SwipeDeck, Questionnaire, ThemeToggle, InfiniteCanvas, NodeGraph, Treemap.

  Kata awal sebuah komponen adalah prop biasa dengan nilai bawaan itu, sehingga tidak perlu entri `labels`. Prop itu adalah `label`, `placeholder`, dan `emptyText`. Keadaan kosong DataView dan SwipeDeck juga menerima `labels.empty` (atau slot `#empty`).

  Satu string punya prop sendiri: `clearLabel` (DatePicker), `dotsLabel` (Carousel), `label` (LoadingBar), dan `errorText` (Attachment). Fungsi dari nama atau angka juga punya prop sendiri: `removeLabel` (Combobox, FileInput), `pageLabel` (Pagination), dan `goLabel` (Steps).

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

- **Miring saat diperhatikan.** Pelat berdiri tegak saat diam. Saat di-hover, difokus, atau ditekan, pelat miring ke `--bless-lean` (−10°, dicerminkan di RTL). Isian miring selama Anda menulis di dalamnya. Sebuah grup miring sebagai satu. Cincin fokus tetap ada, sehingga kemiringan tidak pernah menjadi satu-satunya tanda. Dengan gerakan dikurangi, kemiringan berganti tanpa animasi. Hanya huruf tampilan yang besar (watermark dan logo) yang miring saat diam.
- **Warna berarti terpilih.** Hal yang diam berupa tinta dan garis tepi. Aksen hanya muncul pada hal yang terpilih, aktif, terbuka, ditekan, atau selesai. Contohnya kotak yang dicentang, tab saat ini, dan bagian bilah progres yang terisi. Cincin fokus tetap aksen. Tombol utama berupa tinta penuh dan terisi aksen saat ditekan. Prop `color="accent"` tetap tersedia untuk pengguna, tetapi library tidak pernah memakainya sebagai bawaan saat diam.
- **Menyatu saat berkelompok.** Hal yang satu kelompok berbagi satu pelat. ButtonGroup adalah satu garis tepi dan miring sebagai satu. InputGroup adalah satu isian. ToggleGroup juga satu pelat. Rentang tanggal yang terpilih adalah satu pita. Setiap bagian yang sendirian tetap punya tepinya sendiri.
- **Meluap, sekali saja.** Pertumbuhan tampil sebagai sesuatu yang melampaui bingkainya: watermark dan judul menggantung melewati bagiannya, bilah Progress yang selesai melewati jalurnya. Paling banyak satu hal meluap per layar, atau ia tidak lagi berarti apa-apa.
- **Menulis di halaman.** Isian adalah garis tempat Anda menulis, bukan kotak untuk diisi. Ia transparan, dengan garis bawah, dan garis aksen tumbuh di bawahnya saat Anda menulis. Membaca berubah menjadi menulis di tempat. Untuk nilai yang lebih sering dibaca, pakai [Inplace](/components/inplace), bukan formulir edit terpisah.
- **Hover memudar dan miring, tidak pernah bergeser**: `opacity: var(--bless-hover-opacity)` selama `var(--bless-duration-slow)`, dan pelat miring ke `--bless-lean` di tempat. Kemunculan memudar di tempat. Hanya perubahan keadaan yang berpindah (sheet bergeser dari tepinya, thumb switch bergerak).
- **Tidak ada yang buram.** Permukaan yang melayang duduk di atas `--bless-shadow-plate`, geseran aksen 1px. Modal dan sheet mengandalkan scrim.
- **Huruf**: pakai tipis untuk suara di ukuran judul ke atas, dan huruf kapital tebal berjarak untuk UI. Teks isi memakai `--bless-text-md`. Tidak ada yang lebih kecil dari `2xs` (8–9px), dan `2xs` hanya untuk meta kecil di samping teks yang lebih besar: badge, hitungan, tanggal, dan keterangan.

## Bentuk {#shape}

Satu bentuk: pelat tegak dengan garis tepi utuh dan persegi. Tombol, tab, tag, isian, kartu, dan menu berbentuk persegi. Bagian yang bulat di tempat lain juga persegi: avatar, switch, chip, bubble obrolan, fab, thumb slider, dan titik hitungan. Identitasnya adalah kemiringan saat diperhatikan, bukan sudutnya. Bentuk tetes milik [logo](../design/brand#mark).

Jangan pernah memakai lingkaran penuh atau pelat bulat dari library itu sendiri. Ada tiga pengecualian, ketika lingkaran adalah fungsinya dan bukan tampilannya: radio (lingkaran adalah cara radio berbeda dari checkbox), knob, dan pengukur [CircularProgress](/components/circular-progress). [Mockup](/components/mockup) ponsel juga tetap bersudut bulat. Sudut itu milik perangkatnya, bukan milik sistem. `--bless-radius`, `--bless-radius-plate`, dan `--bless-petal` ada dengan nilai `0` untuk pengguna yang ingin membulatkan. `--bless-petal: 8px` mengembalikan dua sudut bulat yang berseberangan pada bagian yang bulat secara alami.

Lihat [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) untuk peta jalan dan alasan di balik setiap fase.
