<script setup lang="ts">
import { ref } from "vue";

withDefaults(defineProps<{ title?: string; padded?: boolean }>(), { padded: true });
const showCode = ref(false);
</script>

<template>
  <div class="demo">
    <div v-if="title" class="demo__title">{{ title }}</div>
    <div class="demo__preview" :class="{ 'demo__preview--padded': padded }">
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

<style>
.demo {
  margin: 16px 0 28px;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.demo__title {
  padding: 6px 12px;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
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
.vp-doc .demo__preview :is(p, ul, ol, li, details, summary) {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: var(--bless-leading-normal);
}
.vp-doc .demo__preview details {
  border: 0;
  background: none;
}
.demo__preview .row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo__preview .col {
  display: grid;
  gap: 8px;
  width: 100%;
  max-width: 400px;
}
.demo__preview .row > .col {
  flex: 1 1 200px;
}
.demo__bar {
  display: flex;
  justify-content: flex-end;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.demo__toggle {
  padding: 4px 12px;
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
}
.demo__toggle:hover {
  color: var(--bless-color-accent);
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
</style>
