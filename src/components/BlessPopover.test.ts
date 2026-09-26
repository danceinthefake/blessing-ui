import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessHoverCard from "./BlessHoverCard.vue";
import BlessPopover from "./BlessPopover.vue";
import BlessTooltip from "./BlessTooltip.vue";
import { stubPopover } from "../test/popover";

beforeAll(stubPopover);

test("BlessPopover click trigger toggles, toggle event syncs, close slot", async () => {
  const w = mount(BlessPopover, {
    props: { title: "T" },
    slots: {
      trigger: "<button>go</button>",
      default: ({ close }: { close: () => void }) => `body`,
    },
    attachTo: document.body,
  });
  const panel = w.find(".bless-popover");
  expect(panel.attributes("popover")).toBe("auto");
  expect(panel.attributes("role")).toBe("dialog");
  await w.find("button").trigger("click");
  await nextTick();
  await nextTick();
  expect(w.emitted("update:open")![0]).toEqual([true]);
  expect(panel.attributes("data-open")).toBeDefined();
  // light dismiss from the platform
  (panel.element as HTMLElement).hidePopover();
  await nextTick();
  expect(w.emitted("update:open")).toContainEqual([false]);
  w.unmount();
});

test("BlessTooltip shows on focus immediately, hides on esc, describedby wired", async () => {
  const w = mount(BlessTooltip, {
    props: { text: "hint" },
    slots: { default: "<button>b</button>" },
    attachTo: document.body,
  });
  const tip = w.find('[role="tooltip"]');
  // on the button itself, which is what gets focus — not the wrapper
  expect(w.find("button").attributes("aria-describedby")).toBe(tip.attributes("id"));
  await w.find(".bless-tooltip__anchor").trigger("focusin");
  await new Promise((r) => setTimeout(r, 5));
  await nextTick();
  expect(tip.attributes("data-open")).toBeDefined();
  await w.find(".bless-tooltip__anchor").trigger("keydown", { key: "Escape" });
  await nextTick();
  expect(tip.attributes("data-open")).toBeUndefined();
  w.unmount();
});

test("BlessHoverCard opens after delay on hover", async () => {
  vi.useFakeTimers();
  const w = mount(BlessHoverCard, {
    props: { openDelay: 50 },
    slots: { trigger: "<a href='#'>u</a>", default: "card" },
    attachTo: document.body,
  });
  await w.find(".bless-popover__anchor").trigger("mouseenter");
  vi.advanceTimersByTime(60);
  await nextTick();
  expect(w.emitted("update:open")![0]).toEqual([true]);
  vi.useRealTimers();
  w.unmount();
});

test("BlessPopover wires its click trigger; Esc closes a modal one", async () => {
  const w = mount(BlessPopover, {
    props: { modal: true, open: true },
    slots: { trigger: "<button>i</button>", default: "<p>body</p>" },
  });
  const t = w.find("button");
  expect(t.attributes("aria-haspopup")).toBe("dialog");
  expect(t.attributes("aria-controls")).toBe(w.find(".bless-popover").attributes("id"));
  expect(t.attributes("aria-expanded")).toBe("true");
  await w.find(".bless-popover").trigger("keydown", { key: "Escape" });
  expect(w.emitted("update:open")).toContainEqual([false]);
});

test("BlessTooltip stays while the pointer moves onto it", async () => {
  const w = mount(BlessTooltip, {
    props: { text: "hint", delay: 0 },
    slots: { default: "<button>b</button>" },
    attachTo: document.body,
  });
  const a = w.find(".bless-tooltip__anchor");
  const tip = w.find('[role="tooltip"]');
  await a.trigger("mouseenter");
  await new Promise((r) => setTimeout(r, 5));
  await nextTick();
  await a.trigger("mouseleave");
  await tip.trigger("mouseenter");
  await new Promise((r) => setTimeout(r, 200));
  await nextTick();
  expect(tip.attributes("data-open")).toBeDefined();
  w.unmount();
});

test("BlessTooltip: Esc hides a hover-opened tip wherever focus is; joins an existing description", async () => {
  vi.useFakeTimers();
  const w = mount(BlessTooltip, {
    props: { text: "hint", delay: 10 },
    slots: { default: '<button aria-describedby="own">b</button>' },
    attachTo: document.body,
  });
  const tipId = w.find('[role="tooltip"]').attributes("id");
  expect(w.find("button").attributes("aria-describedby")).toBe(`own ${tipId}`);
  await w.find(".bless-tooltip__anchor").trigger("mouseenter");
  vi.advanceTimersByTime(20);
  await nextTick();
  await nextTick();
  expect(w.find(".bless-tooltip").attributes("data-open")).toBeDefined();
  document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await nextTick();
  await nextTick();
  expect(w.find(".bless-tooltip").attributes("data-open")).toBeUndefined();
  vi.useRealTimers();
  w.unmount();
});
