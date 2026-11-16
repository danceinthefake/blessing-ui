import { mount } from "@vue/test-utils";
import BlessWorkInstructions from "./BlessWorkInstructions.vue";

const steps = [
  { title: "Fit the capsule", body: "Push it in.", caution: "Wear gloves." },
  { title: "Close the body", body: "Turn it." },
];

test("BlessWorkInstructions: one step with its caution, back and next, the count, and finish", async () => {
  const w = mount(BlessWorkInstructions, {
    attachTo: document.body,
    props: {
      job: "Desk mic",
      steps,
      "onUpdate:modelValue": (v: number) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.find(".bless-instructions__count").text()).toBe("Step 1 of 2");
  expect(w.find("[role=note]").text()).toBe("⚠ Caution: Wear gloves.");
  const [back, next] = w.findAll(".bless-instructions__btn");
  expect(back!.attributes("disabled")).toBeDefined();
  expect(next!.text()).toBe("Next step →");
  await next!.trigger("click");
  expect(w.props("modelValue")).toBe(1);
  expect(w.find(".bless-instructions__title").text()).toBe("Close the body");
  expect(document.activeElement?.textContent).toBe("Close the body");
  expect(w.findAll(".bless-instructions__btn")[1]!.text()).toBe("Finish →");
  await w.findAll(".bless-instructions__btn")[1]!.trigger("click");
  expect(w.emitted("finish")).toHaveLength(1);
  w.unmount();
});
