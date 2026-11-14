import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// ENTRY=one|all — separate builds so each bundle is measured on its own; vue and the peers are external like in a real app
const entry = process.env.ENTRY ?? "one";
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: `dist/${entry}`,
    rollupOptions: {
      input: `src/${entry}.ts`,
      // the optional peers are the app's own dependencies, not the library's cost
      external: ["vue", "marked"],
      output: { entryFileNames: `${entry}.js`, inlineDynamicImports: true },
    },
  },
});
