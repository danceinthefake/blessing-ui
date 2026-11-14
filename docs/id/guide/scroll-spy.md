---
title: Scroll spy
---

<script setup>
import ScrollSpyBasic from "../../demos/ScrollSpyBasic.vue";
</script>

# Scroll spy

<p class="bless-lead"><code>useScrollSpy()</code> menunjukkan bagian mana yang sedang terlihat. Ia memakai <code>IntersectionObserver</code> pada id atau selector.</p>

<Demo title="Dasar">
  <ScrollSpyBasic />
  <template #code>

<<< ../../demos/ScrollSpyBasic.vue

  </template>
</Demo>

```ts
const { active } = useScrollSpy(ids | selector, { rootMargin?, root? });
// ids: string[]           — element ids to observe
// selector: string        — or every element matching it
// rootMargin: string      — default "0px 0px -60% 0px"
// root: Ref<HTMLElement>  — a scroll container instead of the viewport
// active: Ref<string | undefined>
```

`active` adalah id bagian yang sedang terlihat dengan tepi atas paling dekat ke atas viewport. Jika Anda memberikan wadah gulir, `active` memakai bagian atas `root`. Composable mengukurnya pada setiap perubahan. Bagian panjang yang baru saja lewat tidak mengalahkan bagian yang baru datang. Dengan `rootMargin` bawaan, hanya 40% bagian atas viewport yang dihitung. Sebuah bagian menjadi aktif di bagian atas layar, bukan di tepi bawah. Saat tidak ada yang terlihat (di atas bagian pertama, atau di celah), `active` menyimpan nilai terakhirnya. Sebelum ada guliran, nilainya adalah id pertama yang diamati.

Pasangkan dengan `BlessSidebarNav :active` seperti di atas. Beri setiap bagian `scroll-margin-top` setinggi apa pun yang menempel di atas, agar klik tidak mendarat di bawah bilah. Composable membuat observer saat komponen terpasang, sehingga aman dipanggil di komponen yang dirender server. Ia hanya mengamati target yang ada saat itu. Ia tidak menangkap bagian yang dirender belakangan, misalnya di balik `v-if` atau setelah fetch. Untuk mengatasinya, beri `:key` pada komponen yang memanggilnya dan kaitkan key itu dengan daftarnya. Composable lalu berjalan lagi setelah setiap perubahan bagian.
