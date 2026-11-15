import { mount } from "@vue/test-utils";
import BlessRsvp from "./BlessRsvp.vue";

const going = [{ name: "Ana" }, { name: "Budi" }];

test("BlessRsvp: three toggles with counts, the reader adds one, and a second click clears", async () => {
  const w = mount(BlessRsvp, {
    props: {
      counts: { yes: 12, maybe: 3 },
      going,
      label: "Live recording, 28 Nov",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  const b = () => w.findAll(".bless-rsvp__answer");
  expect(b().map((x) => x.text())).toEqual(["Going12", "Maybe3", "Can't go0"]);
  expect(w.attributes("aria-label")).toBe("Live recording, 28 Nov");
  await b()[0]!.trigger("click");
  expect(b()[0]!.attributes("aria-pressed")).toBe("true");
  expect(b()[0]!.text()).toBe("Going13");
  expect(w.find(".bless-rsvp__total").text()).toBe("13 going");
  expect(w.findComponent({ name: "BlessAvatarGroup" }).props("items")).toHaveLength(3);
  await b()[1]!.trigger("click");
  expect(b().map((x) => x.text())).toEqual(["Going12", "Maybe4", "Can't go0"]);
  await b()[1]!.trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([undefined]);
});

test("BlessRsvp: no faces and no total with nobody going, and labels translate", () => {
  const w = mount(BlessRsvp, { props: { labels: { yes: "Hadir", question: "Kamu datang?" } } });
  expect(w.find(".bless-rsvp__going").exists()).toBe(false);
  expect(w.find(".bless-rsvp__answer").text()).toBe("Hadir0");
  expect(w.attributes("aria-label")).toBe("Kamu datang?");
});
