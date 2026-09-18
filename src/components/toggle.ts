import type { InjectionKey, Ref } from "vue";

export const toggleGroupKey: InjectionKey<{
  has: (v: string | number) => boolean;
  toggle: (v: string | number) => void;
  disabled: Ref<boolean | undefined>;
}> = Symbol("bless-toggle-group");
