import type { InjectionKey, Ref } from "vue";

export const radioKey: InjectionKey<{
  name: Ref<string>;
  disabled: Ref<boolean | undefined>;
  invalid: Ref<boolean | undefined>;
  model: Ref<string | number | undefined>;
}> = Symbol("bless-radio");
