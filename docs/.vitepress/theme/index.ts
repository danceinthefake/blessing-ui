import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { h, watch } from "vue";
import type { Theme } from "vitepress";
import {
  BlessDialogHost,
  BlessLoadingBar,
  BlessPaletteToggle,
  BlessThemeToggle,
  BlessToaster,
  useTheme,
} from "blessing-ui";
import "blessing-ui/style.css";
import "./custom.css";
import Demo from "./Demo.vue";
import PropsTable from "./PropsTable.vue";
import BlockDemo from "./BlockDemo.vue";
import BlockFrame from "./BlockFrame.vue";
import HomeBrochure from "./HomeBrochure.vue";
import Eyecatch from "./Eyecatch.vue";
import ChapterCards from "./ChapterCards.vue";
import PageStrip from "./PageStrip.vue";
import MotionToggle from "./MotionToggle.vue";

// The site opens in Daylight on a first visit. The head script in config.ts does this before the
// first paint of a built page; the dev server adds head scripts only after the app reads the
// setting, so the same default runs here too, when the theme loads and before the app starts.
try {
  if (typeof localStorage !== "undefined" && !localStorage.getItem("vitepress-theme-appearance"))
    localStorage.setItem("vitepress-theme-appearance", "light");
} catch {}
// Firefox redraws text without its font while a late font slice loads. Warm primary faces once idle.
if (typeof document !== "undefined" && document.fonts)
  (window.requestIdleCallback ?? setTimeout)(() => {
    for (const w of [400, 500, 600, 700]) void document.fonts.load(`${w} 1em "Plus Jakarta Sans"`);
    void document.fonts.load('400 1em "Newsreader"');
  });

export default {
  extends: DefaultTheme,
  Layout() {
    // One theme across three moods (Daylight, Golden hour, Night) plus System: VitePress only
    // tracks light vs dark (`isDark`), so Night maps to `isDark = true`, and Daylight / Golden
    // hour map to `isDark = false`. `BlessThemeToggle mode="group"` in the nav drives all four.
    const { isDark } = useData();
    const bless = useTheme(); // also boots the persisted palette, including full-page demos
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("bless-booting");
      queueMicrotask(() => {
        let savedBless: string | null = null;
        let savedVp: string | null = null;
        try {
          savedBless = localStorage.getItem("bless-theme");
          savedVp = localStorage.getItem("vitepress-theme-appearance");
        } catch {}
        if (savedBless === "golden" || savedBless === "dark" || savedBless === "light" || savedBless === "system") {
          bless.set(savedBless);
        } else {
          bless.set(savedVp === "dark" || savedVp === "light" ? savedVp : "light");
        }
        isDark.value = bless.isDark.value;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => document.documentElement.classList.remove("bless-booting")),
        );
        watch(isDark, (d) => {
          if (d && !bless.isDark.value) bless.set("dark");
          else if (!d && bless.isDark.value) bless.set("light");
        });
        watch(bless.isDark, (d) => {
          if (d !== isDark.value) isDark.value = d;
        });
      });
    }
    return h(DefaultTheme.Layout, null, {
      "layout-bottom": () => [h(BlessToaster), h(BlessDialogHost), h(BlessLoadingBar)],
      "doc-before": () => h(PageStrip),
      "nav-bar-content-after": () => [
        h(BlessThemeToggle, { mode: "group", class: "nav-mood" }),
        h(BlessPaletteToggle, { class: "nav-palette", showDefault: true }),
        h(MotionToggle),
      ],
      "nav-screen-content-after": () => [
        h(BlessThemeToggle, { mode: "group", class: "nav-mood" }),
        h(BlessPaletteToggle, { class: "nav-palette", showDefault: true }),
        h(MotionToggle),
      ],
    });
  },
  enhanceApp({ app, router }) {
    // Component and block pages are English only: the language switch on them points at
    // /id/components/… and /id/blocks/…, so send those to the English page. public/_redirects
    // does the same for a direct visit.
    router.onBeforeRouteChange = (to) => {
      const english = to.match(/^\/id(\/(components|blocks)\/.*)$/)?.[1];
      if (english) {
        router.go(english);
        return false;
      }
    };
    app.component("Demo", Demo);
    app.component("PropsTable", PropsTable);
    app.component("BlockDemo", BlockDemo);
    app.component("BlockFrame", BlockFrame);
    app.component("HomeBrochure", HomeBrochure);
    app.component("Eyecatch", Eyecatch);
    app.component("ChapterCards", ChapterCards);
  },
} satisfies Theme;
