<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessSceneButtons" });
const pack = useLabelPack("BlessSceneButtons");

export interface BlessScene {
  id: string;
  name: string;
  /** an emoji or a short text */
  icon?: string;
  /** what it does, for example "3 lights off, door locked" */
  description?: string;
}

const props = defineProps<{
  scenes: BlessScene[];
  labels?: Partial<{ title: string; started: (name: string) => string }>;
}>();
/** the id of the scene that runs now */
const active = defineModel<string>();
const emit = defineEmits<{ run: [id: string] }>();

const text = computed(() => ({
  title: "Scenes",
  started: (n: string) => `${n} is on.`,
  ...pack(),
  ...props.labels,
}));
const said = ref("");
function run(s: BlessScene) {
  active.value = s.id;
  said.value = text.value.started(s.name);
  emit("run", s.id);
}
</script>

<template>
  <div class="bless-scenes" role="group" :aria-label="text.title">
    <button
      v-for="s in scenes"
      :key="s.id"
      type="button"
      class="bless-scenes__scene"
      :aria-pressed="active === s.id"
      @click="run(s)"
    >
      <span v-if="s.icon" class="bless-scenes__icon" aria-hidden="true">{{ s.icon }}</span>
      <span class="bless-scenes__name">{{ s.name }}</span>
      <span v-if="s.description" class="bless-scenes__desc">{{ s.description }}</span>
    </button>
    <span class="bless-sr" role="status">{{ said }}</span>
  </div>
</template>

<style>
.bless-scenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-scenes__scene {
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 2px;
  min-block-size: 5.5rem;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-scenes__scene:hover {
  border-color: var(--bless-color-text);
}
/* the running scene is filled with the text color: a strong change, not a tint */
.bless-scenes__scene[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-scenes__scene:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-scenes__icon {
  font-size: var(--bless-text-lg);
}
.bless-scenes__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-scenes__desc {
  font-size: var(--bless-text-xs);
  opacity: 0.85;
}
</style>
