import { mount } from "@vue/test-utils";
import BlessGroupCard from "./BlessGroupCard.vue";

const sheet = (props: Record<string, unknown>) => {
  const w = mount(BlessGroupCard, {
    props: {
      name: "Mic club",
      members: 2480,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
      ...props,
    },
  });
  return w;
};

test("BlessGroupCard: public join and leave, a short member count, and the name in the button", async () => {
  const w = sheet({
    href: "/g/mic",
    description: "Talk about mics.",
    faces: [{ name: "Ana" }, { name: "Budi" }],
  });
  expect(w.find(".bless-group__meta").text()).toContain("Public group · 2.5K members");
  expect(w.find(".bless-group__name a").attributes("href")).toBe("/g/mic");
  expect(w.findAll(".bless-avatar").length).toBeGreaterThan(0);
  const b = w.find(".bless-group__join");
  expect(b.text()).toBe("Join: Mic club");
  await b.trigger("click");
  expect(w.props("modelValue")).toBe("member");
  expect(w.find(".bless-group__join").text()).toBe("Joined: Mic club");
  await w.find(".bless-group__join").trigger("click");
  expect(w.props("modelValue")).toBe("none");
});

test("BlessGroupCard: a private group asks to join first", async () => {
  const w = sheet({ private: true });
  expect(w.find(".bless-group__meta").text()).toContain("Private group");
  expect(w.find(".bless-group__join").text()).toBe("Ask to join: Mic club");
  await w.find(".bless-group__join").trigger("click");
  expect(w.props("modelValue")).toBe("requested");
  expect(w.find(".bless-group__join").text()).toBe("Request sent: Mic club");
});
