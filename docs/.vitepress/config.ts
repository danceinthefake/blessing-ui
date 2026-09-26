import { defineConfig } from "vitepress";
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
    [
      "meta",
      { property: "og:image", content: "https://danceinthefake.github.io/blessing-ui/og.png" },
    ],
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
  themeConfig: {
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
        { text: "Start", items: [{ text: "Install", link: "/guide/install" }] },
        {
          text: "Theming",
          items: [
            { text: "Tokens", link: "/guide/tokens" },
            { text: "Palettes", link: "/guide/palettes" },
            { text: "Dark mode", link: "/guide/dark-mode" },
            { text: "Fonts", link: "/guide/fonts" },
            { text: "Right-to-left", link: "/guide/rtl" },
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
    resolve: {
      alias: {
        "blessing-ui/style.css": src("style.css"),
        "blessing-ui": src("index.ts"),
      },
    },
  },
});
