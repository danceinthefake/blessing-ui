<template>
  <div class="bless-lesson">
    <video
      ref="video"
      class="bless-lesson__video"
      :src
      :poster
      :title
      controls
      preload="metadata"
      @timeupdate="now = ($event.target as HTMLVideoElement).currentTime"
    >
      <track v-if="captions" kind="captions" :src="captions" :srclang="captionsLang" default />
    </video>
    <section class="bless-lesson__notes" :aria-label="text.notes">
      <form class="bless-lesson__form" @submit.prevent="add">
        <textarea v-model="draft" rows="2" :aria-label="text.write" :placeholder="text.write" />
        <button type="submit">{{ text.add(clock(now)) }}</button>
      </form>
      <p v-if="!notes.length" class="bless-lesson__empty">{{ text.empty }}</p>
      <ol v-else class="bless-lesson__list" role="list">
        <li v-for="n in sorted" :key="n.id">
          <div class="bless-lesson__note">
            <button
              type="button"
              class="bless-lesson__time"
              :aria-label="text.go(clock(n.at))"
              @click="go(n.at)"
            >
              {{ clock(n.at) }}
            </button>
            <span class="bless-lesson__text">{{ n.text }}</span>
            <button
              type="button"
              class="bless-lesson__remove"
              :aria-label="text.remove(clock(n.at))"
              @click="remove(n.id)"
            >
              ✕
            </button>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessLessonVideo" });
const pack = useLabelPack("BlessLessonVideo");

export interface BlessVideoNote {
  id: string;
  /** the point in the video, in seconds */
  at: number;
  text: string;
}

const props = defineProps<{
  src: string;
  title: string;
  poster?: string;
  /** a WebVTT file with the captions */
  captions?: string;
  captionsLang?: string;
  labels?: Partial<{
    notes: string;
    write: string;
    add: (time: string) => string;
    go: (time: string) => string;
    remove: (time: string) => string;
    empty: string;
  }>;
}>();
const notes = defineModel<BlessVideoNote[]>({ default: () => [] });

const text = computed(() => ({
  notes: "Notes",
  write: "Write a note",
  add: (t: string) => `Add a note at ${t}`,
  go: (t: string) => `Go to ${t}`,
  remove: (t: string) => `Delete the note at ${t}`,
  empty: "No notes yet. Pause at a point and write what you want to keep.",
  ...pack(),
  ...props.labels,
}));
const video = ref<HTMLVideoElement>();
const now = ref(0);
const draft = ref("");
const clock = (s: number) => {
  s = Math.floor(s);
  const p = (n: number) => String(n).padStart(2, "0");
  return s >= 3600
    ? `${Math.floor(s / 3600)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`
    : `${Math.floor(s / 60)}:${p(s % 60)}`;
};
const sorted = computed(() => [...notes.value].sort((a, b) => a.at - b.at));
function add() {
  const t = draft.value.trim();
  if (!t) return;
  const at = Math.floor(now.value);
  notes.value = [...notes.value, { id: `${at}-${notes.value.length}`, at, text: t }];
  draft.value = "";
}
function go(at: number) {
  if (!video.value) return;
  video.value.currentTime = at;
  video.value.focus();
}
const remove = (id: string) => (notes.value = notes.value.filter((n) => n.id !== id));
</script>

<style>
.bless-lesson {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(14rem, 1fr);
  gap: var(--bless-space-4);
  align-items: start;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
@media (max-width: 48rem) {
  .bless-lesson {
    grid-template-columns: 1fr;
  }
}
.bless-lesson__video {
  display: block;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bless-color-media-bg);
}
.bless-lesson__video:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lesson__notes {
  display: grid;
  gap: var(--bless-space-3);
}
.bless-lesson__form {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-lesson__form textarea {
  inline-size: 100%;
  box-sizing: border-box;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  resize: vertical;
}
.bless-lesson button {
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-lesson__form button {
  justify-self: start;
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-variant-numeric: tabular-nums;
}
.bless-lesson :is(button, textarea):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lesson__empty {
  margin: 0;
  font-size: var(--bless-text-xs);
}
.bless-lesson__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-lesson__note {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-lesson__time {
  padding: 2px var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-text);
  background: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-lesson__text {
  white-space: pre-line;
}
.bless-lesson__remove {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
</style>
