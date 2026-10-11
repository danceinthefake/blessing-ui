<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BlessInput from "./BlessInput.vue";
import BlessInputGroup from "./BlessInputGroup.vue";
import BlessSelect from "./BlessSelect.vue";
import { COUNTRIES, joinPhone, nationalDigits, splitPhone } from "./phone";
import type { BlessCountry } from "./phone";

defineOptions({ name: "BlessPhoneInput", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** region codes and calling codes to offer. The default is a list of 46 countries. */
    countries?: BlessCountry[];
    /** the country shown when the value is empty */
    defaultCountry?: string;
    /** language of the country names (`Intl.DisplayNames`) */
    locale?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    labels?: Partial<{ country: string; number: string }>;
  }>(),
  { countries: () => COUNTRIES, defaultCountry: "US", size: "md" },
);
/** the full number as `+` and digits (E.164), for example `+628123456789`. Empty when no digits. */
const model = defineModel<string>({ default: "" });
/** the region code of the selected country */
const code = defineModel<string>("country");

const text = computed(() => ({ country: "Country code", number: "Phone number", ...props.labels }));
const names = computed(() => {
  try {
    return new Intl.DisplayNames(props.locale, { type: "region" });
  } catch {
    return undefined;
  }
});
const options = computed(() =>
  props.countries.map((c) => ({
    value: c.code,
    label: `${names.value?.of(c.code) ?? c.code} (+${c.dial})`,
  })),
);
const current = computed(
  () =>
    props.countries.find((c) => c.code === code.value) ??
    props.countries.find((c) => c.code === props.defaultCountry) ??
    props.countries[0],
);

const national = ref("");
function read(value: string) {
  const s = splitPhone(value, props.countries, code.value ?? props.defaultCountry);
  if (!s) return void (national.value = value ? national.value : "");
  national.value = s.national;
  code.value = s.country.code;
}
read(model.value);
// a value that comes from outside replaces what the box shows. One that we wrote ourselves does not.
watch(model, (v) => {
  if (v !== joinPhone(current.value.dial, national.value)) read(v);
});

function onNumber(v: string | number) {
  national.value = nationalDigits(String(v), current.value.dial);
  model.value = joinPhone(current.value.dial, national.value);
}
function onCountry(c: string | undefined) {
  code.value = c;
  const dial = props.countries.find((x) => x.code === c)?.dial ?? current.value.dial;
  national.value = nationalDigits(national.value, dial);
  model.value = joinPhone(dial, national.value);
}
</script>

<template>
  <BlessInputGroup class="bless-phone" :size="size" :disabled="disabled">
    <template #prefix>
      <BlessSelect
        :model-value="current.code"
        :options="options"
        :size="size"
        :aria-label="text.country"
        @update:model-value="onCountry"
      />
    </template>
    <BlessInput
      v-bind="$attrs"
      :model-value="national"
      type="tel"
      inputmode="tel"
      autocomplete="tel-national"
      :size="size"
      :aria-label="$attrs['aria-label'] ?? text.number"
      @update:model-value="onNumber"
    />
  </BlessInputGroup>
</template>
