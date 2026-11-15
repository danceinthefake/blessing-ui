import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessShortcutSheet from "./BlessShortcutSheet.vue";

const groups = [
  {
    title: "Player",
    shortcuts: [
      { keys: "Space", description: "Play or pause" },
      { keys: ["Shift+→", "L"], description: "Skip forward" },
    ],
  },
  { title: "App", shortcuts: [{ keys: "Mod+K", description: "Open search" }] },
];
const platform = Object.getOwnPropertyDescriptor(Navigator.prototype, "platform");
afterEach(() => platform && Object.defineProperty(Navigator.prototype, "platform", platform));

test("BlessShortcutSheet: groups of descriptions and keys, alternatives with 'or', Mod as Ctrl", async () => {
  Object.defineProperty(Navigator.prototype, "platform", {
    get: () => "Linux x86_64",
    configurable: true,
  });
  const w = mount(BlessShortcutSheet, { props: { groups } });
  await nextTick();
  expect(w.findAll(".bless-shortcuts__title").map((t) => t.text())).toEqual(["Player", "App"]);
  expect(w.findAll("dt").map((d) => d.text())).toEqual([
    "Play or pause",
    "Skip forward",
    "Open search",
  ]);
  const dd = w.findAll("dd");
  expect(dd[1]!.findAll(".bless-kbd__key").map((k) => k.text())).toEqual(["Shift", "→", "L"]);
  expect(dd[1]!.find(".bless-shortcuts__or").text()).toBe("or");
  expect(dd[2]!.findAll(".bless-kbd__key").map((k) => k.text())).toEqual(["Ctrl", "K"]);
});

test("BlessShortcutSheet: Mod is ⌘ on Apple; the search filters by words or keys", async () => {
  Object.defineProperty(Navigator.prototype, "platform", {
    get: () => "MacIntel",
    configurable: true,
  });
  const w = mount(BlessShortcutSheet, { props: { groups } });
  await nextTick();
  expect(
    w
      .findAll("dd")[2]!
      .findAll(".bless-kbd__key")
      .map((k) => k.text()),
  ).toEqual(["⌘", "K"]);
  await w.find("input").setValue("skip");
  expect(w.findAll("dt").map((d) => d.text())).toEqual(["Skip forward"]);
  expect(w.findAll(".bless-shortcuts__title").map((t) => t.text())).toEqual(["Player"]);
  await w.find("input").setValue("mod+k");
  expect(w.findAll("dt").map((d) => d.text())).toEqual(["Open search"]);
  await w.find("input").setValue("zzz");
  expect(w.find(".bless-shortcuts__none").text()).toBe("No shortcuts found");
});
