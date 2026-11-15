<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessEmojiPicker from "./BlessEmojiPicker.vue";
import BlessPopover from "./BlessPopover.vue";
import type { BlessReaction } from "./BlessBubble.vue";
import type { BlessEmoji } from "./emoji";

defineOptions({ name: "BlessReactions" });
const pack = useLabelPack("BlessReactions");

const props = withDefaults(
  defineProps<{
    /** hide the button that opens the emoji picker */
    noAdd?: boolean;
    /** reactions a reader can add at most, counting their own; 0 has no limit */
    max?: number;
    labels?: Partial<{
      add: string;
      group: string;
      /** the name of a reaction button */ reaction: (emoji: string, count: number) => string;
    }>;
  }>(),
  { max: 0 },
);
/** the reactions, with the same type as in `BlessBubble`; a click changes `count` and `active` */
const reactions = defineModel<BlessReaction[]>({ default: () => [] });
const emit = defineEmits<{ toggle: [emoji: string, on: boolean] }>();

const text = computed(() => ({
  add: "Add a reaction",
  group: "Reactions",
  reaction: (e: string, n: number) => `${e} ${n} ${n === 1 ? "reaction" : "reactions"}`,
  ...pack(),
  ...props.labels,
}));
const full = computed(
  () => props.max > 0 && reactions.value.filter((r) => r.active).length >= props.max,
);

function toggle(emoji: string) {
  const list = reactions.value.map((r) => ({ ...r }));
  const r = list.find((x) => x.emoji === emoji);
  const on = !r?.active;
  if (on && full.value) return;
  if (r) {
    r.active = on;
    r.count = Math.max(0, (r.count ?? 0) + (on ? 1 : -1));
  } else list.push({ emoji, count: 1, active: true });
  reactions.value = list.filter((x) => (x.count ?? 0) > 0);
  emit("toggle", emoji, on);
}
const open = ref(false);
function pick(e: BlessEmoji) {
  open.value = false;
  if (!reactions.value.find((r) => r.emoji === e.char)?.active) toggle(e.char);
}
</script>

<template>
  <div class="bless-reactions" role="group" :aria-label="text.group">
    <button
      v-for="r in reactions"
      :key="r.emoji"
      type="button"
      class="bless-reactions__chip"
      :aria-pressed="!!r.active"
      :aria-label="text.reaction(r.emoji, r.count ?? 0)"
      :disabled="!r.active && full"
      @click="toggle(r.emoji)"
    >
      <span class="bless-reactions__emoji" aria-hidden="true">{{ r.emoji }}</span>
      <span class="bless-reactions__count" aria-hidden="true">{{ r.count ?? 0 }}</span>
    </button>
    <BlessPopover v-if="!noAdd" v-model:open="open" placement="bottom-start" :title="text.add">
      <template #trigger>
        <button
          type="button"
          class="bless-reactions__chip bless-reactions__add"
          :aria-label="text.add"
          :title="text.add"
          :aria-expanded="open"
          :disabled="full"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <circle cx="7" cy="8.5" r="5.5" />
            <path d="M5 7.5h.01M9 7.5h.01M5 10.5c1.2 1.2 2.8 1.2 4 0M13 1.5v4M11 3.5h4" />
          </svg>
        </button>
      </template>
      <BlessEmojiPicker @select="pick" />
    </BlessPopover>
  </div>
</template>

<style>
.bless-reactions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
}
.bless-reactions__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-block-size: 1.9rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-petal);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
  cursor: pointer;
}
.bless-reactions__chip:hover:not(:disabled) {
  background: var(--bless-color-surface-2);
}
.bless-reactions__chip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-reactions__chip:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
/* your own reaction has the accent border and a bold count, not only a tint */
.bless-reactions__chip[aria-pressed="true"] {
  border-color: var(--bless-color-accent);
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
}
.bless-reactions__chip[aria-pressed="true"] .bless-reactions__count {
  font-weight: var(--bless-font-weight-bold);
}
.bless-reactions__count {
  font-variant-numeric: tabular-nums;
}
.bless-reactions__add {
  color: var(--bless-color-text-muted);
}
.bless-reactions__add svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}
</style>
