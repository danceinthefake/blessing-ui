<template>
  <div class="block">
    <div class="block__bar">
      <div v-if="!fullPage" class="block__seg" role="group" aria-label="Preview width">
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
    <div v-if="fullPage" class="block__full">
      <a :href="fullPage" class="block__open">Open full page ↗</a>
    </div>
    <div
      v-else
      class="block__preview"
      :class="`block__preview--${view}`"
      :style="{ minHeight: height }"
    >
      <iframe
        v-if="frame"
        ref="iframe"
        :src="frame"
        class="block__frame"
        :style="{ height: `${Math.max(frameH, parseInt(height ?? '0') || 0)}px` }"
        :title="`${components?.[0] ?? 'Block'} preview`"
      />
      <div v-else class="block__frame"><slot /></div>
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

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { useTheme } from "blessing-ui";

const props = defineProps<{
  /** { "index.vue": "<source>", ... } — from import.meta.glob(..., { as: "raw" }) */
  files: Record<string, string>;
  components?: string[];
  /** min preview height */
  height?: string;
  /** URL of the <slug>-frame page rendered in the preview iframe */
  frame?: string;
  /** block owns the viewport (BlessStage/BlessLayout): no inline preview, link out instead */
  fullPage?: string;
}>();
// preview runs in an iframe so lib styles and the block's media queries are free of docs CSS
const iframe = ref<HTMLIFrameElement>();
const frameH = ref(0);
const { isDark } = useData();
const { theme, palette } = useTheme();
let mo: MutationObserver | undefined;
function sync() {
  const effectiveTheme =
    theme.value === "system" ? (isDark.value ? "dark" : "light") : theme.value;
  iframe.value?.contentWindow?.postMessage(
    {
      type: "bless-theme",
      dark: isDark.value,
      theme: effectiveTheme,
      palette: palette.value,
      motion: document.documentElement.dataset.motion ?? "",
    },
    "*",
  );
}
function onMsg(e: MessageEvent) {
  if (e.source !== iframe.value?.contentWindow || !e.data) return;
  if (e.data.type === "bless-ready") sync();
  if (e.data.type === "bless-height") frameH.value = e.data.h;
}
watch([isDark, theme, palette], sync);
onMounted(() => {
  addEventListener("message", onMsg);
  mo = new MutationObserver(sync);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
});
onBeforeUnmount(() => {
  removeEventListener("message", onMsg);
  mo?.disconnect();
});
const names = computed(() =>
  Object.keys(props.files).sort((a, b) =>
    a === "index.vue" ? -1 : b === "index.vue" ? 1 : a.localeCompare(b),
  ),
);
const active = ref("index.vue");
const view = ref<"desktop" | "phone">("desktop");
const showCode = ref(!!props.fullPage);
const copied = ref("");
async function copy(what: "file" | "all") {
  const text =
    what === "file"
      ? props.files[active.value]
      : names.value.map((n) => `/* ---- ${n} ---- */\n${props.files[n]}`).join("\n\n");
  try {
    await navigator.clipboard.writeText(text);
    copied.value = what;
    setTimeout(() => (copied.value = ""), 1200);
  } catch {}
}
</script>

<style>
.block {
  margin: 16px 0 32px;
  border-radius: var(--bless-radius);
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.block__bar,
.block__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  padding: 8px 12px;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-normal);
  color: var(--bless-color-text-muted);
}
.block__seg {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--bless-radius-pill);
  background: var(--bless-color-surface);
}
.block__seg button,
.block__toggle,
.block__tabs button {
  padding: 4px 12px;
  border: 0;
  border-radius: var(--bless-radius-pill);
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-medium);
  cursor: pointer;
  transition:
    background-color var(--bless-duration-base) var(--bless-ease-out),
    color var(--bless-duration-base) var(--bless-ease-out);
}
.block__toggle:hover,
.block__tabs button:hover,
.block__seg button:hover {
  background: var(--bless-color-hover);
  color: var(--bless-color-text);
}
.block__seg button[aria-pressed="true"],
.block__tabs button[aria-selected="true"] {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.block__used {
  flex: 1 1 180px;
  min-width: 0;
  font-family: var(--bless-font-sans);
}
.block__preview {
  display: flex;
  justify-content: center;
  background: var(--bless-color-surface);
  padding: 24px;
  overflow: auto;
}
.block__full {
  display: grid;
  place-items: center;
  padding: 40px 24px;
  background: var(--bless-color-surface);
}
.vp-doc .block__open {
  padding: 8px 20px;
  border-radius: var(--bless-radius-pill);
  border: var(--bless-border-width) solid var(--bless-color-text);
  color: var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-normal);
  text-decoration: none;
  transition: transform var(--bless-duration-base) var(--bless-ease-spring);
}
.vp-doc .block__open:hover {
  transform: translateY(var(--bless-hover-lift));
}
iframe.block__frame {
  display: block;
  border: 0;
  min-height: 160px;
}
.block__frame {
  width: 100%;
  background: var(--bless-color-bg);
  transition: width var(--bless-duration-slow) var(--bless-ease-in-out);
}
.block__preview--phone .block__frame {
  width: 390px;
  min-height: 720px;
  box-shadow: var(--bless-shadow-plate);
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
.vp-doc .block__frame a:not([class]) {
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
