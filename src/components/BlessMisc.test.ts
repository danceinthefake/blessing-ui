import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { h } from "vue";
import BlessAccordion from "./BlessAccordion.vue";
import BlessAccordionItem from "./BlessAccordionItem.vue";
import BlessBreadcrumb from "./BlessBreadcrumb.vue";
import BlessCollapsible from "./BlessCollapsible.vue";
import BlessField from "./BlessField.vue";
import BlessForm from "./BlessForm.vue";
import BlessPagination from "./BlessPagination.vue";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

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
  // blur of an untouched empty field stays quiet; the browser's invalid event (a submit) speaks
  await input.trigger("blur");
  expect(w.find('[role="alert"]').exists()).toBe(false);
  await input.trigger("invalid");
  expect(w.find('[role="alert"]').exists()).toBe(true);
  expect(w.find(".bless-field__description").exists()).toBe(false);
  // the control got the field's wiring without v-slot
  expect(w.find("input").attributes("aria-describedby")).toBeUndefined(); // plain <input>: not a Bless control
  await w.setProps({ error: "custom" });
  expect(w.find('[role="alert"]').text()).toBe("custom");
  w.unmount();
});

test("BlessForm reset brings v-model along with the fields", async () => {
  const { default: BlessForm } = await import("./BlessForm.vue");
  const { default: BlessInput } = await import("./BlessInput.vue");
  const { default: BlessCheckbox } = await import("./BlessCheckbox.vue");
  const w = mount(
    {
      components: { BlessForm, BlessInput, BlessCheckbox },
      data: () => ({ v: "", c: false }),
      template: `<BlessForm><BlessInput v-model="v" name="a" /><BlessCheckbox v-model="c">c</BlessCheckbox></BlessForm>`,
    },
    { attachTo: document.body },
  );
  await w.find("input[name=a]").setValue("megumi");
  await w.find("input[type=checkbox]").setValue(true);
  (w.find("form").element as HTMLFormElement).reset();
  await new Promise((r) => setTimeout(r, 0));
  await nextTick();
  const vm = w.vm as unknown as { v: string; c: boolean };
  expect([vm.v, vm.c]).toEqual(["", false]);
  w.unmount();
});

test("Esc that closes a popup is claimed, so an enclosing dialog stays open", async () => {
  const { default: BlessCombobox } = await import("./BlessCombobox.vue");
  const w = mount(BlessCombobox, {
    props: { options: [{ label: "Megumi", value: "m" }] },
    attachTo: document.body,
  });
  const input = w.find("input");
  await input.trigger("keydown", { key: "ArrowDown" }); // opens the list
  const esc = new KeyboardEvent("keydown", { key: "Escape", cancelable: true, bubbles: true });
  input.element.dispatchEvent(esc);
  expect(esc.defaultPrevented).toBe(true);
  const again = new KeyboardEvent("keydown", { key: "Escape", cancelable: true, bubbles: true });
  input.element.dispatchEvent(again); // nothing open now: the dialog may have this one
  expect(again.defaultPrevented).toBe(false);
  w.unmount();
});

test("BlessCombobox in an invalid field: styled invalid and reads the error", async () => {
  const { default: BlessCombobox } = await import("./BlessCombobox.vue");
  const w = mount(BlessField, {
    props: { label: "Heroine", error: "Pick one" },
    slots: { default: () => h(BlessCombobox, { options: [{ value: "m", label: "Megumi" }] }) },
  });
  expect(w.find(".bless-combobox").classes()).toContain("bless-combobox--invalid");
  const d = w.find("input").attributes("aria-describedby");
  expect(d && w.find(`[id="${d}"]`).text()).toBe("Pick one");
});
