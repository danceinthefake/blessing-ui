<template>
  <fieldset class="bless-address">
    <legend class="bless-address__legend">{{ label }}</legend>
    <div class="bless-address__row">
      <label class="bless-address__field">
        <span class="bless-address__label">{{ text.country }}</span>
        <select
          class="bless-address__input"
          autocomplete="country"
          :value="address.country"
          @change="set({ country: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="c in countries" :key="c" :value="c">{{ names.of(c) }}</option>
        </select>
      </label>
    </div>
    <div v-for="(row, r) in format.rows" :key="r" class="bless-address__row">
      <label v-for="f in row" :key="f" class="bless-address__field" :class="`is-${f}`">
        <span class="bless-address__label">{{ fieldLabel(f) }}</span>
        <input
          class="bless-address__input"
          :autocomplete="AUTO[f]"
          :value="address[f] ?? ''"
          :required="f !== 'line2' || undefined"
          @input="set({ [f]: ($event.target as HTMLInputElement).value })"
        />
      </label>
    </div>
  </fieldset>
</template>

<script lang="ts">
export type BlessAddressField = "line1" | "line2" | "city" | "region" | "postal";
export interface BlessAddress {
  /** an ISO 3166 code, for example `ID` */
  country: string;
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postal?: string;
}
/** the rows of fields of a country, and the label keys of its region and postal code */
export interface BlessAddressFormat {
  rows: BlessAddressField[][];
  region?: "state" | "province" | "prefecture" | "county";
  postal?: "zip" | "postcode" | "postal";
}

/** A short table of common formats; pass `formats` to add or change a country. */
export const addressFormats: Record<string, BlessAddressFormat> = {
  US: {
    rows: [["line1"], ["line2"], ["city", "region", "postal"]],
    region: "state",
    postal: "zip",
  },
  CA: {
    rows: [["line1"], ["line2"], ["city", "region", "postal"]],
    region: "province",
    postal: "postal",
  },
  ID: {
    rows: [["line1"], ["line2"], ["city", "region"], ["postal"]],
    region: "province",
    postal: "postal",
  },
  GB: { rows: [["line1"], ["line2"], ["city"], ["postal"]], postal: "postcode" },
  DE: { rows: [["line1"], ["line2"], ["postal", "city"]], postal: "postal" },
  FR: { rows: [["line1"], ["line2"], ["postal", "city"]], postal: "postal" },
  JP: {
    rows: [["postal"], ["region", "city"], ["line1"], ["line2"]],
    region: "prefecture",
    postal: "postal",
  },
  "*": {
    rows: [["line1"], ["line2"], ["city", "region"], ["postal"]],
    region: "province",
    postal: "postal",
  },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessAddressFields" });
const pack = useLabelPack("BlessAddressFields");

const props = withDefaults(
  defineProps<{
    /** the countries to offer, as ISO codes */
    countries?: string[];
    /** more formats, or changes to the built-in ones, by country code */
    formats?: Record<string, BlessAddressFormat>;
    /** the language of the country names, for example `id` */
    locale?: string;
    /** names the group of fields */
    label?: string;
    labels?: Partial<{
      country: string;
      line1: string;
      line2: string;
      city: string;
      state: string;
      province: string;
      prefecture: string;
      county: string;
      zip: string;
      postcode: string;
      postal: string;
    }>;
  }>(),
  { countries: () => ["ID", "US", "GB", "DE", "FR", "JP", "CA"], locale: "en", label: "Address" },
);
const address = defineModel<BlessAddress>({ default: () => ({ country: "ID" }) });

const text = computed(() => ({
  country: "Country",
  line1: "Street and number",
  line2: "Apartment, floor, or building (optional)",
  city: "City",
  state: "State",
  province: "Province",
  prefecture: "Prefecture",
  county: "County",
  zip: "ZIP code",
  postcode: "Postcode",
  postal: "Postal code",
  ...pack(),
  ...props.labels,
}));
const names = computed(() => new Intl.DisplayNames(props.locale, { type: "region" }));
const format = computed(() => {
  const all = { ...addressFormats, ...props.formats };
  return all[address.value.country] ?? all["*"]!;
});
const AUTO: Record<BlessAddressField, string> = {
  line1: "address-line1",
  line2: "address-line2",
  city: "address-level2",
  region: "address-level1",
  postal: "postal-code",
};
const fieldLabel = (f: BlessAddressField) =>
  f === "region"
    ? text.value[format.value.region ?? "province"]
    : f === "postal"
      ? text.value[format.value.postal ?? "postal"]
      : text.value[f];
const set = (patch: Partial<BlessAddress>) => (address.value = { ...address.value, ...patch });
</script>

<style>
.bless-address {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-address__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-address__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-3);
}
.bless-address__field {
  display: grid;
  flex: 1 1 10rem;
  gap: var(--bless-space-1);
}
/* a postal code is short, so its field is too */
.bless-address__field.is-postal {
  flex: 0 1 9rem;
}
.bless-address__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-address__input {
  min-block-size: 2.4rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-address__input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
