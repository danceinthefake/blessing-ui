import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import { groups } from "./components";

const src = (p: string) => fileURLToPath(new URL(`../../src/${p}`, import.meta.url));

export default defineConfig({
  title: "Blessing UI",
  description: "Vue 3 components and design tokens. Grey UI, one pink-red accent, skewed labels.",
  lang: "en",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Noto+Sans+JP:400,700&display=swap",
      },
    ],
  ],
  themeConfig: {
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
            { text: "Fonts", link: "/guide/fonts" },
            { text: "Conventions", link: "/guide/conventions" },
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
