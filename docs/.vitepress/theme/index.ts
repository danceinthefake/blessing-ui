import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { watchEffect, h } from "vue";
import type { Theme } from "vitepress";
import { BlessDialogHost, BlessLoadingBar, BlessPaletteToggle, BlessToaster } from "blessing-ui";
import "blessing-ui/style.css";
import "./custom.css";
import Demo from "./Demo.vue";
import PropsTable from "./PropsTable.vue";
import BlockDemo from "./BlockDemo.vue";

export default {
  extends: DefaultTheme,
  Layout() {
    // VitePress toggles html.dark; the library keys on data-theme. Keep them in step.
    const { isDark } = useData();
    watchEffect(() => {
      if (typeof document === "undefined") return;
      document.documentElement.dataset.theme = isDark.value ? "dark" : "light";
    });
    return h(DefaultTheme.Layout, null, {
      "layout-bottom": () => [h(BlessToaster), h(BlessDialogHost), h(BlessLoadingBar)],
      "nav-bar-content-after": () =>
        h(BlessPaletteToggle, { class: "nav-palette", showDefault: true }),
    });
  },
  enhanceApp({ app }) {
    app.component("Demo", Demo);
    app.component("PropsTable", PropsTable);
    app.component("BlockDemo", BlockDemo);
  },
} satisfies Theme;
