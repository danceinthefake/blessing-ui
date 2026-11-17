<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessDocumentChecklist" });
const pack = useLabelPack("BlessDocumentChecklist");

export type BlessChecklistDocState = "missing" | "uploaded" | "checking" | "accepted" | "rejected";
export interface BlessChecklistDoc {
  id: string;
  name: string;
  hint?: string;
  required?: boolean;
  /** the file types, as for the accept attribute of a file input */
  accept?: string;
  state: BlessChecklistDocState;
  /** the name of the file that the person sent */
  file?: string;
  /** why the document was not accepted */
  reason?: string;
}

const props = defineProps<{
  docs: BlessChecklistDoc[];
  labels?: Partial<
    Record<BlessChecklistDocState, string> & {
      progress: (done: number, total: number) => string;
      required: string;
      optional: string;
      upload: string;
      replace: string;
      remove: (name: string) => string;
    }
  >;
}>();
const emit = defineEmits<{ upload: [id: string, file: File]; remove: [id: string] }>();

const text = computed(() => ({
  missing: "Not sent",
  uploaded: "Sent",
  checking: "Being checked",
  accepted: "Accepted",
  rejected: "Not accepted",
  progress: (d: number, t: number) => `${d} of ${t} required documents sent`,
  required: "Required",
  optional: "Optional",
  upload: "Upload",
  replace: "Replace",
  remove: (n: string) => `Remove ${n}`,
  ...pack(),
  ...props.labels,
}));
const id = useId();
const MARK: Record<BlessChecklistDocState, string> = {
  missing: "○",
  uploaded: "●",
  checking: "◐",
  accepted: "✓",
  rejected: "✕",
};
const required = computed(() => props.docs.filter((d) => d.required));
const done = computed(
  () => required.value.filter((d) => d.state !== "missing" && d.state !== "rejected").length,
);
function pick(d: BlessChecklistDoc, e: Event) {
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  if (f) emit("upload", d.id, f);
  input.value = "";
}
// the button says Upload or Replace; screen readers also hear the name of the document
const action = (d: BlessChecklistDoc) => (d.state === "missing" ? "upload" : "replace");
</script>

<template>
  <div class="bless-docs">
    <div class="bless-docs__progress">
      <span role="status">{{ text.progress(done, required.length) }}</span>
      <span class="bless-docs__bar" aria-hidden="true">
        <span :style="{ inlineSize: `${required.length ? (done / required.length) * 100 : 0}%` }" />
      </span>
    </div>
    <ul class="bless-stagger bless-docs__list" role="list">
      <li v-for="d in docs" :key="d.id">
        <div class="bless-docs__item" :class="`is-${d.state}`">
          <span class="bless-docs__mark" aria-hidden="true">{{ MARK[d.state] }}</span>
          <span class="bless-docs__main">
            <span class="bless-docs__name">
              {{ d.name }}
              <span class="bless-docs__need">{{ d.required ? text.required : text.optional }}</span>
            </span>
            <span v-if="d.hint" class="bless-docs__hint">{{ d.hint }}</span>
            <span class="bless-docs__state">
              {{ text[d.state] }}<template v-if="d.file"> · {{ d.file }}</template>
            </span>
            <span v-if="d.state === 'rejected' && d.reason" class="bless-docs__reason">{{
              d.reason
            }}</span>
          </span>
          <span v-if="d.state !== 'accepted' && d.state !== 'checking'" class="bless-docs__actions">
            <input
              :id="`${id}-${d.id}`"
              type="file"
              class="bless-sr"
              :accept="d.accept"
              @change="pick(d, $event)"
            />
            <label :for="`${id}-${d.id}`" class="bless-docs__upload"
              >{{ text[action(d)] }}<span class="bless-sr">{{ ` ${d.name}` }}</span></label
            >
            <button
              v-if="d.state === 'uploaded'"
              type="button"
              :aria-label="text.remove(d.name)"
              @click="emit('remove', d.id)"
            >
              ✕
            </button>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-docs {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-docs__progress {
  display: grid;
  gap: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
.bless-docs__bar {
  block-size: 0.5rem;
  background: var(--bless-color-surface-2);
}
.bless-docs__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-docs__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-docs__item {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
}
.bless-docs__item.is-rejected {
  border-color: var(--bless-color-danger);
}
.bless-docs__item.is-accepted {
  border-color: var(--bless-color-text);
}
.bless-docs__mark {
  font-size: var(--bless-text-lg);
  line-height: 1.2;
  text-align: center;
}
.is-rejected > .bless-docs__mark {
  color: var(--bless-color-danger-text);
}
.bless-docs__main {
  display: grid;
  gap: 2px;
}
.bless-docs__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-docs__need {
  margin-inline-start: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
}
.bless-docs__hint,
.bless-docs__state {
  font-size: var(--bless-text-xs);
}
.bless-docs__state {
  font-weight: var(--bless-font-weight-bold);
}
.bless-docs__reason {
  color: var(--bless-color-danger-text);
}
.bless-docs__actions {
  display: flex;
  gap: var(--bless-space-1);
}
.bless-docs__upload,
.bless-docs__actions button {
  display: inline-grid;
  place-items: center;
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
  cursor: pointer;
}
.bless-docs__actions button {
  padding: 0;
  inline-size: 2.25rem;
}
.bless-docs__actions input:focus-visible + .bless-docs__upload,
.bless-docs__actions button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
