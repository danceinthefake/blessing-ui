<template>
  <div class="bless-inspect">
    <div class="bless-inspect__line">
      <span class="bless-inspect__method">{{ method.toUpperCase() }}</span>
      <code class="bless-inspect__url">{{ url }}</code>
    </div>
    <div class="bless-inspect__facts">
      <span class="bless-inspect__status" :class="`is-${kind}`">
        {{ status }} {{ statusText }} <span class="bless-inspect__kind">({{ text[kind] }})</span>
      </span>
      <span v-if="duration != null">{{ ms.format(Math.round(duration)) }}</span>
      <span v-if="size != null">{{ kb.format(size / 1000) }}</span>
    </div>
    <BlessTabs v-model="tab" :tabs>
      <template #default="{ tab: t }">
        <div v-if="t.value === 'headers'" class="bless-inspect__headers">
          <template
            v-for="[title, h] in [
              [text.requestHeaders, request?.headers],
              [text.responseHeaders, response?.headers],
            ] as const"
            :key="title"
          >
            <div class="bless-inspect__label">{{ title }}</div>
            <dl>
              <div v-for="(v, k) in h ?? {}" :key="k">
                <dt>{{ k }}</dt>
                <dd>{{ v }}</dd>
              </div>
            </dl>
          </template>
        </div>
        <template v-else>
          <template
            v-for="b in [pretty(t.value === 'request' ? request?.body : response?.body)]"
            :key="t.value"
          >
            <BlessCodeBlock v-if="b.code" :code="b.code" :lang="b.lang" :label="t.label" copy />
            <div v-else class="bless-inspect__empty">{{ text.noBody }}</div>
          </template>
        </template>
      </template>
    </BlessTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessCodeBlock from "./BlessCodeBlock.vue";
import BlessTabs from "./BlessTabs.vue";

defineOptions({ name: "BlessRequestInspector" });
const pack = useLabelPack("BlessRequestInspector");

export interface BlessHttpMessage {
  headers?: Record<string, string>;
  body?: string;
}

const props = withDefaults(
  defineProps<{
    method: string;
    url: string;
    status: number;
    statusText?: string;
    /** how long it took, in milliseconds */
    duration?: number;
    /** the size of the response body, in bytes */
    size?: number;
    request?: BlessHttpMessage;
    response?: BlessHttpMessage;
    locale?: string;
    labels?: Partial<{
      headers: string;
      request: string;
      response: string;
      requestHeaders: string;
      responseHeaders: string;
      noBody: string;
      ok: string;
      redirect: string;
      clientError: string;
      serverError: string;
    }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  headers: "Headers",
  request: "Request body",
  response: "Response body",
  requestHeaders: "Request headers",
  responseHeaders: "Response headers",
  noBody: "No body.",
  ok: "success",
  redirect: "redirect",
  clientError: "client error",
  serverError: "server error",
  ...pack(),
  ...props.labels,
}));
const kind = computed(() =>
  props.status >= 500
    ? "serverError"
    : props.status >= 400
      ? "clientError"
      : props.status >= 300
        ? "redirect"
        : "ok",
);
const tabs = computed(() => [
  { value: "headers", label: text.value.headers },
  { value: "request", label: text.value.request },
  { value: "response", label: text.value.response },
]);
const tab = ref("response");
// JSON reads better with indents; other bodies stay as they are
function pretty(b?: string) {
  if (!b) return { code: "", lang: "text" };
  try {
    return { code: JSON.stringify(JSON.parse(b), null, 2), lang: "json" };
  } catch {
    return { code: b, lang: "text" };
  }
}
const ms = computed(
  () => new Intl.NumberFormat(props.locale, { style: "unit", unit: "millisecond" }),
);
const kb = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "unit",
      unit: "kilobyte",
      maximumFractionDigits: 1,
    }),
);
</script>

<style>
.bless-inspect {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-inspect__line {
  display: flex;
  gap: var(--bless-space-2);
  align-items: baseline;
  min-inline-size: 0;
}
.bless-inspect__method {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-weight: var(--bless-font-weight-bold);
}
.bless-inspect__url {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  overflow-wrap: anywhere;
}
.bless-inspect__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-4);
  font-variant-numeric: tabular-nums;
}
.bless-inspect__status {
  padding-inline: var(--bless-space-2);
  border: 2px solid var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-inspect__status:is(.is-clientError, .is-serverError) {
  border-color: var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
.bless-inspect__kind {
  font-weight: var(--bless-font-weight-normal);
}
.bless-inspect__headers {
  display: grid;
  gap: var(--bless-space-2);
  padding-block: var(--bless-space-2);
}
.bless-inspect__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-inspect__headers dl {
  display: grid;
  margin: 0;
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
}
.bless-inspect__headers dl div {
  display: grid;
  grid-template-columns: minmax(8rem, 14rem) 1fr;
  gap: var(--bless-space-3);
  padding: 2px 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-inspect__headers dt {
  font-weight: var(--bless-font-weight-bold);
}
.bless-inspect__headers dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.bless-inspect__empty {
  padding-block: var(--bless-space-3);
}
.bless-inspect {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
