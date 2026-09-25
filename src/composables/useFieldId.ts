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
    /** inside a BlessField: its label names the control, so skip a default aria-label */
    inField: !!field,
    invalid: field?.invalid ?? ref(false),
    describedby: field?.describedby ?? ref<string | undefined>(undefined),
  };
}

/**
 * Label wrappers (FloatLabel): the id their `for` points at. Inside a BlessField it is the
 * field's id, so both labels name the same control; otherwise a fresh one is provided for it.
 */
export function useLabelFor(explicit?: string) {
  const outer = inject(key, undefined);
  const uid = useId();
  const id = explicit ?? outer?.id ?? uid;
  if (!outer)
    provide(key, { id, claimed: false, invalid: ref(false), describedby: ref(undefined) });
  return id;
}
