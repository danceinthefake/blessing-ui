import { mount } from "@vue/test-utils";
import BlessTerminal from "./BlessTerminal.vue";

test("BlessTerminal: prompt on commands, errors in words, run, and the history keys", async () => {
  const w = mount(BlessTerminal, {
    props: {
      lines: [
        { kind: "in", text: "pnpm build" },
        { text: "done in 2s" },
        { kind: "in", text: "pnpm test" },
        { kind: "err", text: "1 failed" },
      ],
    },
  });
  const lines = w.findAll(".bless-term__line");
  expect(lines[0]!.text()).toBe("$ pnpm build");
  expect(lines[3]!.text()).toBe("Error: 1 failed");
  expect(w.find("[role=log]").attributes("aria-label")).toBe("Terminal output");
  const input = w.find("input");
  await input.trigger("keydown", { key: "ArrowUp" });
  expect((input.element as HTMLInputElement).value).toBe("pnpm test");
  await input.trigger("keydown", { key: "ArrowUp" });
  await input.trigger("keydown", { key: "ArrowUp" });
  expect((input.element as HTMLInputElement).value).toBe("pnpm build");
  await input.trigger("keydown", { key: "ArrowDown" });
  await input.trigger("keydown", { key: "ArrowDown" });
  expect((input.element as HTMLInputElement).value).toBe("");
  await input.setValue("  ls  ");
  await w.find("form").trigger("submit");
  expect(w.emitted("run")).toEqual([["ls"]]);
  await w.setProps({ readonly: true });
  expect(w.find("form").exists()).toBe(false);
});
