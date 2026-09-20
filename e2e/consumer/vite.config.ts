import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// ENTRY=one|all — separate builds so each bundle is measured on its own; vue is external like in a real app
const entry = process.env.ENTRY ?? "one";
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: `dist/${entry}`,
    rollupOptions: {
      input: `src/${entry}.ts`,
      external: ["vue"],
      output: { entryFileNames: `${entry}.js`, inlineDynamicImports: true },
    },
  },
});
