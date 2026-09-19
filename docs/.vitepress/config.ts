import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import { groups } from "./components";

const src = (p: string) => fileURLToPath(new URL(`../../src/${p}`, import.meta.url));

export default defineConfig({
  title: "Blessing UI",
  description: "Themed Flat Interface. Flat by design, raised with Vue, blessed for everyone.",
  lang: "en",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
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
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Noto+Sans+JP:400,700&display=swap",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Blessing",
    nav: [
      { text: "Guide", link: "/guide/install" },
      { text: "Components", link: "/components/button" },
      { text: "Tokens", link: "/guide/tokens" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Install", link: "/guide/install" },
            { text: "Tokens", link: "/guide/tokens" },
            { text: "Dark mode", link: "/guide/dark-mode" },
            { text: "Palettes", link: "/guide/palettes" },
            { text: "Fonts", link: "/guide/fonts" },
            { text: "Conventions", link: "/guide/conventions" },
            { text: "useScrollSpy", link: "/guide/scroll-spy" },
            { text: "useAnimateOnScroll", link: "/guide/animate-on-scroll" },
            { text: "Brand", link: "/guide/brand" },
            { text: "Story", link: "/guide/story" },
          ],
        },
      ],
      "/components/": groups.map((g) => ({
        text: g.title,
        collapsed: false,
        items: g.items.map((i) => ({
          text: i.name.replace(/^Bless/, ""),
          link: `/components/${i.slug}`,
        })),
      })),
    },
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/danceinthefake/blessing-ui" }],
    outline: [2, 3],
  },
  vite: {
    resolve: {
      alias: {
        "blessing-ui/style.css": src("style.css"),
        "blessing-ui": src("index.ts"),
      },
    },
  },
});
