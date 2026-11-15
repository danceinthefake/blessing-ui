import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSpoiler from "./BlessSpoiler.vue";

test("BlessSpoiler: hidden text is out of reach, and a button with the hint shows it", async () => {
  const w = mount(BlessSpoiler, {
    props: {
      hint: "the end of episode 41",
      "onUpdate:shown": (v: boolean) => w.setProps({ shown: v }),
    },
    slots: { default: "Budi was the host all along." },
    attachTo: document.body,
  });
  const t = () => w.find(".bless-spoiler__text");
  expect(w.element.tagName).toBe("SPAN");
  expect(t().attributes("aria-hidden")).toBe("true");
  expect(t().attributes("inert")).toBeDefined();
  const b = w.find("button");
  expect(b.attributes("aria-label")).toBe("Show the spoiler: the end of episode 41");
  await b.trigger("click");
  await nextTick();
  expect(w.find("button").exists()).toBe(false);
  expect(t().attributes("aria-hidden")).toBeUndefined();
  expect(w.classes()).toContain("is-shown");
  expect(document.activeElement).toBe(w.element);
  expect(w.emitted("update:shown")).toEqual([[true]]);
  w.unmount();
});

test("BlessSpoiler: a block shows a visible badge, and labels translate", () => {
  const w = mount(BlessSpoiler, {
    props: { block: true, labels: { show: "Tampilkan" } },
    slots: { default: "<p>Long text</p>" },
  });
  expect(w.element.tagName).toBe("DIV");
  expect(w.find(".bless-spoiler__badge").text()).toBe("Tampilkan");
  expect(w.find("button").attributes("aria-label")).toBe("Tampilkan");
});
