<script lang="ts">
/**
 * Parses CSV text after RFC 4180: fields in double quotes can hold commas, line breaks,
 * and "" for one quote. Lines end in LF or CRLF. Empty lines at the end are dropped.
 */
export function parseCsv(input: string, sep = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!;
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') ((field += '"'), i++);
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && field === "") quoted = true;
    else if (c === sep) (row.push(field), (field = ""));
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      ((row = []), (field = ""));
    } else field += c;
  }
  if (field !== "" || row.length) (row.push(field), rows.push(row));
  while (rows.length && rows.at(-1)!.every((f) => f === "")) rows.pop();
  return rows;
}
export interface BlessImportField {
  key: string;
  label: string;
  required?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessCsvImport" });
const pack = useLabelPack("BlessCsvImport");

const props = withDefaults(
  defineProps<{
    /** the fields of your records */
    fields: BlessImportField[];
    /** the rows to show in the preview */
    preview?: number;
    labels?: Partial<{
      file: string;
      match: string;
      skip: string;
      required: string;
      previewTitle: string;
      rows: (count: number) => string;
      missing: (count: number) => string;
      unmatched: (fields: string) => string;
      import: (count: number) => string;
      empty: string;
    }>;
  }>(),
  { preview: 5 },
);
const emit = defineEmits<{ import: [rows: Record<string, string>[]] }>();

const text = computed(() => ({
  file: "CSV file",
  match: "Match the columns",
  skip: "Skip",
  required: "required",
  previewTitle: "Preview",
  rows: (n: number) => `${n} rows in the file`,
  missing: (n: number) =>
    n === 1
      ? "1 row misses a required value and will be skipped."
      : `${n} rows miss a required value and will be skipped.`,
  unmatched: (f: string) => `Match these required fields: ${f}`,
  import: (n: number) => `Import ${n} rows`,
  empty: "The file has no rows.",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const header = ref<string[]>([]);
const body = ref<string[][]>([]);
const loaded = ref(false);
/** the column index for each field, or -1 to skip */
const map = ref<Record<string, number>>({});
async function read(file: File | undefined) {
  if (file) loadText(await file.text());
}
/** Loads CSV text, for example from a paste or a sample. */
function loadText(csv: string) {
  const all = parseCsv(csv);
  header.value = all[0] ?? [];
  body.value = all.slice(1);
  loaded.value = true;
  // match by name: the same words, without case, spaces, or marks
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  map.value = Object.fromEntries(
    props.fields.map((f) => [
      f.key,
      header.value.findIndex((h) => norm(h) === norm(f.label) || norm(h) === norm(f.key)),
    ]),
  );
}
defineExpose({ loadText });
const records = computed(() =>
  body.value.map((r) =>
    Object.fromEntries(
      props.fields.map((f) => [
        f.key,
        (map.value[f.key] ?? -1) >= 0 ? (r[map.value[f.key]!] ?? "").trim() : "",
      ]),
    ),
  ),
);
const unmatched = computed(() =>
  props.fields.filter((f) => f.required && (map.value[f.key] ?? -1) < 0),
);
const good = computed(() =>
  records.value.filter((r) => props.fields.every((f) => !f.required || r[f.key])),
);
const missing = computed(() => records.value.length - good.value.length);
</script>

<template>
  <div class="bless-csv">
    <label class="bless-csv__file">
      <span class="bless-csv__label">{{ text.file }}</span>
      <input
        type="file"
        accept=".csv,text/csv"
        @change="read(($event.target as HTMLInputElement).files?.[0])"
      />
    </label>
    <template v-if="loaded">
      <p v-if="!body.length" class="bless-csv__note" role="status">{{ text.empty }}</p>
      <template v-else>
        <p class="bless-csv__note" role="status">{{ text.rows(body.length) }}</p>
        <fieldset class="bless-csv__map">
          <legend class="bless-csv__label">{{ text.match }}</legend>
          <label v-for="f in fields" :key="f.key" class="bless-csv__pair">
            <span>
              {{ f.label
              }}<span v-if="f.required" class="bless-csv__req"> ({{ text.required }})</span>
            </span>
            <select
              v-model.number="map[f.key]"
              :aria-invalid="f.required && map[f.key]! < 0 ? 'true' : undefined"
            >
              <option :value="-1">{{ text.skip }}</option>
              <option v-for="(h, i) in header" :key="i" :value="i">{{ h || `#${i + 1}` }}</option>
            </select>
          </label>
        </fieldset>
        <div class="bless-csv__preview" role="region" :aria-label="text.previewTitle" tabindex="0">
          <table>
            <caption class="bless-csv__label">
              {{ text.previewTitle }}
            </caption>
            <thead>
              <tr>
                <th v-for="f in fields" :key="f.key" scope="col">{{ f.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in records.slice(0, preview)" :key="i">
                <td
                  v-for="f in fields"
                  :key="f.key"
                  :class="{ 'is-missing': f.required && !r[f.key] }"
                >
                  {{ r[f.key] || "—" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="unmatched.length" :id="`${uid}-err`" class="bless-csv__error" role="alert">
          {{ text.unmatched(unmatched.map((f) => f.label).join(", ")) }}
        </p>
        <p v-else-if="missing" class="bless-csv__warn">{{ text.missing(missing) }}</p>
        <BlessButton :disabled="!!unmatched.length || !good.length" @click="emit('import', good)">
          {{ text.import(good.length) }}
        </BlessButton>
      </template>
    </template>
  </div>
</template>

<style>
.bless-csv {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-csv__file {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-csv__label {
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
  text-align: start;
}
.bless-csv__note,
.bless-csv__warn,
.bless-csv__error {
  margin: 0;
}
.bless-csv__error {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-csv__map {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--bless-space-2) var(--bless-space-4);
  inline-size: 100%;
  margin: 0;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-csv__pair {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-csv__req {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-csv__pair select {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-csv__pair select[aria-invalid="true"] {
  border: 2px solid var(--bless-color-danger);
}
.bless-csv__pair select:focus-visible,
.bless-csv__file input:focus-visible,
.bless-csv__preview:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-csv__preview {
  inline-size: 100%;
  overflow-x: auto;
}
.bless-csv__preview table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-csv__preview caption {
  margin-block-end: var(--bless-space-1);
}
.bless-csv__preview th,
.bless-csv__preview td {
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
  white-space: nowrap;
}
.bless-csv__preview th {
  background: var(--bless-color-surface-2);
}
.bless-csv__preview td.is-missing {
  border: 2px dashed var(--bless-color-danger);
}
</style>
