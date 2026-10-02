import { mount, type VueWrapper } from "@vue/test-utils";
import BlessShortcutRecorder from "./BlessShortcutRecorder.vue";
import { matchShortcut, shortcutFromEvent, splitShortcut } from "../composables/shortcut";

const ev = (key: string, code = "", mods: Partial<KeyboardEvent> = {}) =>
  ({
    key,
    code,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    ...mods,
  }) as KeyboardEvent;

test("shortcutFromEvent: ordered modifiers, physical letters and digits, names for the rest", () => {
  expect(shortcutFromEvent(ev("k", "KeyK", { ctrlKey: true }))).toBe("Ctrl+K");
  expect(shortcutFromEvent(ev("K", "KeyK", { shiftKey: true, ctrlKey: true, altKey: true }))).toBe(
    "Ctrl+Alt+Shift+K",
  );
  expect(shortcutFromEvent(ev("!", "Digit1", { shiftKey: true }))).toBe("Shift+1");
  expect(shortcutFromEvent(ev("ArrowUp", "ArrowUp", { metaKey: true }))).toBe("Meta+↑");
  expect(shortcutFromEvent(ev(" ", "Space", { ctrlKey: true }))).toBe("Ctrl+Space");
  expect(shortcutFromEvent(ev("F5", "F5"))).toBe("F5");
  expect(shortcutFromEvent(ev("Control", "ControlLeft", { ctrlKey: true }))).toBeNull();
});

test("matchShortcut and splitShortcut", () => {
  expect(matchShortcut("Ctrl+K", ev("k", "KeyK", { ctrlKey: true }))).toBe(true);
  expect(matchShortcut("Ctrl+K", ev("k", "KeyK"))).toBe(false);
  expect(splitShortcut("Ctrl+Shift+K")).toEqual(["Ctrl", "Shift", "K"]);
  expect(splitShortcut("Ctrl++")).toEqual(["Ctrl", "+"]);
});

let w: VueWrapper<any>;
const mk = (props = {}) =>
  (w = mount(BlessShortcutRecorder, {
    props: {
      modelValue: "",
      "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }),
      ...props,
    },
    attachTo: document.body,
  }));
afterEach(() => w?.unmount());
const btn = () => w.find("button");
const press = (key: string, code: string, mods: Partial<KeyboardEvent> = {}) =>
  btn().trigger("keydown", { key, code, ...mods });

test("click starts recording; a combo is set and recording stops", async () => {
  mk();
  await btn().trigger("click");
  expect(w.text()).toContain("Press keys…");
  await press("Control", "ControlLeft", { ctrlKey: true });
  expect(w.find(".bless-shortcut__btn").text()).toContain("Ctrl"); // the held modifier shows
  await press("k", "KeyK", { ctrlKey: true });
  expect(w.props("modelValue")).toBe("Ctrl+K");
  expect(w.find(".bless-shortcut__live").text()).toBe("Set to Ctrl+K");
  expect(w.findAll("kbd.bless-kbd__key").map((k) => k.text())).toEqual(["Ctrl", "K"]);
});

test("Enter on the button starts too; Escape cancels and Backspace clears", async () => {
  mk({ modelValue: "Ctrl+K" });
  await press("Enter", "Enter");
  await press("Escape", "Escape");
  expect(w.props("modelValue")).toBe("Ctrl+K");
  await press("Enter", "Enter");
  await press("Backspace", "Backspace");
  expect(w.props("modelValue")).toBe("");
  expect(w.text()).toContain("Not set");
});

test("a bare key is refused unless allowed; function keys are fine", async () => {
  mk();
  await btn().trigger("click");
  await press("g", "KeyG");
  expect(w.props("modelValue")).toBe("");
  expect(w.find('[role="alert"]').text()).toContain("Add Ctrl, Alt or Meta to G");
  await press("F5", "F5");
  expect(w.props("modelValue")).toBe("F5");
  w.unmount();
  mk({ allowBare: true });
  await btn().trigger("click");
  await press("g", "KeyG");
  expect(w.props("modelValue")).toBe("G");
});

test("a taken combo is refused and says by what; the current value is not a conflict", async () => {
  mk({ modelValue: "Ctrl+J", taken: { "Ctrl+K": "Open search", "Ctrl+J": "this one" } });
  await btn().trigger("click");
  await press("k", "KeyK", { ctrlKey: true });
  expect(w.props("modelValue")).toBe("Ctrl+J");
  expect(w.find('[role="alert"]').text()).toBe("Ctrl+K is already used by Open search");
  expect(w.emitted("conflict")![0]).toEqual(["Ctrl+K", "Open search"]);
  expect(btn().attributes("aria-invalid")).toBe("true");
  await press("j", "KeyJ", { ctrlKey: true }); // same as now: allowed
  expect(w.props("modelValue")).toBe("Ctrl+J");
  expect(w.find('[role="alert"]').exists()).toBe(false);
});

test("a list of taken combos works; blur stops recording; disabled never starts", async () => {
  mk({ taken: ["Alt+X"] });
  await btn().trigger("click");
  await press("x", "KeyX", { altKey: true });
  expect(w.find('[role="alert"]').text()).toBe("Alt+X is already taken");
  await btn().trigger("blur");
  expect(w.find(".bless-shortcut--rec").exists()).toBe(false);
  w.unmount();
  mk({ disabled: true });
  await btn().trigger("click");
  expect(w.find(".bless-shortcut--rec").exists()).toBe(false);
});
