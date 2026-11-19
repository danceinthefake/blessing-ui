# Instalasi

::: code-group

```sh [pnpm]
pnpm add blessing-ui
```

```sh [npm]
npm install blessing-ui
```

```sh [yarn]
yarn add blessing-ui
```

```sh [bun]
bun add blessing-ui
```

:::

```vue
<script setup lang="ts">
import { BlessButton, BlessSection } from "blessing-ui";
</script>

<template>
  <BlessSection title="News">
    <BlessButton>More</BlessButton>
  </BlessSection>
</template>
```

Itu saja. Setiap komponen adalah export ESM bernama dengan stylesheet-nya sendiri, sehingga bundler hanya mengambil yang Anda impor. Satu tombol saja sekitar 1 KB JS dan 1 KB CSS setelah gzip, ditambah sekitar 2 KB token sekali saja. [Ukuran bundle](./sizes) menunjukkan biaya setiap komponen. Entri paket mengimpor `tokens.css`, sehingga custom property `--bless-*` sudah ada begitu Anda mengimpor apa pun dari library. Bundler mematuhi field `sideEffects` dari paket. Semua bundler saat ini mematuhinya.

Untuk memuat semua gaya di awal, misalnya tanpa bundler atau lewat CDN, impor stylesheet lengkap sekali:

```ts
import "blessing-ui/style.css"; // tokens + every component's styles, ~37 KB gzipped
```

## Impor otomatis {#auto-import}

Anda bisa menulis `<BlessButton>` di template tanpa baris `import`. Setiap komponen lalu datang dari filenya sendiri, hanya dengan gayanya sendiri, dan token dimuat sekali.

Di Nuxt, tambahkan modulnya. Tidak perlu yang lain, dan modul ini juga membuat tautan di dalam aplikasi memakai `NuxtLink`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["blessing-ui/nuxt"],
});
```

Untuk mengimpor setiap komponen sendiri, matikan impor otomatis. Modul tetap memuat token dan memberikan `NuxtLink`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["blessing-ui/nuxt"],
  blessingUi: { components: false },
});
```

Di Vite, pakai [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) dengan resolver dari library:

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { BlessingUiResolver } from "blessing-ui/resolver";

export default defineConfig({
  plugins: [vue(), Components({ resolvers: [BlessingUiResolver()] })],
});
```

Resolver dan modul hanya mengenal nama komponen. Impor fungsi, key, dan tipe, seperti `provideLabels` dan `blessLinkKey`, dari `blessing-ui` seperti biasa.

## Hanya token

Jika Anda hanya ingin token desain (tanpa komponen), ikuti [bahasa desain](../design/) yang sama: tinta saat diam, kemiringan saat diperhatikan, aksen hanya pada yang terpilih.

```css
@import "blessing-ui/tokens.css";
.tab {
  color: var(--bless-color-text);
  transform: skewX(var(--bless-skew));
}
.tab:hover,
.tab:focus-visible {
  --bless-skew: var(--bless-lean);
}
.tab[aria-selected="true"] {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
```

## Kebutuhan

- Vue `^3.5`.
- `@nuxt/kit` `^3.15` atau `^4` adalah peer **opsional**. Hanya `blessing-ui/nuxt` yang memakainya, dan setiap aplikasi Nuxt sudah memilikinya.
- `marked` `^18` adalah peer **opsional**. Hanya `BlessMarkdown` yang memakainya, dan Anda memberikan `lexer`-nya ke komponen, sehingga library tidak pernah memuatnya. Jika Anda tidak memakai Markdown, abaikan peringatan peer.
- `@tiptap/vue-3` `^3` adalah peer **opsional**. Hanya `BlessEditor` yang memakainya. Jika Anda memakai editor, instal paket itu. Jika tidak, abaikan peringatan peer.
- Browser evergreen. Kebutuhan wajib: Popover API, `<dialog>`, `color-mix()`, CSS nesting. Tidak ada polyfill yang disertakan.
- Fitur progresif menurun dengan tenang jika browser tidak mendukungnya:
  - `field-sizing`: `autogrow` pada Textarea tetap setinggi semula.
  - `appearance: base-select`: `BlessSelect` memberi gaya pada dropdown-nya di Chrome 135 ke atas. Browser lain menampilkan pemilih bawaan, tanpa gaya.
  - `@property`: kemiringan melompat, tidak beranimasi.
  - `:has()`: label checkbox atau switch tidak miring selama input-nya fokus.
- Font tidak disertakan. Lihat [Font](./fonts).

## Dengan router {#with-a-router}

Semua komponen yang merender tautan secara bawaan merender `<a>` biasa. Komponen ini termasuk `BlessSidebarNav`, `BlessButton href`, kartu, item daftar, breadcrumb, paginasi, menu, tab, dan tree. Berikan komponen tautan dari router Anda sekali, dan semuanya memakainya untuk path di dalam aplikasi. Anda lalu mendapat navigasi di sisi klien, status aktif, dan (di Nuxt) prefetch tanpa memasang `@select` di mana-mana:

```ts
// Vue Router
import { RouterLink } from "vue-router";
import { blessLinkKey } from "blessing-ui";
app.provide(blessLinkKey, RouterLink);
```

Di Nuxt, modul `blessing-ui/nuxt` memberikan `NuxtLink` untuk Anda. Tanpa modul itu, tambahkan plugin:

```ts
// plugins/blessing.ts
import { blessLinkKey } from "blessing-ui";
import { NuxtLink } from "#components";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(blessLinkKey, NuxtLink);
});
```

Untuk memakai komponen tautan lain di Nuxt, berikan komponen itu di plugin Anda sendiri. Plugin Anda berjalan setelah modul, sehingga komponen Anda yang dipakai.

Aturannya: `href` yang diawali `/` atau berupa path relatif biasa diteruskan ke router sebagai `to`. Selain itu tetap `<a>` bawaan: skema (`https:`, `mailto:`), `//` tanpa protokol, `#hash`, atau `external: true`. Library tidak mengimpor apa pun dari router mana pun.

## Berikutnya

[Mode gelap](./dark-mode) langsung mengikuti sistem operasi. [Palet](./palettes) memilih aksen yang dipakai seluruh library. [Bahasa desain](../design/) menjelaskan mengapa library terlihat dan berperilaku seperti ini.
