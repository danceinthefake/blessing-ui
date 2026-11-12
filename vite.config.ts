import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      exclude: ["src/test", "src/**/*.test.ts"],
      entryRoot: "src",
    }),
  ],
  build: {
    lib: {
      // resolver and nuxt run in Node at build time of the consumer; they are separate entries
      entry: {
        index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        resolver: fileURLToPath(new URL("./src/resolver.ts", import.meta.url)),
        nuxt: fileURLToPath(new URL("./src/nuxt.ts", import.meta.url)),
      },
      formats: ["es"],
    },
    // one JS module per source file, one CSS file per SFC; scripts/postbuild.mjs
    // links each module to its CSS and assembles the all-in-one stylesheet
    cssCodeSplit: true,
    rollupOptions: {
      external: ["vue", "@nuxt/kit", /^node:/],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
  test: {
    // the docs demos import the library by name; point them at the source
    alias: { "blessing-ui": resolve(import.meta.dirname, "src/index.ts") },
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    globals: true,
    testTimeout: 15000,
  },
});
