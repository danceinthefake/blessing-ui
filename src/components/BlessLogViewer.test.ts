import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessLogViewer from "./BlessLogViewer.vue";
import { parseAnsi, stripAnsi } from "./ansi";

test("parseAnsi: colors, bold, and reset become classes; other escape codes go", () => {
  expect(parseAnsi("\x1b[31merror\x1b[0m done")).toEqual([
    { text: "error", cls: "bless-ansi--red" },
    { text: " done", cls: "" },
  ]);
  expect(parseAnsi("\x1b[1;92mok\x1b[22m!\x1b[39m")).toEqual([
    { text: "ok", cls: "bless-ansi--green bless-ansi--bold" },
    { text: "!", cls: "bless-ansi--green" },
  ]);
  expect(parseAnsi("\x1b[2K\x1b]0;title\x07plain")).toEqual([{ text: "plain", cls: "" }]);
  expect(stripAnsi("\x1b[33mwarn\x1b[m")).toBe("warn");
});

// jsdom has no scrolling
Element.prototype.scrollTo ??= () => {};

const lines = ["\x1b[32m[info]\x1b[0m boot", "[warn] slow", "\x1b[31m[error]\x1b[0m crash"];
// jsdom has no layout: give the viewport a height so rows render
const mk = (props = {}) => {
  const w = mount(BlessLogViewer, { props: { lines, ...props }, attachTo: document.body });
  const vp = w.find(".bless-virtual").element as HTMLElement;
  Object.defineProperty(vp, "clientHeight", { configurable: true, value: 200 });
  vp.dispatchEvent(new Event("scroll"));
  return w;
};

test("BlessLogViewer: numbered lines with colored segments", async () => {
  const w = mk();
  await nextTick();
  const rows = w.findAll(".bless-virtual__row");
  expect(rows.map((r) => r.find(".bless-log__n").text())).toEqual(["1", "2", "3"]);
  expect(rows[0]!.find(".bless-ansi--green").text()).toBe("[info]");
  expect(rows[2]!.find(".bless-log__text").text()).toBe("[error] crash");
  w.unmount();
});

test("BlessLogViewer: the filter keeps line numbers and counts the matches", async () => {
  const w = mk();
  await w.find("input[type=search]").setValue("ERROR");
  await nextTick();
  expect(w.findAll(".bless-log__n").map((n) => n.text())).toEqual(["3"]);
  expect(w.find(".bless-log__count").text()).toBe("1 of 3 lines");
  await w.find("input[type=search]").setValue("nothing");
  expect(w.find(".bless-log__empty").text()).toBe("No lines");
  w.unmount();
});

test("BlessLogViewer: follow scrolls to the newest line; scrolling up turns it off", async () => {
  const w = mk();
  const vp = w.find(".bless-virtual").element as HTMLElement;
  const calls: number[] = [];
  vp.scrollTo = ((o: ScrollToOptions) => calls.push(o.top!)) as typeof vp.scrollTo;
  await w.setProps({ lines: [...lines, "next"] });
  await nextTick();
  expect(calls.at(-1)).toBe(3 * 20);
  expect(w.find(".bless-log__follow").attributes("aria-pressed")).toBe("true");
  Object.defineProperty(vp, "scrollHeight", { configurable: true, value: 1000 });
  vp.scrollTop = 100;
  vp.dispatchEvent(new Event("scroll"));
  await nextTick();
  expect(w.emitted("update:follow")).toEqual([[false]]);
  w.unmount();
});
