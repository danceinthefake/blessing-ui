import { mount } from "@vue/test-utils";
import BlessEmailView from "./BlessEmailView.vue";

const props = {
  subject: "Episode 41 edit",
  from: { name: "Ana", email: "ana@example.com" },
  to: [{ name: "Budi", email: "budi@example.com" }],
  cc: [{ name: "Citra", email: "citra@example.com" }],
  date: "16 Nov, 09:12",
  body: "Hi Budi,\n\nThe edit is ready.\n\n\nThanks",
  attachments: [{ name: "ep41.mp3", description: "48 MB" }],
};

test("BlessEmailView: subject, sender, names that expand to addresses, paragraphs, and attachments", async () => {
  const w = mount(BlessEmailView, { props, slots: { actions: "<button>Reply</button>" } });
  expect(w.find(".bless-email__subject").text()).toBe("Episode 41 edit");
  expect(w.find(".bless-email__from").text()).toBe("Ana <ana@example.com>");
  expect(w.find(".bless-email__to").text()).toContain("to Budi, cc Citra");
  await w.find(".bless-email__more").trigger("click");
  expect(w.find(".bless-email__more").attributes("aria-expanded")).toBe("true");
  expect(w.find(".bless-email__to").text()).toContain("Budi <budi@example.com>");
  expect(w.findAll(".bless-email__body p").map((p) => p.text())).toEqual([
    "Hi Budi,",
    "The edit is ready.",
    "Thanks",
  ]);
  expect(w.find(".bless-email__count").text()).toBe("1 attachment");
  expect(w.find(".bless-email__actions button").text()).toBe("Reply");
});
