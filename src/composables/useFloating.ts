import { onBeforeUnmount, ref, type Ref, watch } from "vue";

export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | `${"top" | "bottom" | "left" | "right"}-${"start" | "end"}`;

export interface FloatingOptions {
  placement?: Placement;
  offset?: number;
  /** keep inside viewport by this padding */
  padding?: number;
}

/**
 * Minimal fixed-position floating: places `floating` next to `anchor`,
 * flips to the opposite side when it would overflow, shifts along the
 * cross axis to stay in the viewport. Recomputes on scroll/resize while `active`.
 */
// ponytail: no collision detection beyond viewport, no arrow; swap for @floating-ui/dom if needed
export function useFloating(
  anchor: Ref<HTMLElement | null | undefined>,
  floating: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>,
  opts: FloatingOptions = {},
) {
  const x = ref(0);
  const y = ref(0);
  const side = ref<"top" | "bottom" | "left" | "right">("bottom");

  function compute() {
    const a = anchor.value;
    const f = floating.value;
    if (!a || !f) return;
    const [want, align = "center"] = (opts.placement ?? "bottom").split("-") as [
      typeof side.value,
      "start" | "end" | "center",
    ];
    const off = opts.offset ?? 8;
    const pad = opts.padding ?? 8;
    const r = a.getBoundingClientRect();
    const fw = f.offsetWidth;
    const fh = f.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const fits = (s: typeof side.value) =>
      s === "top"
        ? r.top - off - fh >= pad
        : s === "bottom"
          ? r.bottom + off + fh <= vh - pad
          : s === "left"
            ? r.left - off - fw >= pad
            : r.right + off + fw <= vw - pad;
    const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
    const s = fits(want) || !fits(opposite[want]) ? want : opposite[want];
    side.value = s;

    let left: number;
    let top: number;
    if (s === "top" || s === "bottom") {
      top = s === "top" ? r.top - off - fh : r.bottom + off;
      left =
        align === "start" ? r.left : align === "end" ? r.right - fw : r.left + r.width / 2 - fw / 2;
      left = Math.min(Math.max(pad, left), vw - fw - pad);
    } else {
      left = s === "left" ? r.left - off - fw : r.right + off;
      top =
        align === "start" ? r.top : align === "end" ? r.bottom - fh : r.top + r.height / 2 - fh / 2;
      top = Math.min(Math.max(pad, top), vh - fh - pad);
    }
    x.value = Math.round(left);
    y.value = Math.round(top);
  }

  const listen = (on: boolean) => {
    const m = on ? addEventListener : removeEventListener;
    m("scroll", compute, true);
    m("resize", compute);
  };
  watch(
    active,
    (on) => {
      listen(on);
      if (on) requestAnimationFrame(compute);
    },
    { flush: "post" },
  );
  onBeforeUnmount(() => listen(false));

  return { x, y, side, update: compute };
}
