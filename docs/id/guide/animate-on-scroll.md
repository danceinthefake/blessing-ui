---
title: Animasi saat menggulir
---

<script setup>
import AnimateOnScrollBasic from "../../demos/AnimateOnScrollBasic.vue";
</script>

# Animasi saat menggulir

<p class="bless-lead"><code>useAnimateOnScroll()</code> memberi ref <code>visible</code> yang berubah tepat saat elemen masuk ke viewport. Transisinya Anda yang menentukan.</p>

<Demo title="Dasar">
  <AnimateOnScrollBasic />
  <template #code>

<<< ../../demos/AnimateOnScrollBasic.vue

  </template>
</Demo>

```ts
const { visible } = useAnimateOnScroll(el, { threshold?, rootMargin?, once? });
// el: Ref<HTMLElement | undefined>  — the element to watch
// threshold: number                 — default 0.15 (fraction in view before it counts)
// rootMargin: string                — IntersectionObserver margin, e.g. "0px 0px -10% 0px"
// once: boolean                     — default true; false flips back when it leaves
// visible: Ref<boolean>
```

Polanya seperti di atas. Ikat `visible` ke atribut `data-visible` (atau kelas) dan taruh transisinya di CSS. Composable tidak pernah menyentuh gaya. Taruh keadaan tersembunyi di dalam `@media (scripting: enabled)`, seperti di demo. Halaman hasil render server dikirim dengan `visible` bernilai false. Tanpa skrip, atau sebelum skrip dimuat, konten yang disembunyikan CSS biasa tidak akan pernah muncul. Gerakan tidak boleh menjadi satu-satunya cara untuk melihat sesuatu. Untuk sebuah daftar, panggil composable sekali per item. Atau amati daftarnya dan beri jeda pada anak-anaknya dengan `transition-delay: calc(var(--i) * 60ms)`.

Kemunculan yang baik di sistem ini memakai opacity, `--bless-ease-out`, `--bless-duration-slower`, dan perpindahan paling banyak beberapa piksel. Kemunculan memudar. Hanya perubahan keadaan yang bergerak. Dengan `prefers-reduced-motion: reduce`, composable mengatur `visible` ke `true` saat terpasang dan tidak pernah membuat observer, sehingga konten langsung muncul. Durasi di sana sudah `0s`, jadi transisi CSS biasa tidak perlu penanganan tambahan. Tanpa `IntersectionObserver`, `visible` juga langsung `true`.

Utamakan `once` (bawaan). Dengan `once: false`, elemen tersembunyi lagi saat keluar dan memudar masuk lagi saat kembali. Pakai ini hanya jika keluar memang berarti sesuatu. Jika tidak, halaman berubah menjadi tontonan.
