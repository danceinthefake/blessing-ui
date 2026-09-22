import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { logicalKey } from "./rtl";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * WAI-ARIA toolbar keyboard: one tab stop, ← / → (reading order) move between the controls inside
 * `el`, Home / End jump. Tabindex is managed on the controls; the last focused one keeps the stop.
 */
export function useRovingFocus(el: Ref<HTMLElement | undefined | null>) {
  const items = () => Array.from(el.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
  function setStop(target: HTMLElement) {
    for (const i of items()) i.tabIndex = i === target ? 0 : -1;
  }
  function onKey(e: KeyboardEvent) {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const k = logicalKey(e);
    let next = -1;
    if (k === "ArrowRight") next = (i + 1) % list.length;
    else if (k === "ArrowLeft") next = (i - 1 + list.length) % list.length;
    else if (k === "Home") next = 0;
    else if (k === "End") next = list.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setStop(list[next]!);
    list[next]!.focus();
  }
  function onFocusin(e: FocusEvent) {
    const t = e.target as HTMLElement;
    if (items().includes(t)) setStop(t);
  }
  let mo: MutationObserver | undefined;
  onMounted(() => {
    const root = el.value;
    if (!root) return;
    const init = () => {
      const list = items();
      if (!list.length) return;
      // buttons are tabIndex 0 by nature; exactly one may keep it
      const stops = list.filter((i) => i.tabIndex === 0);
      if (stops.length !== 1) setStop(stops[0] ?? list[0]!);
    };
    init();
    root.addEventListener("keydown", onKey);
    root.addEventListener("focusin", onFocusin);
    mo = new MutationObserver(init); // tools added/removed/disabled later
    mo.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled"],
    });
  });
  onBeforeUnmount(() => {
    el.value?.removeEventListener("keydown", onKey);
    el.value?.removeEventListener("focusin", onFocusin);
    mo?.disconnect();
  });
}
