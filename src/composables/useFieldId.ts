import { inject, provide, useId, type InjectionKey } from "vue";

type FieldSlot = { id: string; claimed: boolean };
const key: InjectionKey<FieldSlot> = Symbol("bless-field");

/** BlessField: hand the label's `for` id to the first control rendered inside it */
export function provideFieldId(id: string) {
  provide(key, { id, claimed: false });
}

/**
 * Controls: `id` prop → id of the enclosing BlessField (first control only, so the label points at
 * one element) → generated. Returns a getter because the prop is reactive.
 */
export function useFieldId(props: { id?: string }) {
  const uid = useId();
  const field = inject(key, undefined);
  const mine = field && !field.claimed ? ((field.claimed = true), field.id) : undefined;
  return () => props.id ?? mine ?? uid;
}
