import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCodeTabs, { managerCommand } from "./BlessCodeTabs.vue";

test("managerCommand: add, run, and run once for each package manager", () => {
  expect(managerCommand("npm", "install", "vue")).toBe("npm install vue");
  expect(managerCommand("pnpm", "install", "vitest", true)).toBe("pnpm add -D vitest");
  expect(managerCommand("npm", "run", "dev")).toBe("npm run dev");
  expect(managerCommand("yarn", "run", "dev")).toBe("yarn dev");
  expect(managerCommand("bun", "exec", "nuxi init")).toBe("bunx nuxi init");
  expect(managerCommand("npm", "exec", "nuxi init")).toBe("npx nuxi init");
});

test("BlessCodeTabs: a tab for each manager, and two blocks of one group keep the same choice", async () => {
  localStorage.clear();
  const w = mount({
    components: { BlessCodeTabs },
    template: `<div><BlessCodeTabs install="blessing-ui" group="t1" /><BlessCodeTabs run="dev" group="t1" /></div>`,
  });
  const blocks = w.findAllComponents(BlessCodeTabs);
  expect(blocks[0]!.findAll("[role=tab]").map((t) => t.text())).toEqual([
    "pnpm",
    "npm",
    "yarn",
    "bun",
  ]);
  expect(blocks[0]!.find("code").text()).toBe("pnpm add blessing-ui");
  await blocks[0]!.findAll("[role=tab]")[3]!.trigger("click");
  await nextTick();
  expect(blocks[0]!.find("code").text()).toBe("bun add blessing-ui");
  expect(blocks[1]!.find("code").text()).toBe("bun run dev");
  expect(localStorage.getItem("bless-codetabs:t1")).toBe("bun");
});

test("BlessCodeTabs: the stored choice comes back after mount, and own tabs work", async () => {
  localStorage.setItem("bless-codetabs:t2", "yarn");
  const w = mount(BlessCodeTabs, { props: { install: "vue", dev: true, group: "t2" } });
  await nextTick();
  expect(w.find("code").text()).toBe("yarn add -D vue");
  const own = mount(BlessCodeTabs, {
    props: {
      group: "t3",
      tabs: [
        { name: "macOS", code: "brew install ffmpeg" },
        { name: "Linux", code: "apt install ffmpeg" },
      ],
    },
  });
  expect(own.findAll("[role=tab]").map((t) => t.text())).toEqual(["macOS", "Linux"]);
});
