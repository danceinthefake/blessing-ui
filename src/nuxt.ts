import { addComponent, addPluginTemplate, defineNuxtModule } from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { blessComponents, componentPath } from "./components";

/**
 * Nuxt: `modules: ["blessing-ui/nuxt"]`. Every component auto-imports, the tokens load once, and
 * in-app links render as NuxtLink. A plugin of your own that provides `blessLinkKey` runs later and wins.
 * `blessingUi: { components: false }` turns off the auto-import. The tokens and NuxtLink stay.
 */
const blessingUi: NuxtModule<{ components: boolean }> = defineNuxtModule<{ components: boolean }>({
  meta: { name: "blessing-ui", configKey: "blessingUi" },
  defaults: { components: true },
  setup(options, nuxt) {
    nuxt.options.css.push("blessing-ui/tokens.css");
    if (options.components)
      for (const name of blessComponents())
        addComponent({ name, export: "default", filePath: componentPath(name) });
    addPluginTemplate({
      filename: "blessing-ui-link.mjs",
      getContents: () =>
        [
          'import { defineNuxtPlugin } from "#imports";',
          'import { NuxtLink } from "#components";',
          'import { blessLinkKey } from "blessing-ui";',
          "export default defineNuxtPlugin((nuxtApp) => {",
          "  nuxtApp.vueApp.provide(blessLinkKey, NuxtLink);",
          "});",
        ].join("\n"),
    });
  },
});
export default blessingUi;
