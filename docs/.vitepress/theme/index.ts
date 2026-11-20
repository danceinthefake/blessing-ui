import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { h, watch } from "vue";
import type { Theme } from "vitepress";
import {
  BlessDialogHost,
  BlessLoadingBar,
  BlessPaletteToggle,
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

// The site opens light on a first visit. The head script in config.ts does this before the first
// paint of a built page; the dev server adds head scripts only after the app reads the setting, so
// the same default runs here too, when the theme loads and before the app starts.
try {
  if (typeof localStorage !== "undefined" && !localStorage.getItem("vitepress-theme-appearance"))
    localStorage.setItem("vitepress-theme-appearance", "light");
} catch {}
// Firefox redraws the text without its font while a late font file loads: the first visit to a
// page with a symbol (★ ▶ ⚙) flashed blank. Load Roboto's symbols subset once the first page is idle.
if (typeof document !== "undefined" && document.fonts)
  (window.requestIdleCallback ?? setTimeout)(() => {
    for (const w of [100, 300, 400, 700]) void document.fonts.load(`${w} 1em Roboto`, "★");
  });

export default {
  extends: DefaultTheme,
  Layout() {
    // One theme, two switches: VitePress's nav switch (html.dark, "vitepress-theme-appearance")
    // and the library's (data-theme, "bless-theme"). VitePress's choice wins at load — useTheme()
    // applies its saved value in a microtask, so ours is queued after it — and from then on
    // flipping either one flips the other. Without this, a saved bless-theme overrode the nav on
    // every refresh.
    const { isDark } = useData();
    const bless = useTheme(); // also boots the persisted palette, including full-page demos
    if (typeof window !== "undefined") {
      queueMicrotask(() => {
        // VitePress saves "auto" when the choice matches the OS: that is the library's "system"
        let saved: string | null = null;
        try {
          saved = localStorage.getItem("vitepress-theme-appearance");
        } catch {}
        bless.set(saved === "dark" || saved === "light" ? saved : "system");
        watch(isDark, (d) => bless.set(d ? "dark" : "light"));
        watch(bless.isDark, (d) => d !== isDark.value && (isDark.value = d));
      });
    }
    return h(DefaultTheme.Layout, null, {
      "layout-bottom": () => [h(BlessToaster), h(BlessDialogHost), h(BlessLoadingBar)],
      "doc-before": () => h(PageStrip),
      "nav-bar-content-after": () => [
        h(BlessPaletteToggle, { class: "nav-palette", showDefault: true }),
        h(MotionToggle),
      ],
      "nav-screen-content-after": () => h(MotionToggle),
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
