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
import HomeSections from "./HomeSections.vue";

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
        bless.set(isDark.value ? "dark" : "light");
        watch(isDark, (d) => bless.set(d ? "dark" : "light"));
        watch(bless.isDark, (d) => d !== isDark.value && (isDark.value = d));
      });
    }
    return h(DefaultTheme.Layout, null, {
      "layout-bottom": () => [h(BlessToaster), h(BlessDialogHost), h(BlessLoadingBar)],
      "home-features-after": () => h(HomeSections),
      "nav-bar-content-after": () =>
        h(BlessPaletteToggle, { class: "nav-palette", showDefault: true }),
    });
  },
  enhanceApp({ app }) {
    app.component("Demo", Demo);
    app.component("PropsTable", PropsTable);
    app.component("BlockDemo", BlockDemo);
    app.component("BlockFrame", BlockFrame);
  },
} satisfies Theme;
