import { mount } from "@vue/test-utils";
import BlessDocumentStatus from "./BlessDocumentStatus.vue";

const states = [
  { id: "draft", label: "Draft", time: "1 Nov" },
  { id: "approved", label: "Approved", time: "2 Nov" },
  { id: "sent", label: "Sent" },
  { id: "paid", label: "Paid" },
];

test("BlessDocumentStatus: done, current, and next in words, and a button to the next state", async () => {
  const w = mount(BlessDocumentStatus, {
    props: {
      states,
      modelValue: "approved",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  const items = w.findAll(".bless-docstate__state");
  expect(items.map((i) => i.find(".bless-sr").text())).toEqual([
    ", done",
    ", current state",
    ", not yet",
    ", not yet",
  ]);
  expect(items[1]!.attributes("aria-current")).toBe("step");
  expect(items[0]!.find(".bless-docstate__time").text()).toBe("1 Nov");
  const b = w.find("button");
  expect(b.text()).toBe("Mark as Sent");
  await b.trigger("click");
  expect(w.props("modelValue")).toBe("sent");
  expect(w.emitted("advance")).toEqual([["sent"]]);
  expect(w.find("button").text()).toBe("Mark as Paid");
});

test("BlessDocumentStatus: a stopped document ends the chain and has no next step", () => {
  const w = mount(BlessDocumentStatus, {
    props: { states, modelValue: "approved", stopped: "Cancelled" },
  });
  expect(w.find(".is-stop").text()).toContain("Cancelled");
  expect(w.find("button").exists()).toBe(false);
});
