<template>
  <aside class="bless-artifact" :aria-label="`${text.panel}: ${title}`">
    <header class="bless-artifact__head">
      <span class="bless-artifact__title">{{ title }}</span>
      <button
        type="button"
        class="bless-artifact__icon"
        :aria-label="text.close"
        @click="emit('close')"
      >
        ✕
      </button>
    </header>
    <div class="bless-artifact__bar">
      <span class="bless-artifact__versions">
        <button
          type="button"
          class="bless-artifact__icon"
          :aria-label="text.older"
          :disabled="at === 0"
          @click="version = at - 1"
        >
          ‹
        </button>
        <span>{{ text.version(at + 1, versions.length) }}</span>
        <button
          type="button"
          class="bless-artifact__icon"
          :aria-label="text.newer"
          :disabled="at >= versions.length - 1"
          @click="version = at + 1"
        >
          ›
        </button>
      </span>
      <span v-if="writing && at === versions.length - 1" class="bless-artifact__writing">{{
        text.writing
      }}</span>
      <span class="bless-artifact__actions">
        <button type="button" @click="copy">{{ said || text.copy }}</button>
        <button type="button" :disabled="writing" @click="download">{{ text.download }}</button>
      </span>
      <span class="bless-sr" role="status">{{ said }}</span>
    </div>
    <div class="bless-artifact__body" :aria-busy="writing || undefined">
      <BlessCodeBlock v-if="lang" :code="body" :lang :label="title" />
      <div v-else class="bless-artifact__text" tabindex="0">{{ body }}</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessCodeBlock from "./BlessCodeBlock.vue";
import "./sr.css";

defineOptions({ name: "BlessArtifactPanel" });
const pack = useLabelPack("BlessArtifactPanel");

const props = withDefaults(
  defineProps<{
    title: string;
    /** each version of the document, oldest first */
    versions: string[];
    /** a code language shows the text as code; leave it out for a plain document */
    lang?: string;
    /** the name of the file for the download */
    filename?: string;
    /** the model writes the last version now */
    writing?: boolean;
    labels?: Partial<{
      panel: string;
      version: (n: number, total: number) => string;
      older: string;
      newer: string;
      copy: string;
      copied: string;
      download: string;
      close: string;
      writing: string;
    }>;
  }>(),
  { filename: "document.txt" },
);
/** the index of the version in view; the newest by default */
const version = defineModel<number>("version");
const emit = defineEmits<{ close: [] }>();

const text = computed(() => ({
  panel: "Document",
  version: (n: number, t: number) => `Version ${n} of ${t}`,
  older: "Older version",
  newer: "Newer version",
  copy: "Copy",
  copied: "Copied",
  download: "Download",
  close: "Close the panel",
  writing: "Writing…",
  ...pack(),
  ...props.labels,
}));
const at = computed(() =>
  Math.min(props.versions.length - 1, Math.max(0, version.value ?? props.versions.length - 1)),
);
const body = computed(() => props.versions[at.value] ?? "");
const said = ref("");
async function copy() {
  await navigator.clipboard?.writeText(body.value).catch(() => {});
  said.value = text.value.copied;
  setTimeout(() => (said.value = ""), 2000);
}
function download() {
  const url = URL.createObjectURL(new Blob([body.value], { type: "text/plain;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: props.filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<style>
.bless-artifact {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  min-block-size: 20rem;
  max-block-size: 40rem;
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-artifact__head,
.bless-artifact__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-artifact__title {
  flex: 1;
  font-weight: var(--bless-font-weight-bold);
}
.bless-artifact__versions,
.bless-artifact__actions {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  font-variant-numeric: tabular-nums;
}
.bless-artifact__actions {
  margin-inline-start: auto;
}
.bless-artifact button {
  min-block-size: 2rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-artifact .bless-artifact__icon {
  inline-size: 2rem;
  padding: 0;
}
.bless-artifact button:disabled {
  opacity: 0.4;
  cursor: default;
}
.bless-artifact button:focus-visible,
.bless-artifact__text:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-artifact__writing {
  font-style: italic;
}
.bless-artifact__body {
  overflow: auto;
}
.bless-artifact__body > .bless-code {
  border: 0;
}
.bless-artifact__text {
  padding: var(--bless-space-4);
  line-height: 1.65;
  white-space: pre-wrap;
}
.bless-artifact {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
