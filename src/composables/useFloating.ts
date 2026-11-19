import { computed, onBeforeUnmount, onMounted, ref, type Ref, useId, watch } from "vue";

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
  /** a part of the floating element sits on the edge that faces the anchor (an arrow, an accent
   * edge): CSS anchor positioning is used only where that part can follow a flip */
  facing?: boolean;
}

// CSS anchor positioning: where the placement puts the box, and which flips to try
const AREA: Record<Placement, string> = {
  top: "top",
  "top-start": "top span-right",
  "top-end": "top span-left",
  bottom: "bottom",
  "bottom-start": "bottom span-right",
  "bottom-end": "bottom span-left",
  left: "left",
  "left-start": "left span-bottom",
  "left-end": "left span-top",
  right: "right",
  "right-start": "right span-bottom",
  "right-end": "right span-top",
};
const MARGIN = {
  top: "margin-bottom",
  bottom: "margin-top",
  left: "margin-right",
  right: "margin-left",
};

/**
 * Minimal fixed-position floating: places `floating` next to `anchor`, flips to the opposite
 * side when it would overflow, and stays in the viewport. Bind `style` on the floating element.
 *
 * Where the browser has CSS anchor positioning, `style` hands the work to CSS: no scroll or resize
 * listeners, and `x`, `y`, `side` stay at their first values. When CSS flips the box, `side` does
 * not change: an arrow follows the flip with `container-type: anchored` and an
 * `@container anchored(fallback: …)` rule. Elsewhere, and for a virtual anchor or a `boundary`, it
 * measures in JS and recomputes on scroll and resize while `active`. `--_ax` and `--_ay` in `style`
 * are `arrowX` and `arrowY` in px.
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

  // read after mount, so the server render and the hydration agree
  // an arrow also needs `container-type: anchored`, so that it can follow a flip that CSS makes
  const supported = ref({ place: false, arrow: false });
  onMounted(() => {
    const has = (p: string, v: string) => typeof CSS !== "undefined" && !!CSS.supports?.(p, v);
    supported.value = {
      place: has("position-try-fallbacks", "flip-block"),
      arrow: has("container-type", "anchored"),
    };
  });
  const name = `--bless-${useId().replace(/[^\w-]/g, "")}`;
  const native = computed(
    () =>
      supported.value.place &&
      (!(opts().arrow || opts().facing) || supported.value.arrow) &&
      anchor.value instanceof HTMLElement &&
      !opts().boundary,
  );
  // name the anchor while it is ours, and give back any name it had before
  let named: { el: HTMLElement; was: string } | undefined;
  const unname = () => {
    if (!named) return;
    named.el.style.setProperty("anchor-name", named.was);
    named = undefined;
  };
  watch(
    [native, anchor],
    ([on, a]) => {
      if (named?.el === a && on) return;
      unname();
      if (on && a instanceof HTMLElement) {
        named = { el: a, was: a.style.getPropertyValue("anchor-name") };
        a.style.setProperty("anchor-name", name);
      }
    },
    { flush: "post" },
  );

  const style = computed((): Record<string, string> => {
    const placement = opts().placement ?? "bottom";
    const want = placement.split("-")[0] as keyof typeof MARGIN;
    if (native.value) {
      return {
        "position-anchor": name,
        "position-area": AREA[placement],
        "position-try-fallbacks":
          want === "top" || want === "bottom"
            ? "flip-block, flip-inline, flip-block flip-inline"
            : "flip-inline, flip-block, flip-inline flip-block",
        [MARGIN[want]]: `${opts().offset ?? 8}px`,
        "--_ax": `${arrowX.value}px`,
        "--_ay": `${arrowY.value}px`,
      };
    }
    return {
      left: `${x.value}px`,
      top: `${y.value}px`,
      "--_ax": `${arrowX.value}px`,
      "--_ay": `${arrowY.value}px`,
    };
  });

  function compute() {
    const a = anchor.value;
    const f = floating.value;
    if (!a || !f) return;
    const aw = opts().arrow ?? 0;
    if (native.value) {
      // CSS places the box; only the arrow's place along the edge is measured, when it opens or
      // changes size. Scrolling moves both boxes together, so it does not change.
      if (!aw) return;
      const r = a.getBoundingClientRect();
      const fr = f.getBoundingClientRect();
      arrowX.value = Math.round(
        Math.min(Math.max(aw, r.left + r.width / 2 - fr.left), fr.width - aw),
      );
      arrowY.value = Math.round(
        Math.min(Math.max(aw, r.top + r.height / 2 - fr.top), fr.height - aw),
      );
      return;
    }
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
    if (aw) {
      arrowX.value = Math.round(Math.min(Math.max(aw, r.left + r.width / 2 - left), fw - aw));
      arrowY.value = Math.round(Math.min(Math.max(aw, r.top + r.height / 2 - top), fh - aw));
    }
  }

  // the floating element is display:none until the popover opens, so the first compute may see a
  // 0×0 box; a ResizeObserver re-runs it once the real size is known (and on content changes)
  let ro: ResizeObserver | undefined;
  const listen = (on: boolean) => {
    if (typeof window === "undefined") return; // SSR: nothing to position
    // CSS follows the anchor by itself: no scroll or resize listeners
    const m = on && !native.value ? addEventListener : removeEventListener;
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
    [active, native],
    ([on]) => {
      listen(on);
      if (on) requestAnimationFrame(compute);
    },
    { flush: "post", immediate: true },
  );
  onBeforeUnmount(() => (listen(false), ro?.disconnect(), unname()));

  // the side a native placement starts on; CSS may flip it without telling
  watch(
    native,
    (on) => on && (side.value = (opts().placement ?? "bottom").split("-")[0] as typeof side.value),
    {
      immediate: true,
    },
  );

  return { x, y, side, arrowX, arrowY, style, update: compute };
}
