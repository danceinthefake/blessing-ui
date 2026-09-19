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

/** module-level toast store; BlessToaster renders it */
export function useToast() {
  function dismiss(id: number) {
    state.items = state.items.filter((t) => t.id !== id);
  }
  function toast(opts: BlessToastOptions | string) {
    const o = typeof opts === "string" ? { title: opts } : opts;
    const item: BlessToastItem = { id: ++seq, duration: 4000, color: "text", ...o };
    state.items.push(item);
    if (item.duration) setTimeout(() => dismiss(item.id), item.duration);
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
    clear: () => (state.items = []),
  };
}

export const toastState = state;
