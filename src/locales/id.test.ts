import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import BlessCopyButton from "../components/BlessCopyButton.vue";
import BlessThread from "../components/BlessThread.vue";
import { provideLabels } from "../composables/useLabels";
import { labelsId, type BlessLabelsFull } from "./id";

const sources = import.meta.glob<string>("../components/Bless*.vue", {
  eager: true,
  query: "?raw",
  import: "default",
});
const packNames = Object.values(sources)
  .map((s) => /useLabelPack\("(\w+)"\)/.exec(s)?.[1])
  .filter((n): n is string => !!n)
  .sort();

test("labelsId has an entry for every component that reads a pack, and no other", () => {
  expect(Object.keys(labelsId).sort()).toEqual(packNames);
});

test("every word is set: no empty text and no missing function", () => {
  for (const [component, words] of Object.entries(labelsId))
    for (const [key, word] of Object.entries(words))
      expect(
        typeof word === "function" || (typeof word === "string" && word.length > 0),
        `${component}.${key}`,
      ).toBe(true);
});

// a component whose `labels` type the helper could not read would come out as {} and accept anything
type Empty = {
  [K in keyof BlessLabelsFull]: {} extends BlessLabelsFull[K] ? K : never;
}[keyof BlessLabelsFull];
expectTypeOf<Empty>().toEqualTypeOf<never>();

test("with the pack provided, components speak Indonesian", () => {
  const w = mount(
    defineComponent({
      setup() {
        provideLabels(labelsId);
        return () =>
          h("div", [
            h(BlessCopyButton, { value: "x" }),
            h(BlessThread, {
              comments: [
                {
                  id: 1,
                  body: "a",
                  replies: [
                    { id: 2, body: "b" },
                    { id: 3, body: "c" },
                  ],
                },
              ],
            }),
          ]);
      },
    }),
  );
  expect(w.find("button").text()).toBe("Salin");
  expect(w.find("summary").text()).toBe("2 balasan");
});
