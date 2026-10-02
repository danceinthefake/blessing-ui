<script lang="ts">
export interface BlessCodeFile {
  name: string;
  code: string;
  lang?: string;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId } from "vue";

defineOptions({ name: "BlessCodeBlock" });

const props = withDefaults(
  defineProps<{
    code?: string;
    lang?: string;
    filename?: string;
    /** several files as tabs; wins over `code` */
    files?: BlessCodeFile[];
    /** lines to mark, e.g. `"2,4-6"` or `[2, 4, 5, 6]` (1-based) */
    lines?: string | number[];
    lineNumbers?: boolean;
    copy?: boolean;
    /** wrap long lines instead of scrolling sideways */
    wrap?: boolean;
    label?: string;
  }>(),
  { copy: true, label: "Code" },
);
const active = defineModel<number>("active", { default: 0 });
const emit = defineEmits<{ copy: [code: string] }>();

const id = useId();
const file = computed<BlessCodeFile>(() => {
  const f = props.files?.length
    ? props.files[Math.min(active.value, props.files.length - 1)]
    : undefined;
  return f ?? { name: props.filename ?? "", code: props.code ?? "", lang: props.lang };
});
const lang = computed(() => file.value.lang ?? props.lang);

const marked = computed(() => {
  const set = new Set<number>();
  if (Array.isArray(props.lines)) props.lines.forEach((n) => set.add(n));
  else
    for (const part of (props.lines ?? "").split(",")) {
      const [a, b] = part.split("-").map((s) => parseInt(s, 10));
      if (a) for (let n = a; n <= (b ?? a); n++) set.add(n);
    }
  return set;
});
const rows = computed(() =>
  file.value.code
    .replace(/\n$/, "")
    .split("\n")
    .map((text, i) => ({ n: i + 1, text, hl: marked.value.has(i + 1) })),
);

// --- tabs: one tab stop, arrows move and select ---
const tabs = ref<HTMLElement>();
function onTabKey(e: KeyboardEvent) {
  const n = props.files?.length ?? 0;
  const to =
    e.key === "ArrowRight"
      ? active.value + 1
      : e.key === "ArrowLeft"
        ? active.value - 1
        : e.key === "Home"
          ? 0
          : e.key === "End"
            ? n - 1
            : null;
  if (to == null) return;
  e.preventDefault();
  active.value = (to + n) % n;
  nextTick(() => tabs.value?.querySelectorAll<HTMLElement>('[role="tab"]')[active.value]?.focus());
}

// --- copy ---
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
async function doCopy() {
  const text = file.value.code;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  emit("copy", text);
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 2000);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <figure class="bless-code">
    <figcaption v-if="files?.length || filename || lang || copy" class="bless-code__head">
      <div
        v-if="files?.length"
        ref="tabs"
        class="bless-code__tabs"
        role="tablist"
        :aria-label="label"
      >
        <button
          v-for="(f, i) in files"
          :id="`${id}-t${i}`"
          :key="f.name"
          type="button"
          role="tab"
          class="bless-code__tab"
          :aria-selected="i === active"
          :aria-controls="`${id}-p`"
          :tabindex="i === active ? 0 : -1"
          @click="active = i"
          @keydown="onTabKey"
        >
          {{ f.name }}
        </button>
      </div>
      <span v-else-if="filename" class="bless-code__name">{{ filename }}</span>
      <span class="bless-code__spacer"></span>
      <span v-if="lang" class="bless-code__lang">{{ lang }}</span>
      <button v-if="copy" type="button" class="bless-code__copy" @click="doCopy">
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </figcaption>
    <div
      :id="`${id}-p`"
      class="bless-code__scroll"
      tabindex="0"
      :role="files?.length ? 'tabpanel' : 'region'"
      :aria-labelledby="files?.length ? `${id}-t${active}` : undefined"
      :aria-label="files?.length ? undefined : file.name || label"
    >
      <slot name="code" :code="file.code" :lang="lang" :lines="rows">
        <pre class="bless-code__pre" :class="{ 'bless-code__pre--wrap': wrap }"><code><span
          v-for="r in rows"
          :key="r.n"
          class="bless-code__line"
          :class="{ 'bless-code__line--hl': r.hl }"
        ><span v-if="lineNumbers" class="bless-code__no" aria-hidden="true">{{ r.n }}</span>{{ r.text }}
</span></code></pre>
      </slot>
    </div>
    <span class="bless-code__live" aria-live="polite">{{
      copied ? "Copied to clipboard" : ""
    }}</span>
  </figure>
</template>

<style>
.bless-code {
  position: relative;
  margin: 0;
  min-width: 0;
  max-width: 100%;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
}
.bless-code__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: 0 var(--bless-space-2) 0 var(--bless-space-3);
  min-height: 36px;
  background: var(--bless-color-surface);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-code__spacer {
  flex: 1;
}
.bless-code__tabs {
  display: flex;
  align-self: stretch;
  gap: var(--bless-space-1);
  margin-inline-start: calc(var(--bless-space-3) * -1);
}
.bless-code__tab {
  padding: 0 var(--bless-space-3);
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  cursor: pointer;
}
.bless-code__tab[aria-selected="true"] {
  color: var(--bless-color-text);
  border-bottom-color: var(--bless-color-accent);
}
.bless-code__tab:focus-visible,
.bless-code__copy:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-code__name {
  font-weight: 600;
}
.bless-code__lang {
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
  text-transform: uppercase;
}
.bless-code__copy {
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
.bless-code__scroll {
  overflow: auto;
}
.bless-code__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-code__pre {
  margin: 0;
  padding: var(--bless-space-3) 0;
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-sm);
  line-height: 1.6;
  tab-size: 2;
}
.bless-code__pre--wrap {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.bless-code__line {
  display: block;
  padding: 0 var(--bless-space-3);
}
.bless-code__line--hl {
  background: color-mix(in srgb, var(--bless-color-text) 8%, var(--bless-color-bg));
  box-shadow: inset 3px 0 0 var(--bless-color-text);
}
.bless-code__no {
  display: inline-block;
  min-width: 3ch;
  margin-inline-end: var(--bless-space-3);
  text-align: end;
  color: var(--bless-color-text-muted);
  user-select: none;
}
.bless-code__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
