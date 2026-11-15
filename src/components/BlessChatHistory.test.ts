import { mount } from "@vue/test-utils";
import BlessChatHistory from "./BlessChatHistory.vue";

const now = new Date(2026, 10, 15, 12);
const ago = (d: number) => new Date(2026, 10, 15 - d, 9);
const chats = [
  { id: 1, title: "Titles for episode 41", time: ago(0) },
  { id: 2, title: "Guest questions", time: ago(1) },
  { id: 3, title: "Mic comparison", time: ago(5) },
  { id: 4, title: "Show notes draft", time: ago(20) },
  { id: 5, title: "Budget for 2026", time: ago(90) },
];

test("BlessChatHistory: chats in groups by age, the open one marked, and a click selects", async () => {
  const w = mount(BlessChatHistory, { props: { chats, now, selected: 2 } });
  expect(w.findAll(".bless-chats__date").map((d) => d.text())).toEqual([
    "Today",
    "Yesterday",
    "Previous 7 days",
    "Previous 30 days",
    "Older",
  ]);
  const open = w.findAll(".bless-chats__open");
  expect(open[1]!.attributes("aria-current")).toBe("page");
  await open[2]!.trigger("click");
  expect(w.emitted("update:selected")).toEqual([[3]]);
  expect(w.emitted("select")).toEqual([[3]]);
  expect(w.attributes("aria-label")).toBe("Chats");
});

test("BlessChatHistory: search filters, and an empty result says so", async () => {
  const w = mount(BlessChatHistory, { props: { chats, now } });
  await w.find("input").setValue("EPISODE");
  expect(w.findAll(".bless-chats__open").map((b) => b.text())).toEqual(["Titles for episode 41"]);
  await w.find("input").setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("No chats found");
});

test("BlessChatHistory: rename with Enter, cancel with Escape, and delete", async () => {
  const w = mount(BlessChatHistory, { props: { chats, now }, attachTo: document.body });
  await w.find('[aria-label="Rename: Guest questions"]').trigger("click");
  const edit = w.find(".bless-chats__edit");
  await edit.setValue("  Guest list  ");
  await edit.trigger("keydown", { key: "Enter" });
  expect(w.emitted("rename")).toEqual([[2, "Guest list"]]);
  await w.find('[aria-label="Rename: Mic comparison"]').trigger("click");
  await w.find(".bless-chats__edit").trigger("keydown", { key: "Escape" });
  expect(w.find(".bless-chats__edit").exists()).toBe(false);
  expect(w.emitted("rename")).toHaveLength(1);
  await w.find('[aria-label="Delete: Budget for 2026"]').trigger("click");
  expect(w.emitted("remove")).toEqual([[5]]);
  w.unmount();
});
