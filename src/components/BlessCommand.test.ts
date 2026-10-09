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

describe("recent and scopes", () => {
  const list = [
    { value: "home", label: "Home", group: "Pages" },
    { value: "docs", label: "Docs", group: "Pages" },
    { value: "ayu", label: "Ayu Lestari", group: "People" },
    { value: "budi", label: "Budi", group: "People" },
    { value: "bug", label: "bug", group: "Tags" },
    { value: "off", label: "Off", group: "Pages", disabled: true },
  ];
  const scopes = [
    { key: "@", group: "People" },
    { key: "#", group: "Tags", label: "Tag" },
  ];
  const mk = (props: Record<string, unknown> = {}) =>
    mount(BlessCommand, {
      props: {
        items: list,
        inline: true,
        history: [] as string[],
        "onUpdate:history": (v: unknown) => w.setProps({ history: v as string[] }),
        ...props,
      },
      attachTo: document.body,
    });
  let w: ReturnType<typeof mk>;
  beforeEach(() => localStorage.clear());
  afterEach(() => w?.unmount());
  const options = () => w.findAll('[role="option"]');
  const choose = async (label: string) => {
    await options()
      .find((o) => o.text().includes(label))!
      .trigger("click");
    await nextTick();
  };

  test("nothing is added to the list unless `recent` is on", async () => {
    w = mk();
    await choose("Docs");
    expect(w.findAll(".bless-command__group").map((g) => g.text())).toEqual([
      "Pages",
      "People",
      "Tags",
    ]);
  });

  test("chosen items come back first, most recent first, without repeats, and are not double-ided", async () => {
    w = mk({ recent: true });
    await choose("Budi");
    await choose("Docs");
    await choose("Budi");
    const groups = w.findAll(".bless-command__group").map((g) => g.text());
    expect(groups[0]).toBe("Recent");
    const first = w.findAll(".bless-command__section")[0]!.findAll('[role="option"]');
    expect(first.map((o) => o.text())).toEqual(["Budi", "Docs"]);
    const ids = options().map((o) => o.attributes("id"));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("the recent group is only for an empty search; typing, or a limit, hides it", async () => {
    w = mk({ recent: true, recentLimit: 1 });
    await choose("Budi");
    await choose("Docs");
    expect(w.findAll(".bless-command__section")[0]!.findAll('[role="option"]')).toHaveLength(1);
    await w.find("input").setValue("do");
    expect(w.findAll(".bless-command__group").map((g) => g.text())).not.toContain("Recent");
  });

  test("the keyboard walks recent items first and Enter picks from there", async () => {
    w = mk({ recent: true });
    await choose("Budi");
    await w.find("input").trigger("keydown", { key: "ArrowDown" });
    await w.find("input").trigger("keydown", { key: "ArrowUp" });
    expect(w.find('[aria-selected="true"]').attributes("id")).toContain("-r-budi");
    await w.find("input").trigger("keydown", { key: "Enter" });
    expect((w.emitted("select")!.at(-1)![0] as { value: string }).value).toBe("budi");
  });

  test("a history that names missing or disabled items shows only what can be chosen", () => {
    w = mk({ recent: true, history: ["gone", "off", "home"] });
    const first = w.findAll(".bless-command__section")[0]!;
    expect(first.find(".bless-command__group").text()).toBe("Recent");
    expect(first.findAll('[role="option"]').map((o) => o.text())).toEqual(["Home"]);
  });

  test("persist keeps the history between visits", async () => {
    // the model is left uncontrolled (no history prop at all): the stored list is loaded while mounting
    const bare = () =>
      mount(BlessCommand, {
        props: { items: list, inline: true, recent: true, persist: "app" },
        attachTo: document.body,
      });
    const first = bare();
    await first
      .findAll('[role="option"]')
      .find((o) => o.text().includes("Ayu"))!
      .trigger("click");
    expect(JSON.parse(localStorage.getItem("bless-command:app")!)).toEqual(["ayu"]);
    first.unmount();
    const again = bare();
    await nextTick();
    expect(again.findAll(".bless-command__section")[0]!.text()).toContain("Ayu Lestari");
    again.unmount();
  });

  test("a leading @ narrows the search to that group and shows a chip; the hint lists the keys", async () => {
    w = mk({ scopes });
    expect(w.find(".bless-command__hint").text()).toBe("Type @ People, # Tag");
    await w.find("input").setValue("@");
    await nextTick();
    expect(w.find(".bless-command__scope").text()).toContain("People");
    expect((w.find("input").element as HTMLInputElement).value).toBe("");
    expect(options().map((o) => o.text())).toEqual(["Ayu Lestari", "Budi"]);
    await w.find("input").setValue("ay");
    expect(options().map((o) => o.text())).toEqual(["Ayu Lestari"]);
    expect(w.find("input").attributes("aria-label")).toBe("Search commands: Only in People");
    expect(w.find(".bless-command__hint").exists()).toBe(false);
  });

  test("Backspace on an empty search leaves the scope, and so does clicking the chip", async () => {
    w = mk({ scopes });
    await w.find("input").setValue("#");
    await nextTick();
    expect(options().map((o) => o.text())).toEqual(["bug"]);
    await w.find("input").trigger("keydown", { key: "Backspace" });
    expect(w.find(".bless-command__scope").exists()).toBe(false);
    expect(options().length).toBe(6);
    await w.find("input").setValue("@");
    await nextTick();
    await w.find(".bless-command__scope").trigger("click");
    expect(w.find(".bless-command__scope").exists()).toBe(false);
  });

  test("a key typed later in the query is just text, and recents hide inside a scope", async () => {
    w = mk({ scopes, recent: true, history: ["home"] });
    await w.find("input").setValue("a@");
    expect(w.find(".bless-command__scope").exists()).toBe(false);
    await w.find("input").setValue("");
    await w.find("input").setValue("@");
    await nextTick();
    expect(w.findAll(".bless-command__group").map((g) => g.text())).toEqual(["People"]);
  });

  test("labels translate the group, the chip and the hint", async () => {
    w = mk({
      scopes,
      recent: true,
      history: ["home"],
      labels: {
        recent: "Terakhir",
        scopeHint: (p: string[]) => `Ketik ${p.join(" / ")}`,
        scope: (l: string) => `Hanya di ${l}`,
      },
    });
    expect(w.find(".bless-command__group").text()).toBe("Terakhir");
    expect(w.find(".bless-command__hint").text()).toBe("Ketik @ People / # Tag");
    await w.find("input").setValue("@");
    await nextTick();
    expect(w.find("input").attributes("aria-label")).toContain("Hanya di People");
  });
});
