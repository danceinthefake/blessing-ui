import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import BlessCopyButton from "../components/BlessCopyButton.vue";
import BlessEditor from "../components/BlessEditor.vue";
import BlessPoll from "../components/BlessPoll.vue";
import { provideLabels } from "./useLabels";

const wrap = (pack: Parameters<typeof provideLabels>[0], child: () => ReturnType<typeof h>) =>
  mount(
    defineComponent({
      setup() {
        provideLabels(pack);
        return child;
      },
    }),
  );

test("a pack replaces the English words of a component below it", () => {
  const w = wrap({ BlessCopyButton: { copy: "Copiar" } }, () => h(BlessCopyButton, { value: "x" }));
  expect(w.find("button").text()).toBe("Copiar");
});

test("the labels prop beats the pack, and the pack beats the default for the rest", async () => {
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const w = wrap({ BlessCopyButton: { copy: "Copiar", copied: "Copiado" } }, () =>
    h(BlessCopyButton, { value: "x", labels: { copy: "Cópia" } }),
  );
  expect(w.find("button").text()).toBe("Cópia");
  await w.find("button").trigger("click");
  await nextTick();
  expect(w.find("button").text()).toBe("Copiado");
  vi.unstubAllGlobals();
});

test("a pack for another component changes nothing; no pack keeps English", () => {
  const other = wrap({ BlessPoll: { vote: "Votar" } }, () => h(BlessCopyButton, { value: "x" }));
  expect(other.find("button").text()).toBe("Copy");
  expect(
    mount(BlessCopyButton, { props: { value: "x" } })
      .find("button")
      .text(),
  ).toBe("Copy");
});

test("a ref pack switches the language at run time", async () => {
  const pack = ref<Record<string, Record<string, unknown>>>({ BlessPoll: { vote: "Votar" } });
  const w = wrap(pack, () =>
    h(BlessPoll, { question: "Q", options: [{ value: "a", label: "A", votes: 1 }] }),
  );
  expect(w.find("button[type=submit]").text()).toBe("Votar");
  pack.value = { BlessPoll: { vote: "Voter" } };
  await nextTick();
  expect(w.find("button[type=submit]").text()).toBe("Voter");
});

test("functions in a pack work, for plural words", () => {
  const w = wrap({ BlessPoll: { votes: (n: number) => `${n} suara` } }, () =>
    h(BlessPoll, { question: "Q", closed: true, options: [{ value: "a", label: "A", votes: 3 }] }),
  );
  expect(w.text()).toContain("100% · 3 suara");
});

test("Editor tool names come from the pack when the prop has no entry", () => {
  const w = wrap({ BlessEditor: { bold: "Gras" } }, () => h(BlessEditor, { editor: null }));
  expect(w.html()).toContain("Gras");
});
