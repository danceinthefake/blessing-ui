import { defineConfig, postcssIsolateStyles } from "vitepress";
import { fileURLToPath } from "node:url";
import { groups } from "./components";
import blocks from "./blocks.json" with { type: "json" };

// groups are hand-ordered (coarse → fine); inside a group, alphabetical — the one order a
// stranger can predict. The nav's Components link opens the first page of that order.
const componentSidebar = groups.map((g) => ({
  text: g.title,
  collapsed: false,
  items: [...g.items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ text: i.name.replace(/^Bless/, ""), link: `/components/${i.slug}` })),
}));

const src = (p: string) => fileURLToPath(new URL(`../../src/${p}`, import.meta.url));

export default defineConfig({
  title: "Blessing UI",
  description: "Themed Flat Interface. Flat by design, raised with Vue, blessed for everyone.",
  lang: "en",
  base: process.env.DOCS_BASE ?? "/",
  srcExclude: ["blocks/README.md"],
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    // Before first paint, mirror VitePress's saved appearance onto data-theme (what the library's
    // tokens read) and restore the palette, so Bless components don't flash the OS theme or the
    // default accent. "auto" leaves data-theme off: the tokens then follow the OS, as VitePress does.
    [
      "script",
      {},
      `try{var a=localStorage.getItem("vitepress-theme-appearance");if(a==="dark"||a==="light")document.documentElement.dataset.theme=a;var p=localStorage.getItem("bless-palette");if(p)document.documentElement.dataset.palette=p}catch(e){}`,
    ],
    ["meta", { property: "og:title", content: "Blessing UI" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Themed Flat Interface. Flat by design, raised with Vue, blessed for everyone.",
      },
    ],
    ["meta", { property: "og:image", content: "https://ui.blessing.id/og.png" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&family=Noto+Sans+JP:wght@400;700&display=swap",
      },
    ],
  ],
  // Bahasa Indonesia: the guide, design, and home pages. Component and block pages stay English.
  locales: {
    root: { label: "English", lang: "en" },
    id: {
      label: "Bahasa Indonesia",
      lang: "id",
      link: "/id/",
      description:
        "Themed Flat Interface. Datar sejak awal, dibangun dengan Vue, untuk semua orang.",
      themeConfig: {
        nav: [
          { text: "Panduan", link: "/id/guide/install" },
          { text: "Komponen", link: componentSidebar[0].items[0].link },
          { text: "Blok", link: "/blocks/" },
          { text: "Desain", link: "/id/design/" },
        ],
        sidebar: {
          "/id/guide/": [
            {
              text: "Mulai",
              items: [
                { text: "Instalasi", link: "/id/guide/install" },
                { text: "Ukuran bundle", link: "/id/guide/sizes" },
              ],
            },
            {
              text: "Tema",
              items: [
                { text: "Token", link: "/id/guide/tokens" },
                { text: "Palet", link: "/id/guide/palettes" },
                { text: "Mode gelap", link: "/id/guide/dark-mode" },
                { text: "Font", link: "/id/guide/fonts" },
                { text: "Kanan-ke-kiri", link: "/id/guide/rtl" },
                { text: "Menerjemahkan", link: "/id/guide/translating" },
              ],
            },
            { text: "Membangun", items: [{ text: "Konvensi", link: "/id/guide/conventions" }] },
            {
              text: "Composable",
              items: [
                { text: "Scroll spy", link: "/id/guide/scroll-spy" },
                { text: "Animasi saat menggulir", link: "/id/guide/animate-on-scroll" },
                { text: "Gestur", link: "/id/guide/gestures" },
                { text: "Browser", link: "/id/guide/browser" },
              ],
            },
          ],
          "/id/design/": [
            {
              text: "Desain",
              items: [
                { text: "Bahasa desain", link: "/id/design/" },
                { text: "Merek", link: "/id/design/brand" },
                { text: "Cerita", link: "/id/design/story" },
                { text: "Kredit", link: "/id/design/credits" },
              ],
            },
          ],
        },
        outline: { level: [2, 3], label: "Di halaman ini" },
        docFooter: { prev: "Sebelumnya", next: "Berikutnya" },
        lastUpdated: { text: "Terakhir diperbarui" },
        langMenuLabel: "Ganti bahasa",
        returnToTopLabel: "Kembali ke atas",
        sidebarMenuLabel: "Menu",
        darkModeSwitchLabel: "Tampilan",
        lightModeSwitchTitle: "Ganti ke tema terang",
        darkModeSwitchTitle: "Ganti ke tema gelap",
        footer: {
          message:
            "Dirilis dengan Lisensi MIT. Nama karakter dan gambarnya milik pemiliknya masing-masing.",
          copyright: "Copyright © 2026 DanceInTheFake",
        },
      },
    },
  },
  themeConfig: {
    footer: {
      message:
        "Released under the MIT License. Character names and artwork belong to their owners.",
      copyright: "Copyright © 2026 DanceInTheFake",
    },
    logo: "/logo.svg",
    siteTitle: "Blessing",
    nav: [
      { text: "Guide", link: "/guide/install" },
      { text: "Components", link: componentSidebar[0].items[0].link },
      { text: "Blocks", link: "/blocks/" },
      { text: "Design", link: "/design/" },
    ],
    sidebar: {
      "/blocks/": [
        { text: "Blocks", items: [{ text: "Overview", link: "/blocks/" }] },
        ...[...new Set(blocks.map((b) => b.group))].map((g) => ({
          text: g,
          items: blocks
            .filter((b) => b.group === g)
            .map((b) => ({ text: b.title, link: `/blocks/${b.slug}` })),
        })),
      ],
      "/guide/": [
        {
          text: "Start",
          items: [
            { text: "Install", link: "/guide/install" },
            { text: "Bundle size", link: "/guide/sizes" },
          ],
        },
        {
          text: "Theming",
          items: [
            { text: "Tokens", link: "/guide/tokens" },
            { text: "Palettes", link: "/guide/palettes" },
            { text: "Dark mode", link: "/guide/dark-mode" },
            { text: "Fonts", link: "/guide/fonts" },
            { text: "Right-to-left", link: "/guide/rtl" },
            { text: "Translating", link: "/guide/translating" },
          ],
        },
        { text: "Building", items: [{ text: "Conventions", link: "/guide/conventions" }] },
        {
          text: "Composables",
          items: [
            { text: "Scroll spy", link: "/guide/scroll-spy" },
            { text: "Animate on scroll", link: "/guide/animate-on-scroll" },
            { text: "Gestures", link: "/guide/gestures" },
            { text: "Browser", link: "/guide/browser" },
          ],
        },
      ],
      "/design/": [
        {
          text: "Design",
          items: [
            { text: "Design language", link: "/design/" },
            { text: "Brand", link: "/design/brand" },
            { text: "Story", link: "/design/story" },
            { text: "Credits", link: "/design/credits" },
          ],
        },
      ],
      "/components/": componentSidebar,
    },
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/danceinthefake/blessing-ui" }],
    outline: [2, 3],
  },
  vite: {
    define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true" },
    // VitePress's table, list and text styles stay out of `.vp-raw` (the demo preview), so a
    // component looks the same in the docs as in an app
    css: { postcss: { plugins: [postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] })] } },
    resolve: {
      alias: {
        "blessing-ui/style.css": src("style.css"),
        "blessing-ui": src("index.ts"),
      },
    },
  },
});
