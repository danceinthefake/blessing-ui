---
title: Kredit
---

# Kredit

Blessing UI tidak punya dependensi saat berjalan. Meski begitu, pustaka ini berdiri di atas karya banyak orang. Halaman ini menyebut mereka: situs yang memberi tampilannya, pustaka yang kami jadikan pembanding, metode yang dipakai komponen, dan alat yang membangun serta mengujinya.

## Tampilan

Bahasa visualnya berasal dari [saenai.tv](https://www.saenai.tv/), situs resmi anime _Saenai Heroine no Sodatekata_. Kami mencatat aturannya lalu menggambar ulang setiap bagian. Kami tidak menyalin aset, lembar gaya, maupun skrip apa pun. [Cerita](./story) menjelaskan caranya. Anime itu, judulnya, karakternya, dan karya seninya milik pemiliknya masing-masing. Proyek ini tidak berafiliasi dengan mereka.

Tiga lapis [gerak](../guide/motion) berasal dari anime itu sendiri, buatan A-1 Pictures dan CloverWorks: fokus lembut dan hanyutan di adegan tenangnya, kotak teks visual novel yang dibuat lingkaran itu, dan adegan komedinya yang singkat. [UniqueUI](https://github.com/pras75299/uniqueui) dan [Rare UI](https://github.com/swamimalode07/rare-ui) menunjukkan seberapa banyak gerak yang bisa dibawa library komponen. Kami tidak mengambil komponen atau kode dari keduanya.

Halaman depan dibaca seperti light novel dalam bab. Di antara bab, halaman itu memakai dua kebiasaan anime TV: eyecatch, yaitu kartu judul singkat saat jeda, dan cuplikan episode berikutnya (次回予告) di akhir.

Fon bawaannya adalah [Roboto](https://fonts.google.com/specimen/Roboto) karya Christian Robertson dan [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) dari Google. Pustaka ini tidak menyertakannya. Anda memuatnya sendiri, seperti yang ditunjukkan [panduan fon](../guide/fonts).

## Pustaka pembanding

Kami mencocokkan daftar komponen dengan proyek-proyek ini, untuk mengetahui apa saja yang wajib ada di pustaka sejenis. Setiap komponen Blessing dibuat sendiri. Pustaka ini tidak memakai kode dari mereka, dan nama mereka milik pemiliknya.

- [shadcn/ui](https://ui.shadcn.com/): daftar target pertama, dan bentuk pembungkus grafik, serta header dan footer situs sebagai blok salinan, bukan komponen.
- [Tailwind Plus](https://tailwindcss.com/plus) (dulu Tailwind UI): daftar blok yang dibutuhkan toko dan situs pemasaran: checkout, halaman produk, dan landing page.
- [PrimeVue](https://primevue.org/): daftar target kedua, untuk komponen data dan formulir yang lebih besar.
- [Sonner](https://sonner.emilkowal.ski/), [Radix](https://www.radix-ui.com/), dan [cmdk](https://cmdk.paco.me/): perilaku toaster, komponen dasar, dan menu perintah. Kami menulis versi kecil dari perilaku itu dan tidak membungkus pustakanya.

## Klasifikasi yang kami pakai

Halaman [jenis situs](./site-types) membandingkan tiga daftar kategori situs dan aplikasi. Kami memakai jumlahnya dan tidak mengambil teks dari mereka.

- [Similarweb](https://www.similarweb.com/) Industry Plus: 27 industri dan 436 kategori situs web.
- [App Store](https://developer.apple.com/documentation/appstoreconnectapi/app-categories-and-subcategories) dari Apple: kategori aplikasi.
- [IAB Tech Lab Content Taxonomy](https://iabtechlab.com/standards/content-taxonomy/) 3.1: 37 topik tingkat atas untuk konten dan iklan.

## Standar

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) memberi aturan keyboard dan peran untuk listbox, grid, tab, combobox, tree, menu, dialog, dan pola lainnya.
- [Kolom SKU](../../components/sku-field) memeriksa barcode dengan check digit mod-10 dari [GS1](https://www.gs1.org/), lembaga di balik nomor EAN dan UPC.
- [Impor CSV](../../components/csv-import) membaca berkas mengikuti [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), format umum nilai yang dipisah koma.
- [Kolom alamat](../../components/address-fields) memakai kode negara [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) dan token `autocomplete` dari standar HTML.
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) tingkat AA adalah patokan untuk kontras, fokus, dan gerak. [axe-core](https://github.com/dequelabs/axe-core) memeriksa setiap halaman terhadapnya.
- [ASD-STE100](https://www.asd-ste100.org/) Simplified Technical English adalah standar untuk semua teks berbahasa Inggris di repositori dan dokumentasi.
- Platform web mengerjakan bagian terberat: Popover API, elemen `dialog`, `Intl`, Web Speech API, Web Audio, properti logis CSS, dan [CSS anchor positioning](https://www.w3.org/TR/css-anchor-position-1/) (panel melayang, dengan container query anchored untuk panah). [MDN Web Docs](https://developer.mozilla.org/) menjadi rujukan untuk semuanya.

## Metode

Beberapa komponen memakai metode yang sudah dikenal. Kami menulis ulang masing-masing dari uraiannya.

- [Gerak](../guide/motion) flair memakai squash and stretch, dari _The Illusion of Life_ karya Frank Thomas dan Ollie Johnston (1981).
- Daftar yang disusun ulang meluncur dengan FLIP (First, Last, Invert, Play) oleh Paul Lewis (2015), melalui `<TransitionGroup>` milik Vue.
- [Treemap](../../components/treemap) memakai tata letak squarified dari Bruls, Huijsmans, dan van Wijk (2000).
- [Blok hasil pencarian](../../blocks/search) mencari ejaan yang lebih baik dengan jarak edit Levenshtein (1966).
- [Input kartu](../../components/card-input) memeriksa nomor dengan algoritma Luhn (Hans Peter Luhn, 1954).
- Halaman [periksa jawaban](../../components/check-answers) mengikuti pola "Check answers" dari [GOV.UK Design System](https://design-system.service.gov.uk/patterns/check-answers/) karya Government Digital Service Inggris.
- [Peta dengan penanda](../../components/map-pins) menempatkan ubin dan penanda dengan proyeksi Web Mercator (EPSG:3857). Ubin dan data peta bawaannya berasal dari [OpenStreetMap](https://www.openstreetmap.org/copyright) dan para kontributornya, dengan lisensi ODbL.
- [Peta pikiran](../../components/mind-map) mengikuti peta pikiran yang dikenalkan Tony Buzan dalam _Use Your Head_ (1974).
- [Grafik kendali](../../components/control-chart) mengikuti grafik kendali Walter A. Shewhart (1924), dengan batas pada rata-rata ± 3 simpangan baku.
- [Gauge OEE](../../components/oee-gauge) memakai overall equipment effectiveness, ketersediaan × performa × mutu, dari total productive maintenance oleh Seiichi Nakajima.
- [Papan mesin](../../components/machine-board) mengikuti papan andon dari Toyota Production System.
- [Jurnal](../../components/journal-entry) mengikuti pembukuan berpasangan, seperti yang ditulis Luca Pacioli pada 1494: debit dan kredit harus sama.
- [Jadwal pembayaran](../../components/payment-schedule) memakai rumus anuitas standar untuk pinjaman dengan cicilan bulanan yang sama.
- [Pemilih pengulangan](../../components/recurrence-picker) menulis aturannya sebagai RRULE dari [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545), standar iCalendar.
- Sumbu grafik memakai langkah bulat 1, 2, 2,5, dan 5, mengikuti "nice numbers" dari Paul Heckbert (1990).
- [Box plot](../../components/box-plot) mengakhiri kumisnya pada 1,5 kali tinggi kotak, seperti usulan John Tukey.
- [Waffle](../../components/waffle) membulatkan porsinya dengan metode sisa terbesar, sehingga jumlah kotaknya selalu 100.
- [Streamgraph](../../components/streamgraph) menempatkan alirannya di sekitar garis tengah, seperti ThemeRiver dari Havre, Hetzler, dan Nowell (2000). Byron dan Wattenberg (2008) memberi nama bentuk ini.
- Grafik [Pareto](../../components/pareto) menampilkan aturan 80/20 yang dinamai Joseph Juran dari Vilfredo Pareto.
- Diagram [Venn](../../components/venn) adalah bentuk dari John Venn (1880). Diagram ini menghitung setiap bagian dengan inklusi dan eksklusi.
- [Beeswarm](../../components/beeswarm) menempatkan titiknya dengan cara swarm yang rakus, seperti paket beeswarm untuk R karya Aron Eklund.
- [Diagram chord](../../components/chord-diagram) menata busur dan pitanya seperti [d3-chord](https://github.com/d3/d3-chord) karya Mike Bostock. Kami menulis ulang metodenya dan tidak memakai kodenya.
- [Grafik mawar](../../components/rose-chart) adalah diagram area polar dari Florence Nightingale (1858). Luas setiap irisan mengikuti nilainya.

## Paket yang bisa Anda tambahkan

Beberapa komponen bekerja dengan paket yang Anda pasang sendiri. Pustaka ini tidak mengimpor paket tersebut, dan Anda cukup memasang yang Anda pakai.

- [Vue](https://vuejs.org/) karya Evan You dan tim Vue: satu-satunya peer yang wajib.
- [Tiptap](https://tiptap.dev/) dan [ProseMirror](https://prosemirror.net/): mesin di balik [editor](../../components/editor).
- [marked](https://marked.js.org/): lexer untuk komponen [markdown](../../components/markdown).
- [Unovis](https://unovis.dev/): grafik di dalam bingkai [chart](../../components/chart).
- [uqr](https://github.com/unjs/uqr) dari tim UnJS: encoder untuk [kode QR](../../components/qr-code).
- [Nuxt](https://nuxt.com/): modul untuk aplikasi Nuxt.

## Alat

Alat-alat ini membangun, menguji, dan mendokumentasikan pustaka.

- [Vite](https://vite.dev/), [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts), dan [TypeScript](https://www.typescriptlang.org/) dengan [vue-tsc](https://github.com/vuejs/language-tools).
- [VitePress](https://vitepress.dev/) untuk situs ini, [Shiki](https://shiki.style/) untuk warna kode (tema GitHub light high-contrast), dan [vue-component-meta](https://github.com/vuejs/language-tools) untuk tabel props.
- [Vitest](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), dan [jsdom](https://github.com/jsdom/jsdom) untuk uji unit.
- [Panduan gaya Vue](https://vuejs.org/style-guide/) untuk urutan blok SFC (template, script, style).
- [Playwright](https://playwright.dev/) untuk pemeriksaan di Chromium, Firefox, dan WebKit, dengan [axe-core](https://github.com/dequelabs/axe-core), [pixelmatch](https://github.com/mapbox/pixelmatch), dan [pngjs](https://github.com/pngjs/pngjs) untuk audit dan perbandingan visual.
- [oxfmt](https://oxc.rs/) dari proyek Oxc untuk format kode.
- [pnpm](https://pnpm.io/) mengelola paket repositori. [Tab kode](../../components/code-tabs) juga memberi perintah untuk [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), dan [Bun](https://bun.sh/).

Terima kasih kepada semua orang yang membuat proyek-proyek ini.
