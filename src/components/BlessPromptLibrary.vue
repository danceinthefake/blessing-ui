<script lang="ts">
export interface BlessSavedPrompt {
  id: string;
  title: string;
  /** the prompt; write a field as {{name}} */
  text: string;
  tags?: string[];
}

/** The names of the fields in a prompt, written as {{name}}, in order and once each. */
export function promptFields(text: string): string[] {
  return [...new Set([...text.matchAll(/\{\{\s*([\w ]+?)\s*\}\}/g)].map((m) => m[1]!))];
}
/** The prompt with its fields filled; an empty field keeps its {{name}}. */
export function fillPrompt(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*([\w ]+?)\s*\}\}/g, (all, k: string) => values[k]?.trim() || all);
}
</script>

<script setup lang="ts">
import { computed, reactive, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessPromptLibrary" });
const pack = useLabelPack("BlessPromptLibrary");

const props = defineProps<{
  prompts: BlessSavedPrompt[];
  labels?: Partial<{
    search: string;
    all: string;
    tags: string;
    list: string;
    none: string;
    preview: string;
    use: string;
    pick: string;
  }>;
}>();
const emit = defineEmits<{ use: [text: string, prompt: BlessSavedPrompt] }>();

const text = computed(() => ({
  search: "Search the prompts",
  all: "All",
  tags: "Tags",
  list: "Prompts",
  none: "No prompts match.",
  preview: "Preview",
  use: "Use this prompt",
  pick: "Pick a prompt on the left.",
  ...pack(),
  ...props.labels,
}));
const id = useId();
const query = ref("");
const tag = ref("");
const chosen = ref<string>();
const values = reactive<Record<string, string>>({});
const tags = computed(() => [...new Set(props.prompts.flatMap((p) => p.tags ?? []))].sort());
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.prompts.filter(
    (p) =>
      (!tag.value || p.tags?.includes(tag.value)) &&
      (!q || `${p.title} ${p.text} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(q)),
  );
});
const prompt = computed(() => props.prompts.find((p) => p.id === chosen.value));
const fields = computed(() => (prompt.value ? promptFields(prompt.value.text) : []));
watch(chosen, () => {
  for (const k of Object.keys(values)) delete values[k];
});
const filled = computed(() => (prompt.value ? fillPrompt(prompt.value.text, values) : ""));
</script>

<template>
  <div class="bless-prompts">
    <div class="bless-prompts__side">
      <input v-model="query" type="search" :aria-label="text.search" :placeholder="text.search" />
      <div v-if="tags.length" class="bless-prompts__tags" role="group" :aria-label="text.tags">
        <button type="button" :aria-pressed="!tag" @click="tag = ''">{{ text.all }}</button>
        <button
          v-for="t in tags"
          :key="t"
          type="button"
          :aria-pressed="tag === t"
          @click="tag = tag === t ? '' : t"
        >
          {{ t }}
        </button>
      </div>
      <ul v-if="shown.length" class="bless-prompts__list" role="list" :aria-label="text.list">
        <li v-for="p in shown" :key="p.id">
          <button type="button" :aria-pressed="chosen === p.id" @click="chosen = p.id">
            <span class="bless-prompts__title">{{ p.title }}</span>
            <span class="bless-prompts__snip">{{ p.text }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="bless-prompts__none" role="status">{{ text.none }}</p>
    </div>
    <section class="bless-prompts__detail" :aria-label="prompt?.title ?? text.preview">
      <template v-if="prompt">
        <div class="bless-prompts__head">{{ prompt.title }}</div>
        <div v-for="f in fields" :key="f" class="bless-prompts__field">
          <label :for="`${id}-${f}`">{{ f }}</label>
          <input :id="`${id}-${f}`" v-model="values[f]" />
        </div>
        <div class="bless-prompts__label">{{ text.preview }}</div>
        <div class="bless-prompts__preview">{{ filled }}</div>
        <div>
          <button type="button" class="bless-prompts__use" @click="emit('use', filled, prompt)">
            {{ text.use }}
          </button>
        </div>
      </template>
      <p v-else class="bless-prompts__none">{{ text.pick }}</p>
    </section>
  </div>
</template>

<style>
.bless-prompts {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(0, 1.4fr);
  gap: var(--bless-space-4);
  align-items: start;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
@media (max-width: 40rem) {
  .bless-prompts {
    grid-template-columns: 1fr;
  }
}
.bless-prompts__side,
.bless-prompts__detail {
  display: grid;
  gap: var(--bless-space-2);
  min-inline-size: 0;
}
.bless-prompts input {
  min-block-size: 2.5rem;
  box-sizing: border-box;
  inline-size: 100%;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-prompts button {
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-prompts :is(input, button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-prompts__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-prompts__tags button {
  padding: 2px var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-text);
  background: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
}
.bless-prompts__tags button[aria-pressed="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-prompts__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-prompts__list li + li {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-prompts__list button {
  display: grid;
  gap: 2px;
  inline-size: 100%;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: var(--bless-color-bg);
  text-align: start;
}
.bless-prompts__list button[aria-pressed="true"] {
  background: var(--bless-color-surface-2);
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.bless-prompts__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-prompts__snip {
  overflow: hidden;
  font-size: var(--bless-text-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-prompts__none {
  margin: 0;
}
.bless-prompts__detail {
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
}
.bless-prompts__head {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-prompts__field {
  display: grid;
  gap: 2px;
}
.bless-prompts__field label,
.bless-prompts__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-prompts__preview {
  padding: var(--bless-space-2);
  background: var(--bless-color-surface-2);
  line-height: 1.6;
  white-space: pre-wrap;
}
.bless-prompts__use {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-4);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-prompts {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
