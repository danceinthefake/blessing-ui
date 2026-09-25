import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCombobox from "./BlessCombobox.vue";
import BlessCommand from "./BlessCommand.vue";
import { stubPopover } from "../test/popover";

beforeAll(() => {
  stubPopover();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  Element.prototype.scrollIntoView = () => {};
});

const items = [
  { label: "New file", value: "new", group: "File", shortcut: "⌘N", keywords: ["create"] },
  { label: "Open", value: "open", group: "File" },
  { label: "Toggle theme", value: "theme", group: "View", disabled: true },
  { label: "Zoom in", value: "zoom", group: "View" },
];

test("BlessCommand inline filters, groups, keyboard select, skips disabled", async () => {
  const w = mount(BlessCommand, { props: { items, inline: true }, attachTo: document.body });
  expect(w.findAll(".bless-command__group").map((g) => g.text())).toEqual(["File", "View"]);
  const input = w.find("input");
  await input.setValue("create");
  expect(w.findAll('[role="option"]').map((o) => o.text())).toEqual(["New file⌘N"]);
  await input.setValue("");
  await input.trigger("keydown", { key: "ArrowDown" });
  await input.trigger("keydown", { key: "ArrowDown" }); // skips disabled theme → zoom
  expect(w.find('[aria-selected="true"]').text()).toContain("Zoom in");
  await input.trigger("keydown", { key: "Enter" });
  expect(w.emitted("select")![0][0]).toMatchObject({ value: "zoom" });
  await input.setValue("zzz");
  expect(w.find(".bless-command__empty").exists()).toBe(true);
  w.unmount();
});

test("BlessCommand hotkey toggles modal", async () => {
  const w = mount(BlessCommand, { props: { items }, attachTo: document.body });
  dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  await nextTick();
  expect(w.emitted("update:open")![0]).toEqual([true]);
  w.unmount();
});

const opts = [
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "英梨々" },
  { value: "utaha", label: "詩羽", disabled: true },
];

test("BlessCombobox single: filter, keyboard pick, reflects label", async () => {
  const w = mount(BlessCombobox, { props: { options: opts }, attachTo: document.body });
  const input = w.find("input");
  await input.trigger("focus");
  expect(input.attributes("aria-expanded")).toBe("true");
  await input.setValue("英");
  expect(w.findAll('[role="option"]')).toHaveLength(1);
  await input.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")![0]).toEqual(["eriri"]);
  await w.setProps({ modelValue: "eriri" });
  await nextTick();
  expect((input.element as HTMLInputElement).value).toBe("英梨々");
  w.unmount();
});

test("BlessCombobox multiple: chips, backspace removes, creatable", async () => {
  const w = mount(BlessCombobox, {
    props: { options: opts, multiple: true, modelValue: ["megumi"], creatable: true },
    attachTo: document.body,
  });
  expect(w.findAll(".bless-combobox__chip")).toHaveLength(1);
  const input = w.find("input");
  await input.trigger("focus");
  await w.findAll('[role="option"]')[1].trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([["megumi", "eriri"]]);
  await input.trigger("keydown", { key: "Backspace" });
  expect(w.emitted("update:modelValue")![1]).toEqual([["megumi"]]);
  await input.setValue("出海");
  expect(w.find(".bless-combobox__option--create").exists()).toBe(true);
  await w.find(".bless-combobox__option--create").trigger("click");
  expect(w.emitted("create")![0]).toEqual(["出海"]);
  w.unmount();
});

test("BlessCommand: named input, groups are labelled, ⌘K is left to editors", async () => {
  const w = mount(BlessCommand, {
    props: { inline: true, items: [{ label: "Open", value: "o", group: "File" }] },
  });
  expect(w.find("input").attributes("aria-label")).toBe("Search commands");
  const g = w.find("[role=listbox] > [role=group]");
  expect(w.find(`#${g.attributes("aria-labelledby")}`).text()).toBe("File");
  const m = mount(BlessCommand, { props: { items: [] }, attachTo: document.body });
  const ed = document.createElement("div");
  ed.setAttribute("contenteditable", "true");
  document.body.append(ed);
  ed.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  expect(m.emitted("update:open")).toBeUndefined();
  ed.remove();
  m.unmount();
});
