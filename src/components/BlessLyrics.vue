<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessLyrics" });
const pack = useLabelPack("BlessLyrics");

export interface BlessLyricLine {
  /** when the line starts, in seconds */
  time: number;
  text: string;
}

const props = defineProps<{
  lines: BlessLyricLine[];
  /** the place of the song now, in seconds */
  position: number;
  labels?: Partial<{ title: string; seek: (time: string) => string }>;
}>();
const emit = defineEmits<{ seek: [time: number] }>();

const text = computed(() => ({
  title: "Lyrics",
  seek: (t: string) => `Play from ${t}`,
  ...pack(),
  ...props.labels,
}));
// the last line that has started
const current = computed(() => {
  let at = -1;
  props.lines.forEach((l, i) => {
    if (l.time <= props.position) at = i;
  });
  return at;
});
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const box = ref<HTMLElement>();
// keep the current line in the middle of the box; only the box scrolls, not the page
watch(current, () =>
  nextTick(() => {
    const el = box.value?.querySelector<HTMLElement>(".is-current");
    if (!box.value || !el) return;
    const top = el.offsetTop - box.value.clientHeight / 2 + el.clientHeight / 2;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.value.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  }),
);
</script>

<template>
  <div ref="box" class="bless-lyrics" role="region" :aria-label="text.title" tabindex="0">
    <ol class="bless-lyrics__list" role="list">
      <li v-for="(l, i) in lines" :key="i">
        <button
          type="button"
          class="bless-lyrics__line"
          :class="{ 'is-current': i === current, 'is-past': i < current }"
          :aria-current="i === current ? 'true' : undefined"
          :title="text.seek(clock(l.time))"
          @click="emit('seek', l.time)"
        >
          {{ l.text }}
        </button>
      </li>
    </ol>
  </div>
</template>

<style>
.bless-lyrics {
  position: relative;
  max-block-size: 20rem;
  overflow-y: auto;
  padding: var(--bless-space-6) var(--bless-space-3);
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-lyrics:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lyrics__list {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-lyrics__line {
  inline-size: 100%;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.3;
  text-align: start;
  cursor: pointer;
  opacity: 0.7;
}
/* the line that plays is bigger, full strength, and has a bar; a past line stays readable */
.bless-lyrics__line.is-current {
  opacity: 1;
  font-size: var(--bless-text-xl);
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.bless-lyrics__line:hover {
  opacity: 1;
}
.bless-lyrics__line:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-lyrics {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
