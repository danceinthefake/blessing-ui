import { mount } from "@vue/test-utils";
import BlessEmailComposer, { type BlessEmailDraft } from "./BlessEmailComposer.vue";

const sheet = (d?: Partial<BlessEmailDraft>) => {
  const w = mount(BlessEmailComposer, {
    props: {
      modelValue: { to: [], cc: [], subject: "", body: "", ...d },
      "onUpdate:modelValue": (v: BlessEmailDraft) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};

test("BlessEmailComposer: no recipient and bad addresses stop the send with a message", async () => {
  const w = sheet();
  await w.find("form").trigger("submit");
  expect(w.find("[role=alert]").text()).toBe("Add at least one recipient.");
  expect(w.emitted("send")).toBeUndefined();
  await w.setProps({
    modelValue: { to: ["budi@example", "ana@example.com"], cc: [], subject: "", body: "" },
  });
  expect(w.find("[role=alert]").text()).toBe("These addresses are not valid: budi@example");
});

test("BlessEmailComposer: Cc opens, fields write the draft, and send emits it", async () => {
  const w = sheet({ to: ["ana@example.com"] });
  expect(w.findAll(".bless-tags")).toHaveLength(1);
  await w.find(".bless-compose__cc").trigger("click");
  expect(w.findAll(".bless-tags")).toHaveLength(2);
  expect(w.findAll(".bless-tags__input")[1]!.attributes("aria-label")).toBe("Cc");
  await w.find(".bless-compose__input").setValue("Edit");
  await w.find("textarea").setValue("Ready.");
  await w.find("form").trigger("submit");
  expect(w.emitted("send")![0]).toEqual([
    { to: ["ana@example.com"], cc: [], subject: "Edit", body: "Ready." },
  ]);
  await w.findAll("button").at(-1)!.trigger("click");
  expect(w.emitted("discard")).toHaveLength(1);
});

test("BlessEmailComposer shows Cc when a new draft brings Cc addresses", async () => {
  const w = sheet();
  expect(w.find(`input[id$="-cc"]`).exists()).toBe(false);
  await w.setProps({
    modelValue: { to: ["a@x.example"], cc: ["b@x.example"], subject: "", body: "" },
  });
  expect(w.find(`input[id$="-cc"]`).exists()).toBe(true);
  expect(w.text()).toContain("b@x.example");
});
