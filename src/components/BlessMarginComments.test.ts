import { mount } from "@vue/test-utils";
import BlessMarginComments from "./BlessMarginComments.vue";

test("BlessMarginComments: comments sit next to their block, and a new comment emits add", async () => {
  const w = mount(BlessMarginComments, {
    props: {
      blocks: [
        { id: "a", text: "First part." },
        { id: "b", text: "Second part." },
      ],
      comments: [{ id: "1", block: "b", author: "Sari", text: "Shorter?", time: "09:12" }],
    },
    attachTo: document.body,
  });
  const rows = w.findAll(".bless-margin__row");
  expect(rows[0]!.classes()).not.toContain("has-notes");
  expect(rows[1]!.classes()).toContain("has-notes");
  expect(rows[1]!.find("aside").attributes("aria-label")).toBe("Comments on part 2");
  expect(rows[1]!.find(".bless-margin__note").text()).toBe("Sari09:12Shorter?");
  await rows[0]!.find(".bless-margin__add").trigger("click");
  expect(document.activeElement?.tagName).toBe("TEXTAREA");
  await rows[0]!.find("form").trigger("submit");
  expect(w.emitted("add")).toBeUndefined();
  await rows[0]!.find("textarea").setValue("  Good start.  ");
  await rows[0]!.find("form").trigger("submit");
  expect(w.emitted("add")).toEqual([["a", "Good start."]]);
  expect(w.find("form").exists()).toBe(false);
  w.unmount();
});
