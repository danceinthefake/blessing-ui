import { markRaw, reactive, type Component } from "vue";

export interface BlessDialogOptions<P = Record<string, unknown>> {
  title?: string;
  /** rendered inside the modal body; receives `props` plus a `close(result)` prop */
  component?: Component;
  props?: P;
  /** plain text body when no component */
  text?: string;
  size?: "sm" | "md" | "lg" | "full";
  dismissible?: boolean;
}

export interface BlessDialogEntry extends BlessDialogOptions {
  id: number;
  component?: Component;
  open: boolean;
  resolve: (result: unknown) => void;
}

const state = reactive({ items: [] as BlessDialogEntry[] });
let seq = 0;

/** Programmatic modals; mount <BlessDialogHost /> once. `open()` resolves with whatever `close(result)` gets. */
export function useDialog() {
  function open<R = unknown, P = Record<string, unknown>>(
    opts: BlessDialogOptions<P>,
  ): Promise<R | undefined> {
    return new Promise((resolve) => {
      const entry: BlessDialogEntry = {
        ...(opts as BlessDialogOptions),
        component: opts.component ? markRaw(opts.component) : undefined,
        id: ++seq,
        open: true,
        resolve: resolve as (r: unknown) => void,
      };
      state.items.push(entry);
    });
  }
  function close(id: number, result?: unknown) {
    const i = state.items.findIndex((e) => e.id === id);
    if (i < 0) return;
    const [e] = state.items.splice(i, 1);
    e.resolve(result);
  }
  return { open, close, items: state.items };
}

export const dialogState = state;
