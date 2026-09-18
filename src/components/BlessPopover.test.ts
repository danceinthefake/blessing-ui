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
  expect(w.emitted("update:open")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("BlessTooltip shows on focus immediately, hides on esc, describedby wired", async () => {
  const w = mount(BlessTooltip, {
    props: { text: "hint" },
    slots: { default: "<button>b</button>" },
    attachTo: document.body,
  });
  const tip = w.find('[role="tooltip"]');
  expect(w.find(".bless-tooltip__anchor").attributes("aria-describedby")).toBe(
    tip.attributes("id"),
  );
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
