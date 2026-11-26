<template>
  <div class="demo">
    <div v-if="title" class="demo__title">{{ title }}</div>
    <div ref="preview" class="demo__preview vp-raw" :class="{ 'demo__preview--padded': padded }">
      <slot />
    </div>
    <div v-if="$slots.code" class="demo__bar">
      <button
        type="button"
        class="demo__toggle"
        :aria-expanded="showCode"
        @click="showCode = !showCode"
      >
        {{ showCode ? "Hide code" : "Show code" }}
      </button>
    </div>
    <div v-if="$slots.code" v-show="showCode" class="demo__code"><slot name="code" /></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue";

withDefaults(defineProps<{ title?: string; padded?: boolean }>(), { padded: true });
const showCode = ref(false);
const preview = ref<HTMLElement>();
// VitePress scrapes every headed element with an id inside .VPDoc for "On this page".
// Demo headings (including closed <dialog> titles) aren't page sections — mark them ignored.
function markDemoHeaders() {
  preview.value
    ?.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    .forEach((el) => el.classList.add("ignore-header"));
}
onMounted(markDemoHeaders);
onUpdated(markDemoHeaders);
</script>

<style>
.demo {
  margin: 16px 0 28px;
  border-radius: var(--bless-radius);
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.demo__title {
  padding: 8px 14px;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-normal);
  text-transform: var(--bless-label-case);
  color: var(--bless-color-text-muted);
}
.demo__preview {
  min-width: 0;
  overflow-x: auto;
  background: var(--bless-color-bg);
}
.demo__preview--padded {
  padding: 24px;
}
/* demo content shouldn't inherit vp-doc paragraph/list styling */
.vp-doc
  .demo__preview
  :is(p, ul, ol, li, details, summary):not(
    .tiptap *,
    .bless-org *,
    .bless-markdown *,
    .bless-thread__replies,
    .bless-toolcall,
    .bless-toolcall *,
    .bless-pricing *,
    .bless-changelog *,
    .bless-footnotes *,
    .bless-faq *,
    .bless-flags *,
    .bless-status *,
    .bless-incident *
  ) {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: var(--bless-leading-normal);
}
.vp-doc .demo__preview details:not(.bless-thread__replies, .bless-toolcall) {
  border: 0;
  background: none;
}
.demo__preview .row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 16px;
  align-items: center;
}
.demo__preview .row:has(.bless-input, .bless-select, .bless-textarea, .bless-field, .bless-datepicker) {
  align-items: flex-start;
  gap: 16px 24px;
}
.demo__preview .col {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 400px;
}
.demo__preview .row > .col {
  flex: 1 1 200px;
}
.demo__bar {
  display: flex;
  justify-content: flex-end;
  padding: 4px 8px;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.demo__toggle {
  padding: 4px 12px;
  border: 0;
  border-radius: var(--bless-radius-pill);
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-medium);
  letter-spacing: var(--bless-tracking-normal);
  cursor: pointer;
  transition:
    background-color var(--bless-duration-base) var(--bless-ease-out),
    color var(--bless-duration-base) var(--bless-ease-out);
}
.demo__toggle:hover {
  background: var(--bless-color-hover);
  color: var(--bless-color-text);
}
.demo__code div[class*="language-"] {
  margin: 0;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>

<style>
.demo__preview .boxed {
  border: var(--bless-border-width) solid var(--bless-color-border);
  padding-inline: var(--bless-space-6);
}
.demo__preview .pad {
  padding: var(--bless-space-2) var(--bless-space-4);
}
/* the preview is .vp-raw, so a plain <code> written in a demo gets no VitePress style */
.demo__preview code:not([class]) {
  padding: 0.15em 0.4em;
  background: var(--bless-color-surface);
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}
</style>
