import { mount } from "@vue/test-utils";
import BlessWishlistButton from "./BlessWishlistButton.vue";

test("BlessWishlistButton: a pressed toggle named after the product, a count, and a status only after a click", async () => {
  const w = mount(BlessWishlistButton, {
    props: {
      name: "Mic",
      count: 12,
      "onUpdate:modelValue": (v: boolean) => w.setProps({ modelValue: v }),
    },
  });
  const b = w.find("button");
  expect(b.text()).toBe("Save Mic to the wishlist 12");
  expect(b.attributes("aria-pressed")).toBe("false");
  expect(w.find(".bless-wish__count").text()).toBe("12");
  expect(w.find("[role=status]").text()).toBe("");
  await b.trigger("click");
  expect(b.attributes("aria-pressed")).toBe("true");
  expect(b.classes()).toContain("is-saved");
  expect(w.find("[role=status]").text()).toBe("Mic is in your wishlist.");
  await b.trigger("click");
  expect(w.find("[role=status]").text()).toBe("Mic is out of your wishlist.");
});
