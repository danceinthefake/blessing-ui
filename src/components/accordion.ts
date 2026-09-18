import type { InjectionKey, Ref } from "vue";

export const accordionKey: InjectionKey<{ name: Ref<string | undefined> }> =
  Symbol("bless-accordion");
