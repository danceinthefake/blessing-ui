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
  /** clamp inside this element's box instead of the viewport */
  boundary?: HTMLElement | null;
  /** size of the arrow element (px); enables arrowX / arrowY */
  arrow?: number;
}

/**
 * Minimal fixed-position floating: places `floating` next to `anchor`,
 * flips to the opposite side when it would overflow, shifts along the
 * cross axis to stay in the viewport. Recomputes on scroll/resize while `active`.
 */
export function useFloating(
  anchor: Ref<HTMLElement | null | undefined>,
  floating: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>,
  options: FloatingOptions | (() => FloatingOptions) = {},
) {
  const opts = () => (typeof options === "function" ? options() : options);
  const x = ref(0);
  const y = ref(0);
  const side = ref<"top" | "bottom" | "left" | "right">("bottom");
  /** arrow offset along the floating element's edge (px from its left/top), when `arrow` is set */
  const arrowX = ref(0);
  const arrowY = ref(0);

  function compute() {
    const a = anchor.value;
    const f = floating.value;
    if (!a || !f) return;
    const [want, align = "center"] = (opts().placement ?? "bottom").split("-") as [
      typeof side.value,
      "start" | "end" | "center",
    ];
    const off = opts().offset ?? 8;
    const pad = opts().padding ?? 8;
    const r = a.getBoundingClientRect();
    const fw = f.offsetWidth;
    const fh = f.offsetHeight;
    const b = opts().boundary?.getBoundingClientRect();
    const minX = (b?.left ?? 0) + pad,
      maxX = (b?.right ?? window.innerWidth) - pad;
    const minY = (b?.top ?? 0) + pad,
      maxY = (b?.bottom ?? window.innerHeight) - pad;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const fits = (s: typeof side.value) =>
      s === "top"
        ? r.top - off - fh >= minY
        : s === "bottom"
          ? r.bottom + off + fh <= maxY
          : s === "left"
            ? r.left - off - fw >= minX
            : r.right + off + fw <= maxX;
    const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
    const s = fits(want) || !fits(opposite[want]) ? want : opposite[want];
    side.value = s;

    let left: number;
    let top: number;
    if (s === "top" || s === "bottom") {
      top = s === "top" ? r.top - off - fh : r.bottom + off;
      left =
        align === "start" ? r.left : align === "end" ? r.right - fw : r.left + r.width / 2 - fw / 2;
      left = Math.min(Math.max(minX, left), maxX - fw);
    } else {
      left = s === "left" ? r.left - off - fw : r.right + off;
      top =
        align === "start" ? r.top : align === "end" ? r.bottom - fh : r.top + r.height / 2 - fh / 2;
      top = Math.min(Math.max(minY, top), maxY - fh);
    }
    x.value = Math.round(left);
    y.value = Math.round(top);
    // arrow points at the anchor's centre, clamped inside the floating box
    const aw = opts().arrow ?? 0;
    if (aw) {
      arrowX.value = Math.round(Math.min(Math.max(aw, r.left + r.width / 2 - left), fw - aw));
      arrowY.value = Math.round(Math.min(Math.max(aw, r.top + r.height / 2 - top), fh - aw));
    }
    void vw;
    void vh;
  }

  // the floating element is display:none until the popover opens, so the first compute may see a
  // 0×0 box; a ResizeObserver re-runs it once the real size is known (and on content changes)
  let ro: ResizeObserver | undefined;
  const listen = (on: boolean) => {
    if (typeof window === "undefined") return; // SSR: nothing to position
    const m = on ? addEventListener : removeEventListener;
    m("scroll", compute, true);
    m("resize", compute);
    ro?.disconnect();
    ro = undefined;
    if (on && floating.value && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => compute());
      ro.observe(floating.value);
    }
  };
  watch(
    active,
    (on) => {
      listen(on);
      if (on) requestAnimationFrame(compute);
    },
    { flush: "post", immediate: true },
  );
  onBeforeUnmount(() => (listen(false), ro?.disconnect()));

  return { x, y, side, arrowX, arrowY, update: compute };
}
