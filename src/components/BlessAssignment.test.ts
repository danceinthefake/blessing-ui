import { mount } from "@vue/test-utils";
import BlessAssignment from "./BlessAssignment.vue";

test("BlessAssignment: state in words, hand in files, and the grade with feedback", async () => {
  const w = mount(BlessAssignment, {
    props: { title: "Mic lab", due: "Fri 21 Nov", points: 100, instructions: "Record.\nUpload." },
  });
  expect(w.find(".bless-assign__state").text()).toBe("To do");
  expect(w.find(".bless-assign__facts").text()).toBe("Due Fri 21 Nov100 points");
  const button = w.find(".bless-assign__work button");
  expect(button.attributes("disabled")).toBeDefined();
  const f = new File(["x"], "take1.wav");
  await w.setProps({ modelValue: [f] });
  await w.findAll(".bless-assign__work button").at(-1)!.trigger("click");
  expect(w.emitted("submit")).toEqual([[[f]]]);
  await w.setProps({ submitted: "Sat 22 Nov", late: true });
  expect(w.find(".bless-assign__state").text()).toBe("Handed in late");
  expect(w.find(".bless-assign__work").text()).toContain("✓ Handed in Sat 22 Nov");
  expect(w.find(".bless-assign__files").text()).toBe("take1.wav");
  await w.setProps({ grade: "88 / 100", feedback: "Clean take." });
  expect(w.find(".bless-assign__state").text()).toBe("Graded");
  expect(w.find(".bless-assign__grade").text()).toBe("Grade88 / 100FeedbackClean take.");
});
