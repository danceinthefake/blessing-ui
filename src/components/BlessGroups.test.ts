import { mount } from "@vue/test-utils";
import { h } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessButtonGroup from "./BlessButtonGroup.vue";
import BlessEmpty from "./BlessEmpty.vue";
import BlessInput from "./BlessInput.vue";
import BlessInputGroup from "./BlessInputGroup.vue";
import BlessItem from "./BlessItem.vue";
import BlessSpinner from "./BlessSpinner.vue";

test("BlessSpinner is a status with label; BlessButton loading shows one", () => {
  const s = mount(BlessSpinner, { props: { label: "Saving" } });
  expect(s.attributes("role")).toBe("status");
  expect(s.attributes("aria-label")).toBe("Saving");
  const b = mount(BlessButton, { props: { loading: true }, slots: { default: "Go" } });
  expect(b.find(".bless-spinner").exists()).toBe(true);
  expect(b.attributes("aria-busy")).toBe("true");
});

test("BlessEmpty renders title, description, icon, actions", () => {
  const w = mount(BlessEmpty, {
    props: { title: "Nothing", description: "Yet." },
    slots: { icon: "∅", default: "<button>add</button>" },
  });
  expect(w.find(".bless-empty__title").text()).toBe("Nothing");
  expect(w.find(".bless-empty__desc").text()).toBe("Yet.");
  expect(w.find(".bless-empty__icon").attributes("aria-hidden")).toBe("true");
  expect(w.find(".bless-empty__actions button").exists()).toBe(true);
});

test("BlessButtonGroup is a labelled group of buttons", () => {
  const w = mount(BlessButtonGroup, {
    props: { label: "Pager", orientation: "vertical" },
    slots: { default: () => [h(BlessButton, () => "a"), h(BlessButton, () => "b")] },
  });
  expect(w.attributes("role")).toBe("group");
  expect(w.attributes("aria-label")).toBe("Pager");
  expect(w.classes()).toContain("bless-button-group--vertical");
  expect(w.findAll(".bless-button")).toHaveLength(2);
});

test("BlessInputGroup wraps a control with addons", () => {
  const w = mount(BlessInputGroup, {
    slots: { prefix: "https://", default: () => h(BlessInput), suffix: ".com" },
  });
  expect(w.find(".bless-input-group__addon--prefix").text()).toBe("https://");
  expect(w.find(".bless-input-group__addon--suffix").text()).toBe(".com");
  expect(w.find(".bless-input-group__control input").exists()).toBe(true);
});

test("BlessInputGroup disabled really disables the control inside", () => {
  const w = mount(BlessInputGroup, {
    props: { disabled: true },
    slots: { default: () => h(BlessInput) },
    attachTo: document.body,
  });
  const input = w.find("input").element as HTMLInputElement;
  expect(input.matches(":disabled")).toBe(true); // via the <fieldset>, not just opacity
  w.unmount();
});

test("BlessItem renders media/title/description/actions and links", () => {
  const w = mount(BlessItem, {
    props: { title: "Track", description: "3:21", href: "/t" },
    slots: { media: "♪", actions: "<button>play</button>" },
  });
  expect(w.element.tagName).toBe("A");
  expect(w.attributes("href")).toBe("/t");
  expect(w.find(".bless-item__title").text()).toBe("Track");
  expect(w.find(".bless-item__desc").text()).toBe("3:21");
  expect(w.find(".bless-item__actions button").exists()).toBe(true);
  expect(mount(BlessItem, { props: { title: "x" } }).element.tagName).toBe("DIV");
});

test("BlessScrollArea: axis class, focusable, sizes", async () => {
  const { default: BlessScrollArea } = await import("./BlessScrollArea.vue");
  const w = mount(BlessScrollArea, {
    props: { axis: "x", height: "100px", width: "200px", fade: false },
    slots: { default: "<p>x</p>" },
  });
  expect(w.classes()).toContain("bless-scroll--x");
  expect(w.classes()).not.toContain("bless-scroll--fade");
  expect(w.attributes("tabindex")).toBe("0");
  expect(w.attributes("style")).toContain("200px");
});
