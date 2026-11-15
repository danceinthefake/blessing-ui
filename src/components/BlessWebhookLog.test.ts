import { mount } from "@vue/test-utils";
import BlessWebhookLog from "./BlessWebhookLog.vue";

const deliveries = [
  {
    id: "a",
    event: "episode.published",
    status: 200,
    time: "09:12",
    duration: 182,
    request: { id: 41 },
    response: "ok",
  },
  { id: "b", event: "episode.updated", status: 503, time: "09:10", duration: 30_000 },
  { id: "c", event: "comment.created", time: "09:13" },
];

test("BlessWebhookLog: a row per delivery with the status in words, and the bodies in a fold", () => {
  const w = mount(BlessWebhookLog, { props: { deliveries } });
  const items = w.findAll(".bless-hooks__item");
  expect(items.map((i) => i.classes().find((c) => c.startsWith("is-")))).toEqual([
    "is-ok",
    "is-failed",
    "is-pending",
  ]);
  expect(items[0]!.find("summary").text()).toBe("200Deliveredepisode.published09:12 · 182 ms");
  expect(items[2]!.find(".bless-hooks__status").text()).toBe("…Pending");
  expect(items[0]!.findAll(".bless-hooks__data").map((d) => d.text())).toEqual([
    '{\n  "id": 41\n}',
    "ok",
  ]);
  expect(w.attributes("aria-label")).toBe("Webhook deliveries");
});

test("BlessWebhookLog: only failed rows have a retry button, which emits the id and spins while retrying", async () => {
  const w = mount(BlessWebhookLog, { props: { deliveries, retrying: ["b"] } });
  const buttons = w.findAll(".bless-hooks__retry");
  expect(buttons).toHaveLength(1);
  expect(buttons[0]!.find(".bless-spinner").exists()).toBe(true);
  await w.setProps({ retrying: [] });
  await w.find(".bless-hooks__retry").trigger("click");
  expect(w.emitted("retry")).toEqual([["b"]]);
});

test("BlessWebhookLog: an empty list says so, and labels translate", () => {
  const w = mount(BlessWebhookLog, { props: { deliveries: [], labels: { empty: "Belum ada" } } });
  expect(w.find(".bless-hooks__empty").text()).toBe("Belum ada");
});
