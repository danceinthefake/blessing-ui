import type { InjectionKey } from "vue";

export type BlessMenuItem =
  | {
      type?: "item";
      label: string;
      value?: string;
      icon?: string;
      shortcut?: string;
      disabled?: boolean;
      href?: string;
      danger?: boolean;
    }
  | { type: "checkbox"; label: string; value: string; checked?: boolean; disabled?: boolean }
  | { type: "radio"; label: string; value: string; group: string; disabled?: boolean }
  | { type: "separator" }
  | { type: "label"; label: string }
  | { type: "sub"; label: string; items: BlessMenuItem[]; disabled?: boolean };

export const menubarKey: InjectionKey<{
  register: (id: string, open: () => void, close: () => void) => void;
  unregister: (id: string) => void;
  /** currently open menu id */
  active: { value: string | null };
  focusNext: (id: string, dir: 1 | -1) => void;
}> = Symbol("bless-menubar");
