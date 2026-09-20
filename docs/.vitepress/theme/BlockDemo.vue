<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  /** { "index.vue": "<source>", ... } — from import.meta.glob(..., { as: "raw" }) */
  files: Record<string, string>;
  components?: string[];
  /** min preview height */
  height?: string;
}>();
const names = computed(() =>
  Object.keys(props.files).sort((a, b) =>
    a === "index.vue" ? -1 : b === "index.vue" ? 1 : a.localeCompare(b),
  ),
);
const active = ref("index.vue");
const view = ref<"desktop" | "phone">("desktop");
const showCode = ref(false);
const copied = ref("");
async function copy(what: "file" | "all") {
  const text =
    what === "file"
      ? props.files[active.value]
      : names.value.map((n) => `/* ---- ${n} ---- */\n${props.files[n]}`).join("\n\n");
  await navigator.clipboard.writeText(text);
  copied.value = what;
  setTimeout(() => (copied.value = ""), 1200);
}
</script>

<template>
  <div class="block">
    <div class="block__bar">
      <div class="block__seg" role="group" aria-label="Preview width">
        <button type="button" :aria-pressed="view === 'desktop'" @click="view = 'desktop'">
          Desktop
        </button>
        <button type="button" :aria-pressed="view === 'phone'" @click="view = 'phone'">
          Phone
        </button>
      </div>
      <span class="block__used" v-if="components?.length">{{ components.join(" · ") }}</span>
      <button
        type="button"
        class="block__toggle"
        :aria-expanded="showCode"
        @click="showCode = !showCode"
      >
        {{ showCode ? "Hide code" : "Show code" }}
      </button>
      <button type="button" class="block__toggle" @click="copy('all')">
        {{ copied === "all" ? "Copied" : "Copy all" }}
      </button>
    </div>
    <div class="block__preview" :class="`block__preview--${view}`" :style="{ minHeight: height }">
      <div class="block__frame"><slot /></div>
    </div>
    <div v-show="showCode" class="block__code">
      <div class="block__tabs" role="tablist">
        <button
          v-for="n in names"
          :key="n"
          type="button"
          role="tab"
          :aria-selected="active === n"
          @click="active = n"
        >
          {{ n }}
        </button>
        <span style="flex: 1" />
        <button type="button" class="block__toggle" @click="copy('file')">
          {{ copied === "file" ? "Copied" : "Copy file" }}
        </button>
      </div>
      <pre class="block__src"><code>{{ files[active] }}</code></pre>
    </div>
  </div>
</template>

<style>
.block {
  margin: 16px 0 32px;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.block__bar,
.block__tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.block__seg {
  display: inline-flex;
  gap: 2px;
}
.block__seg button,
.block__toggle,
.block__tabs button {
  padding: 3px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.block__seg button[aria-pressed="true"],
.block__tabs button[aria-selected="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.block__toggle:hover,
.block__tabs button:hover {
  color: var(--bless-color-accent);
}
.block__used {
  flex: 1;
  text-transform: none;
  letter-spacing: normal;
  font-family: var(--bless-font-sans);
}
.block__preview {
  display: flex;
  justify-content: center;
  background: var(--bless-color-surface);
  padding: 24px;
  overflow: auto;
}
.block__frame {
  width: 100%;
  background: var(--bless-color-bg);
  transition: width var(--bless-duration-slow) var(--bless-ease-in-out);
}
.block__preview--phone .block__frame {
  width: 390px;
  min-height: 720px;
  box-shadow: var(--bless-shadow-md);
}
/* block content is app UI, not prose */
.vp-doc .block__frame :is(p, ul, ol, li, h1, h2, h3, h4, table, th, td):not(.tiptap *) {
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
  background: none;
}
/* vp-doc sizes headings and paragraphs; BlessText sizes itself, so only reset the bare ones */
.vp-doc .block__frame :is(p, li, h1, h2, h3, h4):not(.bless-text, .tiptap *) {
  line-height: var(--bless-leading-normal);
}
.vp-doc .block__frame :is(h1, h2, h3, h4):not(.bless-text) {
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
}
.vp-doc .block__frame table {
  display: table;
}
.vp-doc .block__frame a {
  color: inherit;
  font-weight: inherit;
  text-decoration: none;
}
.block__tabs {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  text-transform: none;
  letter-spacing: normal;
  font-family: ui-monospace, monospace;
}
.block__src {
  margin: 0;
  padding: 16px;
  max-height: 480px;
  overflow: auto;
  background: var(--bless-color-surface);
  font-size: 12.5px;
  line-height: 1.5;
}
</style>
