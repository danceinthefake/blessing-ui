import { mount } from "@vue/test-utils";
import BlessPickingList, { type BlessPickLine } from "./BlessPickingList.vue";

const sheet = (lines: BlessPickLine[]) => {
  const w = mount(BlessPickingList, {
    props: {
      order: "SO-1",
      modelValue: lines,
      "onUpdate:modelValue": (v: BlessPickLine[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const lines = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessPickLine[];
const scan = async (w: ReturnType<typeof sheet>, code: string) => {
  await w.find(".bless-sku input").setValue(code);
  await w.find(".bless-sku").trigger("submit");
};

test("BlessPickingList: walk order by location, scans that count, wrong and extra scans, and complete", async () => {
  const w = sheet([
    { id: "b", sku: "CBL-3", name: "Cable", location: "B-10", quantity: 1 },
    { id: "a", sku: "MIC-1", name: "Mic", location: "A-2", quantity: 2 },
  ]);
  expect(w.findAll(".bless-picking__loc").map((l) => l.text())).toEqual(["A-2", "B-10"]);
  expect(w.find("[role=status]").text()).toBe("0 of 3 items picked");
  await scan(w, "mic-1");
  expect(lines(w).find((l) => l.id === "a")!.picked).toBe(1);
  await scan(w, "XYZ");
  expect(w.find("[role=alert]").text()).toBe("XYZ is not on this list.");
  await w.find('[aria-label="One more Mic"]').trigger("click");
  await scan(w, "MIC-1");
  expect(w.find("[role=alert]").text()).toBe("Mic: all are picked already.");
  await scan(w, "CBL-3");
  expect(w.find("[role=status]").text()).toBe("All items are picked.");
  expect(w.emitted("complete")).toHaveLength(1);
});
