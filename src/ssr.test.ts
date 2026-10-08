// Every docs demo is a realistic use of the library: render it on the server, hydrate that HTML in
// the browser, and fail on a crash (window/document touched during setup) or a hydration mismatch
// (random or clock values read during setup).
import { createSSRApp, type Component } from "vue";
import { renderToString } from "vue/server-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

// left out: they pull in vitepress itself (LayoutFull, StageFull) or ProseMirror, which needs a
// real DOM to build its document (Editor), and AudioPlayerBasic builds a WAV Blob that jsdom can't
const demos = import.meta.glob<Component>(
  ["../docs/demos/*.vue", "!../docs/demos/{Audio,Editor,LayoutFull,StageFull}*.vue"],
  { eager: true, import: "default" },
);

// jsdom has no ResizeObserver / IntersectionObserver; components only construct them after mount
for (const name of ["ResizeObserver", "IntersectionObserver"] as const)
  (globalThis as Record<string, unknown>)[name] ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
Element.prototype.scrollTo ??= () => {};
// ...and no canvas 2d context
HTMLCanvasElement.prototype.getContext = (() =>
  new Proxy({}, { get: () => () => {}, set: () => true })) as never;
// jsdom has no matchMedia; the media composables only read it after mount
window.matchMedia ??= ((q: string) => ({
  matches: false,
  media: q,
  addEventListener() {},
  removeEventListener() {},
})) as unknown as typeof window.matchMedia;

describe("ssr · hydration", () => {
  afterEach(() => vi.restoreAllMocks());
  for (const [path, demo] of Object.entries(demos)) {
    const name = path.split("/").pop()!.replace(".vue", "");
    it(name, async () => {
      const ctx: { teleports?: Record<string, string> } = {};
      const html = await renderToString(createSSRApp(demo), ctx);
      const el = document.createElement("div");
      el.innerHTML = html;
      document.body.append(el);
      // teleported markup travels separately; a real SSR framework injects it into its target
      const targets = Object.entries(ctx.teleports ?? {}).map(([sel, markup]) => {
        const t = document.querySelector(sel)!;
        t.insertAdjacentHTML("beforeend", markup);
        return t;
      });
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const app = createSSRApp(demo);
      app.mount(el);
      app.unmount();
      el.remove();
      const bad = warn.mock.calls
        .map((c) => c.map(String).join(" "))
        .filter((m) => /hydrat/i.test(m));
      expect(bad.join("\n")).toBe("");
    });
  }
});
