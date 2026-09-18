import { mount } from "@vue/test-utils";
import { h } from "vue";
import {
  BlessAccordion,
  BlessAccordionItem,
  BlessBreadcrumb,
  BlessCollapsible,
  BlessField,
  BlessForm,
  BlessPagination,
  BlessToggle,
  BlessToggleGroup,
} from "../index";

test("BlessCollapsible toggles via details", async () => {
  const w = mount(BlessCollapsible, {
    props: { title: "T", open: false },
    slots: { default: "body" },
  });
  expect(w.attributes("open")).toBeUndefined();
  (w.element as HTMLDetailsElement).open = true;
  await w.trigger("toggle");
  expect(w.emitted("update:open")![0]).toEqual([true]);
});

test("BlessAccordion single shares details name; multiple does not", () => {
  const items = () => [
    h(BlessAccordionItem, { title: "a" }, () => "1"),
    h(BlessAccordionItem, { title: "b" }, () => "2"),
  ];
  const s = mount(BlessAccordion, { slots: { default: items } });
  const names = s.findAll("details").map((d) => d.attributes("name"));
  expect(names[0]).toBeDefined();
  expect(names[0]).toBe(names[1]);
  const m = mount(BlessAccordion, { props: { type: "multiple" }, slots: { default: items } });
  expect(m.find("details").attributes("name")).toBeUndefined();
});

test("BlessToggle standalone and in group (single/multiple)", async () => {
  const t = mount(BlessToggle, { slots: { default: "B" } });
  expect(t.attributes("aria-pressed")).toBe("false");
  await t.trigger("click");
  expect(t.emitted("update:pressed")![0]).toEqual([true]);

  const single = mount(BlessToggleGroup, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(BlessToggle, { value: "a" }, () => "A"),
        h(BlessToggle, { value: "b" }, () => "B"),
      ],
    },
  });
  const btns = single.findAll("button");
  expect(btns[0].attributes("aria-pressed")).toBe("true");
  await btns[1].trigger("click");
  expect(single.emitted("update:modelValue")![0]).toEqual(["b"]);
  await btns[1].trigger("click"); // pressing current again deselects
  expect(single.emitted("update:modelValue")![1]).toEqual([undefined]);

  const multi = mount(BlessToggleGroup, {
    props: { type: "multiple", modelValue: ["a"] },
    slots: { default: () => [h(BlessToggle, { value: "a" }), h(BlessToggle, { value: "b" })] },
  });
  await multi.findAll("button")[1].trigger("click");
  expect(multi.emitted("update:modelValue")![0]).toEqual([["a", "b"]]);
});

test("BlessBreadcrumb last item is current", () => {
  const w = mount(BlessBreadcrumb, {
    props: {
      items: [{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: "Post" }],
    },
  });
  expect(w.findAll("a")).toHaveLength(2);
  expect(w.find('[aria-current="page"]').text()).toBe("Post");
  expect(w.findAll(".bless-breadcrumb__sep")).toHaveLength(2);
});

test("BlessPagination windows with ellipsis and navigates", async () => {
  const w = mount(BlessPagination, { props: { total: 20, modelValue: 10 } });
  const labels = w
    .findAll("li")
    .map((li) => li.text())
    .filter(Boolean);
  expect(labels).toEqual(["‹", "1", "…", "9", "10", "11", "…", "20", "›"]);
  expect(w.find('[aria-current="page"]').text()).toBe("10");
  await w.findAll("button")[1].trigger("click"); // "1"
  expect(w.emitted("update:modelValue")![0]).toEqual([1]);

  const first = mount(BlessPagination, { props: { total: 5, modelValue: 1 } });
  expect(first.findAll("button")[0].attributes("disabled")).toBeDefined();
  expect(
    first
      .findAll("li")
      .map((li) => li.text())
      .filter(Boolean),
  ).toEqual(["‹", "1", "2", "3", "4", "5", "›"]);

  const links = mount(BlessPagination, {
    props: { total: 3, modelValue: 2, href: (p: number) => `/p/${p}` },
  });
  expect(links.findAll("a")[2].attributes("href")).toBe("/p/2");
});

test("BlessForm blocks invalid submit, emits FormData when valid", async () => {
  const w = mount(BlessForm, {
    slots: { default: '<input name="n" required /><button type="submit">go</button>' },
    attachTo: document.body,
  });
  await w.trigger("submit");
  expect(w.emitted("invalid")).toHaveLength(1);
  expect(w.emitted("submit")).toBeUndefined();
  expect(w.classes()).toContain("bless-form--submitted");

  await w.find("input").setValue("x");
  await w.trigger("submit");
  expect((w.emitted("submit")![0][0] as FormData).get("n")).toBe("x");
  w.unmount();
});

test("BlessField wires label/id and surfaces native validation message", async () => {
  const w = mount(BlessField, {
    props: { label: "Name", required: true, description: "hint" },
    slots: { default: ({ id }: { id: string }) => h("input", { id, required: true, name: "n" }) },
    attachTo: document.body,
  });
  const input = w.find("input");
  expect(w.find("label").attributes("for")).toBe(input.attributes("id"));
  expect(w.find(".bless-field__description").text()).toBe("hint");
  await input.trigger("blur");
  expect(w.find('[role="alert"]').exists()).toBe(true);
  expect(w.find(".bless-field__description").exists()).toBe(false);
  await w.setProps({ error: "custom" });
  expect(w.find('[role="alert"]').text()).toBe("custom");
  w.unmount();
});
