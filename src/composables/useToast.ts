import { reactive, toRef } from "vue";

export interface BlessToastOptions {
  title?: string;
  description?: string;
  color?: "text" | "accent" | "danger" | "warning" | "success" | "info";
  /** ms; 0 = sticky */
  duration?: number;
  action?: { label: string; onClick: () => void };
}
export interface BlessToastItem extends BlessToastOptions {
  id: number;
}

const state = reactive({ items: [] as BlessToastItem[] });
let seq = 0;
// Auto-dismiss timers pause while the pointer or focus is in the toaster (WCAG 2.2.1), so a toast
// with an action doesn't vanish while someone is reaching for it. Each keeps its remaining time.
const timers = new Map<number, { t?: ReturnType<typeof setTimeout>; left: number; at: number }>();
let paused = false;
function arm(id: number) {
  const r = timers.get(id);
  if (!r || paused) return;
  r.at = Date.now();
  r.t = setTimeout(() => {
    timers.delete(id);
    state.items = state.items.filter((t) => t.id !== id);
  }, r.left);
}
/** BlessToaster calls these on pointer / focus enter and leave */
export function pauseToasts() {
  if (paused) return;
  paused = true;
  for (const r of timers.values()) {
    clearTimeout(r.t);
    r.left -= Date.now() - r.at;
  }
}
export function resumeToasts() {
  if (!paused) return;
  paused = false;
  for (const id of timers.keys()) arm(id);
}

/** module-level toast store; BlessToaster renders it */
export function useToast() {
  function dismiss(id: number) {
    clearTimeout(timers.get(id)?.t);
    timers.delete(id);
    state.items = state.items.filter((t) => t.id !== id);
  }
  function toast(opts: BlessToastOptions | string) {
    const o = typeof opts === "string" ? { title: opts } : opts;
    const item: BlessToastItem = { id: ++seq, duration: 4000, color: "text", ...o };
    state.items.push(item);
    if (item.duration) {
      timers.set(item.id, { left: item.duration, at: 0 });
      arm(item.id);
    }
    return item.id;
  }
  const helper = (color: BlessToastOptions["color"]) => (opts: BlessToastOptions | string) =>
    toast({ ...(typeof opts === "string" ? { title: opts } : opts), color });
  return {
    toast,
    dismiss,
    items: toRef(state, "items"),
    success: helper("success"),
    error: helper("danger"),
    warning: helper("warning"),
    info: helper("info"),
    clear: () => {
      for (const r of timers.values()) clearTimeout(r.t);
      timers.clear();
      state.items = [];
    },
  };
}

export const toastState = state;
