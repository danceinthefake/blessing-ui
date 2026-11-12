import { addComponent, defineNuxtModule } from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { blessComponents, componentPath } from "./components";

/** Nuxt: `modules: ["blessing-ui/nuxt"]`. Every component auto-imports, and the tokens load once. */
const blessingUi: NuxtModule = defineNuxtModule({
  meta: { name: "blessing-ui", configKey: "blessingUi" },
  setup(_options, nuxt) {
    nuxt.options.css.push("blessing-ui/tokens.css");
    for (const name of blessComponents())
      addComponent({ name, export: "default", filePath: componentPath(name) });
  },
});
export default blessingUi;
