import { inject, provide, ref, useId, type InjectionKey, type Ref } from "vue";

type FieldSlot = {
  id: string;
  claimed: boolean;
  /** the field's validity, for the control's aria-invalid */
  invalid: Ref<boolean>;
  /** id of the field's error or description, for the control's aria-describedby */
  describedby: Ref<string | undefined>;
};
const key: InjectionKey<FieldSlot> = Symbol("bless-field");

/** BlessField: hand the label's `for` id and the error/description wiring to the control inside */
export function provideField(
  id: string,
  invalid: Ref<boolean>,
  describedby: Ref<string | undefined>,
) {
  provide(key, { id, claimed: false, invalid, describedby });
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

/** Controls: the enclosing BlessField's validity and description ids (inert outside a field) */
export function useFieldState() {
  const field = inject(key, undefined);
  return {
    invalid: field?.invalid ?? ref(false),
    describedby: field?.describedby ?? ref<string | undefined>(undefined),
  };
}
