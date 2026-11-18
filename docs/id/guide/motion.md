# Gerak

<script setup>
import MotionLayers from "../../demos/MotionLayers.vue";
</script>

<p class="bless-lead">Gerak di blessing-ui punya tiga lapis, seperti serial asalnya. Sebagian besar adegan tenang dan lembut. UI gim muncul saat cerita membahas gim. Adegan komedi adalah jeda singkat. Pengaturan tenang memberi gerak yang lebih sedikit, dan reduced motion di sistem mematikan semuanya.</p>

<Demo title="Tiga lapis, dengan sakelar tenang dan flair">
  <MotionLayers />
  <template #code>

<<< ../../demos/MotionLayers.vue

  </template>
</Demo>

## Lapisan

| Lapis | Di mana                                                        | Apa yang terjadi                                                                        | Token                                                                    |
| ----- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dasar | Setiap kemunculan: popover, menu, banner, alert, panel         | Naik `--bless-rise` dari fokus lembut (blur singkat) lalu mengendap dengan ease panjang | `bless-enter`, `--bless-duration-enter`, `--bless-ease-soft`             |
| Suara | Bagian yang berbicara: dialog, toast, tur, coachmark, tooltip  | Tersibak dari tepi bawah, seperti kotak teks visual novel                               | `bless-voice`, `--bless-duration-voice`, `--bless-ease-snap`             |
| Flair | Pilihan dengan `data-flair`: pilihan, toggle, nilai yang salah | Yang dipilih meletup dengan squash and stretch. Nilai yang salah bergoyang              | `bless-pop`, `bless-shake`, `--bless-duration-flair`, `--bless-ease-pop` |

Hover tidak berubah. Kontrol memudar dan condong saat diperhatikan, dan tidak pernah memantul.

## Daftar dan grafik

Daftar item datang satu per satu, berjarak `--bless-stagger`. Contohnya feed, linimasa, hasil pencarian, dan grid kartu. Item kedelapan dan seterusnya berbagi satu jeda, agar daftar panjang tidak membuat Anda menunggu. Batang tumbuh dari garis dasarnya, garis menggambar dirinya sendiri, dan titik-titik garis mendarat setelah garis lewat. Grafik memakai `--bless-duration-draw`. Dalam gerak tenang, semuanya memudar.

Daftar yang Anda susun ulang bekerja berbeda: baris [DataTable](../../components/data-table), kartu [Kanban](../../components/kanban), item [Sortable](../../components/sortable) dan [PlayQueue](../../components/play-queue), serta item [OrderList](../../components/order-list). Semuanya datang berurutan saat pertama dimuat, dan item baru naik. Saat Anda mengurutkan, menyeret, atau memindahkan item dengan keyboard, item meluncur ke tempat barunya. Item yang berpindah tidak memutar ulang kedatangannya. Agar bisa meluncur, beri komponen sebuah `rowKey`, supaya setiap item tetap dikenali saat berpindah.

## Formulir dan kontrol

Panel tab yang baru, langkah baru [Stepper](../../components/stepper), dan isi [Collapsible](../../components/collapsible) yang terbuka datang dengan lapis dasar. Pesan galat di bawah field naik dengan cepat. Thumb switch, tanda centang, dan titik radio melompat ke tempatnya. Bilah dan cincin progres terisi dengan ease lembut yang panjang selama `--bless-duration-draw`.

## Chat dan AI

[Message](../../components/message) berbicara, jadi gelembungnya tersibak dengan lapis suara. Begitu juga [TypingIndicator](../../components/typing-indicator). Panggilan alat, penalaran, dan panel artefak datang dengan lapis dasar, begitu juga isinya saat Anda membukanya. Langkah [AgentPlan](../../components/agent-plan), chip [Suggestions](../../components/suggestions), dan komentar [Thread](../../components/thread) datang berurutan.

Teks yang diketik bersifat pilihan. Untuk mengetik balasan seperti kotak teks gim, beri [StreamingText](../../components/streaming-text) sebuah `pace` dalam huruf per detik. Pembaca layar menunggu teks lengkap. Dengan reduced motion, teks langsung tampil.

## Yang tetap diam

Kontrol, field, tata letak, dan teks tidak datang. Tombol, input, stack, atau judul sudah ada saat halaman ada. Mereka hanya bergerak saat Anda berinteraksi: condong saat diperhatikan, lompatan toggle, dan flair jika Anda menyalakannya. Editor, kanvas, kalender, dan tabel tempat Anda bekerja juga tetap diam, agar pekerjaan tidak pernah menunggu gerak.

Konten memang datang. Kartu, panel, struk, dan artikel naik. Meteran terisi, batang tumbuh, grafik bundar terbuka dari tengahnya, dan grid sel memudar masuk.

## Flair

Flair mati secara bawaan, karena letupan di setiap klik melelahkan pada formulir yang dipakai seharian. Untuk menyalakannya, pasang `data-flair` di `<html>` atau di satu wadah, misalnya layar hadiah atau gim.

```html
<section data-flair>…</section>
```

Di dalamnya, ini meletup saat menjadi terpilih: `aria-pressed`, `aria-checked`, tab terpilih, dan checkbox atau radio yang dicentang. Field dengan `aria-invalid="true"` bergoyang. Yang sudah terpilih saat halaman dimuat meletup sekali. Untuk mengatur kekuatannya, ubah `--bless-flair` (`1` penuh, `0` mati).

## Gerak tenang

Untuk orang yang ingin gerak lebih sedikit tetapi tidak nol, pasang `data-motion="calm"` di `<html>` atau di satu wadah. Kemunculan memudar dalam 140 ms tanpa bergeser atau blur. Flair mati.

```html
<html data-motion="calm"></html>
```

## Reduced motion

Jika sistem meminta reduced motion, setiap token durasi menjadi `0s`. Semua muncul seketika, dan tidak ada yang bergerak. Spinner tetap berputar tetapi lebih lambat, agar keadaan sibuk tidak tampak beku.

## Di komponen Anda sendiri

Keyframe bersifat global, jadi Anda bisa memakainya dengan token.

```css
.my-panel {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
```

Untuk membuat daftar Anda sendiri datang berurutan, tambahkan class `bless-stagger` ke induknya. Jika daftar itu bisa disusun ulang, bungkus dengan `<TransitionGroup appear appear-active-class="bless-appear" enter-active-class="bless-arrive" move-class="bless-move" @leave="(el, done) => done()">`. Untuk menggambar garis Anda sendiri, beri path `pathLength="1"`.

```css
.my-line {
  stroke-dasharray: 1;
  animation: bless-draw var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
```

Keyframe menganimasikan properti `translate`, `scale`, `filter`, dan `clip-path`, bukan `transform`. Ini menjaga kecondongan, yang berupa transform, tetap berfungsi selama gerak.
