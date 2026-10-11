import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessNotificationInbox from "./BlessNotificationInbox.vue";

const items = [
  { id: "1", title: "New comment", body: "Megumi replied", time: "2 min ago" },
  { id: "2", title: "Build passed", read: true, href: "https://example.com/build" },
  { id: "3", title: "Invite", time: "1 h ago" },
];
const mk = (props = {}) =>
  mount(BlessNotificationInbox, { props: { items, ...props }, attachTo: document.body });

test("BlessNotificationInbox: the bell is named with the unread count, and the badge shows it", () => {
  const w = mk();
  expect(w.find("button").attributes("aria-label")).toBe("Notifications, 2 unread");
  expect(w.find(".bless-indicator__badge").text()).toBe("2");
  w.unmount();
});

test("BlessNotificationInbox: no unread items gives a plain name and no badge", () => {
  const w = mk({ items: items.map((i) => ({ ...i, read: true })) });
  expect(w.find("button").attributes("aria-label")).toBe("Notifications");
  expect(w.find(".bless-indicator__badge").exists()).toBe(false);
  w.unmount();
});

test("BlessNotificationInbox: unread items say so in text; read ones do not", () => {
  const w = mk();
  const rows = w.findAll(".bless-inbox__item");
  expect(rows[0].text()).toContain("Unread: New comment");
  expect(rows[1].text()).not.toContain("Unread");
  expect(rows[0].classes()).toContain("bless-inbox__item--unread");
  w.unmount();
});

test("BlessNotificationInbox: opening an unread item emits read then select; a read item only selects", async () => {
  const w = mk();
  const opens = w.findAll(".bless-inbox__open");
  await opens[0].trigger("click");
  expect(w.emitted("read")![0]).toEqual(["1"]);
  expect(w.emitted("select")![0][0]).toMatchObject({ id: "1" });
  await opens[1].trigger("click");
  expect(w.emitted("read")).toHaveLength(1);
  expect(w.emitted("select")).toHaveLength(2);
  w.unmount();
});

test("BlessNotificationInbox: an item with href is a link, one without is a button", () => {
  const w = mk();
  const opens = w.findAll(".bless-inbox__open");
  expect(opens[0].element.tagName).toBe("BUTTON");
  expect(opens[1].element.tagName).toBe("A");
  expect(opens[1].attributes("href")).toBe("https://example.com/build");
  w.unmount();
});

test("BlessNotificationInbox: dismiss names its item; Mark all as read waits for an unread item", async () => {
  const w = mk();
  const dismiss = w.findAll(".bless-inbox__dismiss")[2];
  expect(dismiss.attributes("aria-label")).toBe("Dismiss: Invite");
  await dismiss.trigger("click");
  expect(w.emitted("dismiss")![0]).toEqual(["3"]);
  const all = w.findAll("button").find((b) => b.text() === "Mark all as read")!;
  await all.trigger("click");
  expect(w.emitted("readAll")).toHaveLength(1);
  await w.setProps({ items: items.map((i) => ({ ...i, read: true })) });
  await nextTick();
  const again = w.findAll("button").find((b) => b.text() === "Mark all as read")!;
  expect(again.attributes("disabled")).toBeDefined();
  w.unmount();
});

test("BlessNotificationInbox: an empty list says so, and labels replace the English", () => {
  const w = mk({ items: [], labels: { empty: "Tidak ada", title: "Notifikasi" } });
  expect(w.find(".bless-inbox__empty").text()).toBe("Tidak ada");
  expect(w.find("[role=dialog]").attributes("aria-label")).toBe("Notifikasi");
  w.unmount();
});
