import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import BlessContextMenu from "./BlessContextMenu.vue";
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import BlessMenubar from "./BlessMenubar.vue";
import type { BlessMenuItem } from "./menu";
import { stubPopover } from "../test/popover";

beforeAll(stubPopover);

const items: BlessMenuItem[] = [
  { type: "label", label: "Actions" },
  { label: "New", shortcut: "⌘N", value: "new" },
  { label: "Open", value: "open", disabled: true },
  { type: "separator" },
  { type: "checkbox", label: "Show grid", value: "grid" },
  { type: "radio", label: "Small", value: "s", group: "size" },
  { type: "radio", label: "Large", value: "l", group: "size" },
  { type: "sub", label: "More", items: [{ label: "Deep", value: "deep" }] },
  { label: "Delete", value: "del", danger: true },
];

async function openMenu(w: ReturnType<typeof mount>) {
  await w.find(".bless-dropdown__anchor").trigger("click");
  await nextTick();
  await nextTick();
}

test("DropdownMenu opens, focuses first, roles, select closes", async () => {
  const w = mount(BlessDropdownMenu, {
    props: { items },
    slots: { trigger: "<button>menu</button>" },
    attachTo: document.body,
  });
  await openMenu(w);
  expect(w.emitted("update:open")![0]).toEqual([true]);
  const mi = w.findAll('[role^="menuitem"]');
  expect(mi.map((m) => m.attributes("role"))).toEqual([
    "menuitem",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "menuitemradio",
    "menuitem",
    "menuitem",
  ]);
  expect(document.activeElement?.textContent).toContain("New");
  expect(mi[1].attributes("aria-disabled")).toBe("true");
  await mi[0].trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ value: "new" });
  expect(w.emitted("update:open")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("checkbox/radio emit updates and stay open; arrow nav skips disabled; typeahead", async () => {
  const w = mount(BlessDropdownMenu, {
    props: { items, checked: {}, radios: {} },
    slots: { trigger: "<button>m</button>" },
    attachTo: document.body,
  });
  await openMenu(w);
  const mi = w.findAll('[role^="menuitem"]');
  await mi[2].trigger("click");
  expect(w.emitted("update:checked")![0]).toEqual([{ grid: true }]);
  await mi[4].trigger("click");
  expect(w.emitted("update:radios")![0]).toEqual([{ size: "l" }]);
  expect(w.emitted("update:open")!.filter((e) => e[0] === false)).toHaveLength(0);

  const menu = w.find('[role="menu"]');
  mi[0].element.dispatchEvent(new Event("focus"));
  (mi[0].element as HTMLElement).focus();
  await menu.trigger("keydown", { key: "ArrowDown" });
  expect(document.activeElement?.textContent).toContain("Show grid"); // skipped disabled Open
  await menu.trigger("keydown", { key: "End" });
  expect(document.activeElement?.textContent).toContain("Delete");
  await menu.trigger("keydown", { key: "d" });
  expect(document.activeElement?.textContent).toContain("Delete");
  await menu.trigger("keydown", { key: "Escape" });
  expect(w.emitted("update:open")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("submenu opens on ArrowRight", async () => {
  const w = mount(BlessDropdownMenu, {
    props: { items },
    slots: { trigger: "<button>m</button>" },
    attachTo: document.body,
  });
  await openMenu(w);
  const sub = w.find(".bless-menu__item--sub");
  (sub.element as HTMLElement).focus();
  await w.find('[role="menu"]').trigger("keydown", { key: "ArrowRight" });
  expect(sub.attributes("aria-expanded")).toBe("true");
  expect(w.find(".bless-menu--sub").exists()).toBe(true);
  w.unmount();
});

test("ContextMenu opens on right click at pointer", async () => {
  const w = mount(BlessContextMenu, {
    props: { items },
    slots: { default: "<div style='width:100px;height:100px'>area</div>" },
    attachTo: document.body,
  });
  await w.find(".bless-dropdown__anchor").trigger("contextmenu", { clientX: 50, clientY: 60 });
  dispatchEvent(new Event("pointerup"));
  await nextTick();
  await nextTick();
  expect(w.find(".bless-dropdown").attributes("data-open")).toBeDefined();
  w.unmount();
});

test("Menubar registers menus and has role", () => {
  const w = mount(BlessMenubar, {
    slots: {
      default: () => [
        h(BlessDropdownMenu, { items }, { trigger: () => h("button", "File") }),
        h(BlessDropdownMenu, { items }, { trigger: () => h("button", "Edit") }),
      ],
    },
  });
  expect(w.element.tagName).toBe("NAV");
  expect(w.findAll(".bless-dropdown__anchor")).toHaveLength(2);
  // one tab stop: the first trigger, then whichever last had focus
  const [file, edit] = w.findAll("button").filter((b) => /File|Edit/.test(b.text()));
  expect([file.attributes("tabindex"), edit.attributes("tabindex")]).toEqual(["0", "-1"]);
  edit.element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  expect([file.element.tabIndex, edit.element.tabIndex]).toEqual([-1, 0]);
  // triggers carry menu-button wiring, which is also how ←/→ find the next menu
  expect(file.attributes("aria-haspopup")).toBe("menu");
  expect(file.attributes("aria-expanded")).toBe("false");
  expect(document.getElementById(file.attributes("aria-controls")!)).toBeNull(); // not attached
});

test("Menubar: → moves focus to the next menu's trigger", async () => {
  const w = mount(BlessMenubar, {
    attachTo: document.body,
    slots: {
      default: () => [
        h(BlessDropdownMenu, { items }, { trigger: () => h("button", "File") }),
        h(BlessDropdownMenu, { items }, { trigger: () => h("button", "Edit") }),
      ],
    },
  });
  const [file, edit] = w.findAll("button").filter((b) => /File|Edit/.test(b.text()));
  (file.element as HTMLElement).focus();
  await file.trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement).toBe(edit.element);
  w.unmount();
});

test("BlessMenuList: submenu keys do not double-step or close the whole tree", async () => {
  const { default: BlessMenuList } = await import("./BlessMenuList.vue");
  const w = mount(BlessMenuList, {
    props: {
      items: [
        {
          type: "sub",
          label: "More",
          items: [
            { label: "S1", value: "s1" },
            { label: "S2", value: "s2" },
            { label: "S3", value: "s3" },
          ],
        },
      ],
    },
    attachTo: document.body,
  });
  await w.find(".bless-menu__item--sub").trigger("click");
  await nextTick();
  const sub = w.findAll(".bless-menu")[1];
  const subItems = sub.findAll('[role="menuitem"]');
  (subItems[0].element as HTMLElement).focus();
  await subItems[0].trigger("keydown", { key: "ArrowDown" });
  expect(document.activeElement?.textContent?.trim()).toBe("S2");
  await subItems[1].trigger("keydown", { key: "Escape" });
  expect(w.emitted("close")).toBeUndefined();
  w.unmount();
});
