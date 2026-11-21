<template>
  <section class="bless-api" :aria-label="`${m} ${path}`">
    <header class="bless-api__head">
      <span class="bless-api__method" :class="`is-${m.toLowerCase()}`">{{ m }}</span>
      <h3 class="bless-api__path">
        <code
          ><template v-for="(x, i) in parts" :key="i"
            ><span v-if="x.param" class="bless-api__param">{{ x.p }}</span
            ><template v-else>{{ x.p }}</template></template
          ></code
        >
      </h3>
    </header>
    <div v-if="summary" class="bless-api__summary">{{ summary }}</div>
    <div v-if="description" class="bless-api__text">{{ description }}</div>
    <div v-if="params?.length" class="bless-api__part">
      <div class="bless-api__label">{{ text.params }}</div>
      <table class="bless-api__table">
        <thead>
          <tr>
            <th scope="col">{{ text.name }}</th>
            <th scope="col">{{ text.where }}</th>
            <th scope="col">{{ text.type }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in params" :key="`${p.in}:${p.name}`">
            <th scope="row">
              <code>{{ p.name }}</code>
              <span class="bless-api__need" :class="{ 'is-required': p.required }">{{
                p.required ? text.required : text.optional
              }}</span>
              <span v-if="p.description" class="bless-api__desc">{{ p.description }}</span>
            </th>
            <td>{{ p.in }}</td>
            <td><code>{{ p.type }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="example" class="bless-api__part">
      <div class="bless-api__label">{{ text.example }}</div>
      <BlessCodeBlock :code="example" :lang="exampleLang ?? 'sh'" :label="text.example" copy />
    </div>
    <div v-if="responses?.length" class="bless-api__part">
      <div class="bless-api__label">{{ text.responses }}</div>
      <BlessTabs v-model="tab" :tabs :label="text.responses">
        <template #default="{ tab: t }">
          <template v-for="r in responses" :key="r.status">
            <div v-if="String(r.status) === t.value" class="bless-api__response">
              <div v-if="r.description">{{ r.description }}</div>
              <BlessCodeBlock v-if="r.body" :code="r.body" lang="json" :label="`${r.status}`" />
            </div>
          </template>
        </template>
      </BlessTabs>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessCodeBlock from "./BlessCodeBlock.vue";
import BlessTabs from "./BlessTabs.vue";

defineOptions({ name: "BlessApiEndpoint" });
const pack = useLabelPack("BlessApiEndpoint");

export interface BlessApiParam {
  name: string;
  in: "path" | "query" | "header" | "body";
  type: string;
  required?: boolean;
  description?: string;
}
export interface BlessApiResponse {
  status: number;
  description?: string;
  /** an example body, often JSON */
  body?: string;
}

const props = defineProps<{
  method: string;
  /** with path parameters in braces, for example /orders/{id} */
  path: string;
  summary?: string;
  description?: string;
  params?: BlessApiParam[];
  /** an example request, for example a curl command */
  example?: string;
  exampleLang?: string;
  responses?: BlessApiResponse[];
  labels?: Partial<{
    params: string;
    name: string;
    type: string;
    where: string;
    required: string;
    optional: string;
    example: string;
    responses: string;
  }>;
}>();

const text = computed(() => ({
  params: "Parameters",
  name: "Name",
  type: "Type",
  where: "In",
  required: "required",
  optional: "optional",
  example: "Example request",
  responses: "Responses",
  ...pack(),
  ...props.labels,
}));
const m = computed(() => props.method.toUpperCase());
// the path in parts, so the parameters in braces stand out
const parts = computed(() =>
  props.path
    .split(/(\{[^}]+\})/)
    .filter(Boolean)
    .map((p) => ({ p, param: p.startsWith("{") })),
);
const tabs = computed(() =>
  (props.responses ?? []).map((r) => ({ value: String(r.status), label: String(r.status) })),
);
const tab = ref(tabs.value[0]?.value ?? "");
</script>

<style>
.bless-api {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-api code {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
}
.bless-api__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-api__method {
  min-inline-size: 4.5rem;
  padding: 2px var(--bless-space-2);
  border: 2px solid var(--bless-color-text);
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-weight: var(--bless-font-weight-bold);
  text-align: center;
}
.bless-api__method.is-get {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-api__method.is-delete {
  border-color: var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
/* two classes, so the heading styles of a host page do not win */
.bless-api .bless-api__path {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-md);
  overflow-wrap: anywhere;
}
.bless-api__param {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  font-style: italic;
}
.bless-api__summary {
  font-weight: var(--bless-font-weight-bold);
}
.bless-api__text {
  line-height: 1.6;
  white-space: pre-line;
}
.bless-api__part {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-api__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.bless-api__table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-api__table :is(th, td) {
  padding: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
  vertical-align: top;
}
.bless-api__table thead th {
  font-size: var(--bless-text-xs);
}
.bless-api__table tbody th {
  font-weight: var(--bless-font-weight-normal);
}
.bless-api__table tbody th code {
  font-weight: var(--bless-font-weight-bold);
}
.bless-api__need {
  margin-inline-start: var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-api__need.is-required {
  font-weight: var(--bless-font-weight-bold);
}
.bless-api__desc {
  display: block;
  margin-block-start: 2px;
}
.bless-api__response {
  display: grid;
  gap: var(--bless-space-2);
  padding-block-start: var(--bless-space-2);
}
.bless-api {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
