<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessMarginComments" });
const pack = useLabelPack("BlessMarginComments");

export interface BlessDocBlock {
  id: string;
  text: string;
}
export interface BlessMarginComment {
  id: string;
  /** the id of the block that the comment is about */
  block: string;
  author: string;
  text: string;
  time?: string;
}

const props = defineProps<{
  blocks: BlessDocBlock[];
  comments?: BlessMarginComment[];
  labels?: Partial<{
    comment: string;
    send: string;
    cancel: string;
    placeholder: string;
    on: (index: number) => string;
  }>;
}>();
const emit = defineEmits<{ add: [block: string, text: string] }>();

const text = computed(() => ({
  comment: "Comment",
  send: "Send",
  cancel: "Cancel",
  placeholder: "Write a comment",
  on: (i: number) => `Comments on part ${i}`,
  ...pack(),
  ...props.labels,
}));
const byBlock = computed(() => {
  const m = new Map<string, BlessMarginComment[]>();
  for (const c of props.comments ?? []) m.set(c.block, [...(m.get(c.block) ?? []), c]);
  return m;
});
const open = ref<string>();
const draft = ref("");
const area = ref<HTMLTextAreaElement[]>();
async function start(id: string) {
  open.value = id;
  draft.value = "";
  await nextTick();
  area.value?.[0]?.focus();
}
function send(id: string) {
  const t = draft.value.trim();
  if (!t) return;
  emit("add", id, t);
  open.value = undefined;
}
</script>

<template>
  <div class="bless-margin">
    <div
      v-for="(b, i) in blocks"
      :key="b.id"
      class="bless-margin__row"
      :class="{ 'has-notes': byBlock.get(b.id)?.length || open === b.id }"
    >
      <div class="bless-margin__block">{{ b.text }}</div>
      <aside class="bless-margin__side" :aria-label="text.on(i + 1)">
        <div v-for="c in byBlock.get(b.id)" :key="c.id" class="bless-margin__note">
          <div class="bless-margin__who">
            <strong>{{ c.author }}</strong>
            <span v-if="c.time" class="bless-margin__time">{{ c.time }}</span>
          </div>
          <div>{{ c.text }}</div>
        </div>
        <form v-if="open === b.id" class="bless-margin__form" @submit.prevent="send(b.id)">
          <textarea
            ref="area"
            v-model="draft"
            rows="3"
            :aria-label="text.placeholder"
            :placeholder="text.placeholder"
            @keydown.esc="open = undefined"
          />
          <div class="bless-margin__actions">
            <button type="submit" class="is-main">{{ text.send }}</button>
            <button type="button" @click="open = undefined">{{ text.cancel }}</button>
          </div>
        </form>
        <button v-else type="button" class="bless-margin__add" @click="start(b.id)">
          + {{ text.comment }}
        </button>
      </aside>
    </div>
  </div>
</template>

<style>
.bless-margin {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-margin__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(11rem, 16rem);
  gap: var(--bless-space-4);
  align-items: start;
}
@media (max-width: 40rem) {
  .bless-margin__row {
    grid-template-columns: 1fr;
    gap: var(--bless-space-2);
  }
}
.bless-margin__block {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-inline-start: 3px solid transparent;
  line-height: 1.6;
}
.has-notes > .bless-margin__block {
  border-inline-start-color: var(--bless-color-accent);
  background: var(--bless-color-surface-2);
}
.bless-margin__side {
  display: grid;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-sm);
}
.bless-margin__note {
  display: grid;
  gap: 2px;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-margin__who {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-margin__time {
  color: var(--bless-color-text-muted);
}
.bless-margin__form {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-margin__form textarea {
  inline-size: 100%;
  box-sizing: border-box;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  resize: vertical;
}
.bless-margin__actions {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-margin__side button {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-margin__side button.is-main {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-margin__side .bless-margin__add {
  justify-self: start;
  border-style: dashed;
}
.bless-margin__side button:focus-visible,
.bless-margin__form textarea:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
