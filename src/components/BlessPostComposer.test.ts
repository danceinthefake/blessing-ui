import { mount } from "@vue/test-utils";
import BlessPostComposer from "./BlessPostComposer.vue";

const sheet = (props = {}) => {
  const w = mount(BlessPostComposer, {
    props: {
      max: 10,
      "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};
const postBtn = (w: ReturnType<typeof sheet>) => w.find("button[type=submit]");

test("BlessPostComposer: count by visible characters, over the limit is invalid, and post emits", async () => {
  const w = sheet();
  expect(postBtn(w).attributes("disabled")).toBeDefined();
  await w.find("textarea").setValue("Hi 👋🏽");
  // the emoji with a skin tone is one character
  expect(w.find(".bless-post__count").text()).toBe("6 characters left");
  await w.find("textarea").setValue("Hello, world!");
  expect(w.find(".bless-post__count").text()).toBe("3 characters too many");
  expect(w.find("textarea").attributes("aria-invalid")).toBe("true");
  expect(postBtn(w).attributes("disabled")).toBeDefined();
  await w.find("textarea").setValue(" New ep ");
  await w.find("form").trigger("submit");
  expect(w.emitted("post")).toEqual([[{ text: "New ep", images: [], poll: undefined }]]);
});

test("BlessPostComposer: a poll needs two choices, and can grow to four", async () => {
  const w = sheet({ modelValue: "Which day?" });
  await w.find("[aria-pressed]").trigger("click");
  expect(w.findAll(".bless-post__choice")).toHaveLength(2);
  expect(postBtn(w).attributes("disabled")).toBeDefined();
  await w.findAll(".bless-post__choice")[0]!.setValue("Fri");
  await w.findAll(".bless-post__choice")[1]!.setValue("Sat");
  await w.find(".bless-post__link").trigger("click");
  await w.find(".bless-post__link").trigger("click");
  expect(w.findAll(".bless-post__choice")).toHaveLength(4);
  expect(w.find(".bless-post__link").exists()).toBe(false);
  await w.find("form").trigger("submit");
  expect(w.emitted("post")![0]![0]).toMatchObject({ poll: ["Fri", "Sat"] });
});
