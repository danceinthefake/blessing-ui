import { mount } from "@vue/test-utils";
import BlessTicketView from "./BlessTicketView.vue";

const props = {
  subject: "Mic hums",
  number: "#4012",
  customer: { name: "Eka", email: "eka@example.com" },
  priority: "urgent" as const,
  messages: [
    { id: "1", from: "Eka", role: "customer" as const, time: "09:00", body: "It hums." },
    { id: "2", from: "Ana", role: "note" as const, time: "09:05", body: "Ground loop?" },
  ],
};

test("BlessTicketView: subject, priority in words, the status menu, and notes marked as notes", async () => {
  const w = mount(BlessTicketView, {
    props: { ...props, "onUpdate:status": (v: unknown) => w.setProps({ status: v as never }) },
  });
  expect(w.find(".bless-tkview__subject").text()).toBe("Mic hums");
  expect(w.find(".bless-tkview__prio").text()).toBe("▲ Priority: Urgent");
  expect(w.find(".is-note .bless-tkview__tag").text()).toBe("Internal note");
  await w.find("select").setValue("solved");
  expect(w.props("status")).toBe("solved");
});

test("BlessTicketView: reply or add an internal note, with a hint for notes", async () => {
  const w = mount(BlessTicketView, { props });
  const send = () => w.find("button[type=submit]");
  expect(send().attributes("disabled")).toBeDefined();
  await w.find("textarea").setValue(" On my way ");
  await w.find("form").trigger("submit");
  expect(w.emitted("reply")).toEqual([["On my way", false]]);
  await w.findAll("input[type=radio]")[1]!.setValue(true);
  expect(w.find(".bless-tkview__hint").text()).toBe("Only your team sees this note.");
  expect(send().text()).toBe("Add the note");
  await w.find("textarea").setValue("Check cable");
  await w.find("form").trigger("submit");
  expect(w.emitted("reply")![1]).toEqual(["Check cable", true]);
});
