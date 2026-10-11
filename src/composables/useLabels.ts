import { inject, provide, toValue, type InjectionKey, type MaybeRefOrGetter } from "vue";

/**
 * Words for many components at once: `{ BlessCopyButton: { copy: "Copiar" } }`. Each key is a
 * component name and each value is that component's `labels` object.
 */
export type BlessLabelPack = Record<string, Record<string, unknown>>;

export const blessLabelsKey: InjectionKey<MaybeRefOrGetter<BlessLabelPack>> =
  Symbol("bless-labels");

/** Provide a label pack to every component below this one. Pass a ref or a getter to switch language at run time. */
export function provideLabels(pack: MaybeRefOrGetter<BlessLabelPack>) {
  provide(blessLabelsKey, pack);
}

/**
 * Components: the pack's words for this component, read where the words are used so a change of
 * language updates the page. Order of precedence: the `labels` prop, then the pack, then the
 * English default.
 */
export function useLabelPack(name: string) {
  const pack = inject(blessLabelsKey, undefined);
  return (): Record<string, unknown> => (pack ? (toValue(pack)[name] ?? {}) : {});
}
