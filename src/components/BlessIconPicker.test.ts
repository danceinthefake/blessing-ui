import { mount } from "@vue/test-utils";
import BlessIconPicker from "./BlessIconPicker.vue";

const icons = [
  {
    name: "mic",
    path: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",
    keywords: ["record", "audio"],
  },
  { name: "play", path: "M8 5v14l11-7Z" },
  {
    name: "headphones",
    path: ["M3 14v-2a9 9 0 0 1 18 0v2", "M3 14h4v6H3zM17 14h4v6h-4z"],
    keywords: ["audio"],
  },
];

test("BlessIconPicker: a radio per icon with its name, the paths, and a pick sets the model", async () => {
  const w = mount(BlessIconPicker, {
    props: {
      icons,
      modelValue: "play",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  const radios = w.findAll("input[type=radio]");
  expect(radios.map((r) => r.attributes("aria-label"))).toEqual(["mic", "play", "headphones"]);
  expect((radios[1]!.element as HTMLInputElement).checked).toBe(true);
  expect(w.findAll(".bless-iconpick__icon")[2]!.findAll("path")).toHaveLength(2);
  await radios[0]!.trigger("change");
  expect(w.props("modelValue")).toBe("mic");
});

test("BlessIconPicker: the search matches names and keywords and counts them", async () => {
  const w = mount(BlessIconPicker, { props: { icons } });
  expect(w.find("[role=status]").text()).toBe("3 icons");
  await w.find("input[type=search]").setValue("AUDIO");
  expect(w.findAll("input[type=radio]").map((r) => r.attributes("value"))).toEqual([
    "mic",
    "headphones",
  ]);
  await w.find("input[type=search]").setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("No icon matches");
});
