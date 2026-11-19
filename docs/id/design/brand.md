# Merek

Identitas Blessing UI adalah sistem desain itu sendiri. Logonya tidak memerlukan apa pun yang belum dipakai sebuah komponen. [Cerita](./story) menjelaskan dari mana sistem ini berasal.

<div style="display:flex;align-items:center;gap:24px;margin:16px 0 8px">
  <img src="/logo.svg" width="96" height="96" alt="">
  <img src="/logo.svg" width="48" height="48" alt="">
  <img src="/logo.svg" width="24" height="24" alt="">
  <img src="/logo.svg" width="16" height="16" alt="">
</div>

## Enam unsur

| Unsur    | Nilai                                                                                                                                                                                                    | Tempat Anda melihatnya                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Nama     | **Blessing**. Nama ini mengacu pada sebuah lingkaran perangkat lunak fiksi (lihat [cerita](./story))                                                                                                     | wordmark, nama paket                                                                                 |
| Warna    | satu aksen pada satu waktu: `#e85078` milik Megumi secara bawaan, dan enam lewat [palet](../guide/palettes). Logo membawa warna kelopak. Palet menggelapkan warna di tempat teks putih memerlukannya     | apa pun yang terpilih (tombol yang ditekan, tab saat ini, kotak yang dicentang), badge, cincin fokus |
| Geometri | `--bless-lean`, −10°: tegak saat diam, miring saat diperhatikan. Huruf besar dan logo selalu miring. Satu [bentuk](../guide/conventions#shape): pelat persegi yang tegak. Bentuk tetes hanya ada di logo | setiap label, isian, switch, dan chip, serta setiap kelopak logo                                     |
| Huruf    | Roboto 100 berukuran besar untuk suara, 700 huruf kapital berjarak untuk UI                                                                                                                              | watermark, wordmark, label                                                                           |
| Motif    | pelat: garis aksen 1px yang tegas, digeser di belakang apa pun yang melayang, tanpa blur                                                                                                                 | setiap popover, menu, tooltip, toast, dan modal, bingkai QR, gambar utama situs, dan kartu OG        |
| Eyecatch | kartu judul anime TV saat jeda: pita dengan baris kecil, judul besar, dan nomor besar. Cuplikan episode berikutnya menutup halaman depan                                                                 | halaman depan, halaman pembuka panduan, blok, dan desain, dan strip di atas setiap halaman           |

## Logo {#mark}

Bunga yang miring. Lingkaran fiksi yang memberi nama Blessing memakai bunga lima kelopak sebagai logonya, satu kelopak untuk setiap anggota (lihat [cerita](./story)). Logo kami menggambarnya ulang dengan bahasa sistem. Ada lima kelopak berbentuk tetes di sekitar bagian tengah yang kosong. Kelopaknya tajam di tengah dan lembut di luar. Setiap kelopak punya kemiringan khas −10°. Bunganya berputar seolah baru tertiup angin. Lima kelopak itu adalah lima dari enam [palet](../guide/palettes). Yang keenam, Tomoya, adalah pendiri lingkaran itu. Tomoya berada di tengah yang dibiarkan kosong oleh logo.

| File                              | Pemakaian                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`logo.svg`](/logo.svg)           | latar apa pun: kelima warnanya terbaca di latar terang dan gelap                                                                                  |
| [`logo-mono.svg`](/logo-mono.svg) | satu warna untuk footer dan cetak. Jika Anda menyisipkannya di halaman yang memakai token, kelopak atasnya mengambil aksen (tinta, satu terpilih) |
| [`favicon.svg`](/favicon.svg)     | ikon tab                                                                                                                                          |
| [`og.png`](/og.png)               | kartu media sosial 1200×630, disusun dari sistem (di bawah). Buat ulang dengan `pnpm docs:shots`                                                  |

<img src="/og.png" alt="Kartu OG: logo, wordmark, tagline, tangkapan layar berbingkai browser di atas pelat, watermark di belakangnya" style="border: var(--bless-border-width) solid var(--bless-color-border); margin: 8px 0 24px">

### Jangan

<div class="brand-dont">
  <figure><img src="/logo.svg" alt="" style="transform: skewX(10deg)"><figcaption>mengubah kemiringan</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="filter: hue-rotate(150deg)"><figcaption>mewarnai ulang</figcaption></figure>
  <figure><img src="/logo.svg" alt="" style="transform: rotate(36deg)"><figcaption>memutar</figcaption></figure>
  <figure><span class="brand-dont__centre"><img src="/logo.svg" alt=""><i></i></span><figcaption>menambah pusat</figcaption></figure>
</div>

## Wordmark

Wordmark-nya adalah `Blessing` dalam Roboto 100 (300 di mode gelap, seperti semua teks tipis di sistem). `UI` mengikutinya, dalam label miring berwarna aksen palet saat ini, dan warnanya ikut berganti dengan palet. Wordmark dibangun dari token. Ia tidak dikirim sebagai gambar. Navigasi situs memakai `siteTitle` dan CSS, resep yang sama seperti di bawah.

<p class="brand-wordmark">Blessing <span class="brand-wordmark__ui"><span>UI</span></span></p>

## Aturan

- Pertahankan kemiringan dan kelimanya. Jangan meluruskan, memberi garis tepi, atau mengubah jarak kelopak. Jangan mengganti bentuk tetes dengan lingkaran atau pelat. Jangan mengisi bagian tengah.
- Pakai satu aksen di UI. Logo adalah satu-satunya tempat kelima warna palet berada bersama. Jangan pernah mewarnai ulang sebuah kelopak.
- Ruang kosong = setengah panjang kelopak di semua sisi.
- Ukuran minimal 16px.
- Tulis wordmark hanya dengan ketebalan 100 atau 300. Jangan beri jarak antarhuruf.

<style>
.brand-wordmark {
  margin: 16px 0;
  font-family: var(--bless-font-sans);
  font-size: 56px;
  font-weight: var(--bless-font-weight-thin);
  letter-spacing: var(--bless-tracking-tight);
  line-height: var(--bless-leading-none);
}
.brand-wordmark__ui {
  display: inline-block;
  position: relative;
  top: -0.15em;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: 18px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  vertical-align: middle;
  transform: skewX(var(--bless-lean));
}
.brand-wordmark__ui > span {
  display: inline-block;
  transform: skewX(calc(-1 * var(--bless-lean)));
}
.brand-dont {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 8px 0 24px;
}
.brand-dont figure {
  margin: 0;
  text-align: center;
  position: relative;
}
.brand-dont img {
  width: 64px;
  height: 64px;
  display: block;
  margin: 0 auto 6px;
}
.brand-dont figure::before {
  content: "";
  position: absolute;
  left: 4px;
  right: 4px;
  top: 32px;
  height: 2px;
  background: var(--bless-color-danger);
  transform: rotate(-30deg);
}
.brand-dont figcaption {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.brand-dont__centre {
  position: relative;
  display: block;
}
.brand-dont__centre i {
  position: absolute;
  left: 50%;
  top: 32px;
  width: 10px;
  height: 7px;
  margin: -3px 0 0 -5px;
  background: #5870f8;
  transform: skewX(var(--bless-lean));
}
</style>
