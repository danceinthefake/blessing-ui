import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json", include: ["src"], entryRoot: "src" })],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "BlessingUI",
      fileName: "blessing-ui",
      formats: ["es"],
      cssFileName: "blessing-ui",
    },
    rollupOptions: { external: ["vue"] },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
});
