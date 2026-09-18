import { mount } from "@vue/test-utils";
import BlessInput from "./BlessInput.vue";
import BlessLabel from "./BlessLabel.vue";
import BlessSeparator from "./BlessSeparator.vue";
import BlessTextarea from "./BlessTextarea.vue";

test("BlessSeparator semantics", () => {
  expect(mount(BlessSeparator).element.tagName).toBe("HR");
  const v = mount(BlessSeparator, { props: { orientation: "vertical" } });
  expect(v.attributes("role")).toBe("separator");
  expect(v.attributes("aria-orientation")).toBe("vertical");
  const d = mount(BlessSeparator, { props: { decorative: true } });
  expect(d.element.tagName).toBe("DIV");
  expect(d.attributes("aria-hidden")).toBe("true");
  expect(mount(BlessSeparator, { props: { label: "or" } }).text()).toBe("or");
});

test("BlessLabel for/required/hint", () => {
  const w = mount(BlessLabel, {
    props: { for: "x", required: true, hint: "optional" },
    slots: { default: "Name" },
  });
  expect(w.attributes("for")).toBe("x");
  expect(w.find(".bless-label__required").exists()).toBe(true);
  expect(w.find(".bless-label__hint").text()).toBe("optional");
});

test("BlessInput v-model, attrs passthrough, error wiring", async () => {
  const w = mount(BlessInput, {
    props: { modelValue: "a", placeholder: "p", description: "help" },
  });
  const i = w.find("input");
  expect(i.attributes("placeholder")).toBe("p");
  expect(i.attributes("aria-describedby")).toBe(i.attributes("id") + "-desc");
  await i.setValue("b");
  expect(w.emitted("update:modelValue")![0]).toEqual(["b"]);

  await w.setProps({ error: "bad" });
  expect(i.attributes("aria-invalid")).toBe("true");
  expect(i.attributes("aria-describedby")).toBe(i.attributes("id") + "-err");
  expect(w.find('[role="alert"]').text()).toBe("bad");
  expect(w.find(".bless-input__description").exists()).toBe(false);
});

test("BlessTextarea counter + maxlength", async () => {
  const w = mount(BlessTextarea, { props: { modelValue: "hey", maxlength: 10, counter: true } });
  expect(w.find(".bless-textarea__counter").text()).toBe("3 / 10");
  expect(w.find("textarea").attributes("maxlength")).toBe("10");
  await w.find("textarea").setValue("hello");
  expect(w.emitted("update:modelValue")![0]).toEqual(["hello"]);
});
