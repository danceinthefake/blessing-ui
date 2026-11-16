import { mount } from "@vue/test-utils";
import BlessFollowButton from "./BlessFollowButton.vue";

test("BlessFollowButton: a pressed toggle named with the person, a compact count with the reader, and a status", async () => {
  const w = mount(BlessFollowButton, {
    props: {
      name: "Ana",
      followers: 1249,
      "onUpdate:modelValue": (v: boolean) => w.setProps({ modelValue: v }),
    },
  });
  const b = w.find("button");
  expect(b.text()).toBe("+ Follow: Ana");
  expect(b.attributes("aria-pressed")).toBe("false");
  expect(w.find(".bless-follow__count").text()).toBe("1.2K followers");
  expect(w.find("[role=status]").text()).toBe("");
  await b.trigger("click");
  expect(b.attributes("aria-pressed")).toBe("true");
  expect(b.text()).toBe("✓ Following: Ana");
  expect(w.find("[role=status]").text()).toBe("You follow Ana.");
  await w.setProps({ followers: 9 });
  expect(w.find(".bless-follow__count").text()).toBe("10 followers");
  await b.trigger("click");
  expect(w.find("[role=status]").text()).toBe("You no longer follow Ana.");
});
