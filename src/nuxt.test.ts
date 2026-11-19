import { describe, expect, it, vi } from "vitest";

const kit = vi.hoisted(() => ({
  addComponent: vi.fn(),
  addPluginTemplate: vi.fn(),
  defineNuxtModule: (def: unknown) => def,
}));
vi.mock("@nuxt/kit", () => kit);
// in source there are .vue files, not the built .js files that blessComponents reads
vi.mock("./components", () => ({
  blessComponents: () => ["BlessButton", "BlessCard"],
  componentPath: (n: string) => n,
}));

import blessingUi from "./nuxt";

type Def = { defaults: object; setup: (o: object, n: object) => void };
const run = (options: object) => {
  kit.addComponent.mockClear();
  const nuxt = { options: { css: [] as string[] } };
  const def = blessingUi as unknown as Def;
  def.setup({ ...def.defaults, ...options }, nuxt);
  return nuxt;
};

describe("nuxt module", () => {
  it("registers the components by default", () => {
    const nuxt = run({});
    expect(kit.addComponent).toHaveBeenCalledTimes(2);
    expect(nuxt.options.css).toContain("blessing-ui/tokens.css");
  });
  it("components: false skips them and keeps the tokens and NuxtLink", () => {
    kit.addPluginTemplate.mockClear();
    const nuxt = run({ components: false });
    expect(kit.addComponent).not.toHaveBeenCalled();
    expect(kit.addPluginTemplate).toHaveBeenCalledOnce();
    expect(nuxt.options.css).toContain("blessing-ui/tokens.css");
  });
});
