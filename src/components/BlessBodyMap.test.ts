import { mount } from "@vue/test-utils";
import BlessBodyMap, { type BlessBodyPart } from "./BlessBodyMap.vue";

test("BlessBodyMap: parts are named checkboxes, click and keys toggle, and the chosen line", async () => {
  const w = mount(BlessBodyMap, {
    props: { "onUpdate:modelValue": (v: BlessBodyPart[]) => w.setProps({ modelValue: v }) },
  });
  const parts = w.findAll("[role=checkbox]");
  expect(parts).toHaveLength(13);
  expect(parts[0]!.attributes("aria-label")).toBe("Head");
  expect(w.find("figcaption").text()).toBe("Nothing chosen yet.");
  await parts[0]!.trigger("click");
  await w.find('[aria-label="Left arm"]').trigger("keydown", { key: " " });
  expect(w.props("modelValue")).toEqual(["head", "leftArm"]);
  expect(w.find('[aria-label="Left arm"]').attributes("aria-checked")).toBe("true");
  expect(w.find("figcaption").text()).toBe("Chosen: Head, Left arm");
  await w.find('[aria-label="Head"]').trigger("keydown", { key: "Enter" });
  expect(w.props("modelValue")).toEqual(["leftArm"]);
});
