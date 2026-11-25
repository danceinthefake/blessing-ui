<template>
  <section class="bless-queue" :aria-label="text.next">
    <div v-if="current" class="bless-queue__now">
      <span class="bless-queue__label">{{ text.now }}</span>
      <div class="bless-queue__track is-now">
        <span class="bless-queue__art"
          ><img v-if="current.image" :src="current.image" alt=""
        /></span>
        <span class="bless-queue__text">
          <span class="bless-queue__title">{{ current.title }}</span>
          <span v-if="current.artist" class="bless-queue__artist">{{ current.artist }}</span>
        </span>
        <span class="bless-queue__time">{{ clock(current.seconds) }}</span>
      </div>
    </div>
    <div class="bless-queue__head">
      <span class="bless-queue__label">{{ text.next }}</span>
      <span class="bless-queue__total">{{ text.total(queue.length, total) }}</span>
      <button v-if="queue.length" type="button" class="bless-queue__clear" @click="queue = []">
        {{ text.clear }}
      </button>
    </div>
    <p v-if="!queue.length" class="bless-queue__empty">{{ text.empty }}</p>
    <BlessSortable
      v-else
      v-model="queue"
      :row-key="(t: BlessQueueTrack) => t.id"
      :label="text.next"
    >
      <template #default="{ item }">
        <span class="bless-queue__track">
          <button
            type="button"
            class="bless-queue__art"
            :aria-label="text.play(item.title)"
            @click="emit('play', item.id)"
          >
            <img v-if="item.image" :src="item.image" alt="" />
            <span class="bless-queue__playmark" aria-hidden="true">▶</span>
          </button>
          <span class="bless-queue__text">
            <span class="bless-queue__title">{{ item.title }}</span>
            <span v-if="item.artist" class="bless-queue__artist">{{ item.artist }}</span>
          </span>
          <span class="bless-queue__time">{{ clock(item.seconds) }}</span>
          <button
            type="button"
            class="bless-queue__x"
            :aria-label="text.remove(item.title)"
            @click="remove(item.id)"
          >
            ✕
          </button>
        </span>
      </template>
    </BlessSortable>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSortable from "./BlessSortable.vue";

defineOptions({ name: "BlessPlayQueue" });
const pack = useLabelPack("BlessPlayQueue");

export interface BlessQueueTrack {
  id: string;
  title: string;
  artist?: string;
  /** the length in seconds */
  seconds: number;
  image?: string;
}

const props = defineProps<{
  /** the track that plays now, above the queue */
  current?: BlessQueueTrack;
  labels?: Partial<{
    now: string;
    next: string;
    empty: string;
    clear: string;
    play: (title: string) => string;
    remove: (title: string) => string;
    total: (count: number, time: string) => string;
  }>;
}>();
/** the tracks after the current one, in order */
const queue = defineModel<BlessQueueTrack[]>({ default: () => [] });
const emit = defineEmits<{ play: [id: string] }>();

const text = computed(() => ({
  now: "Now playing",
  next: "Next up",
  empty: "The queue is empty.",
  clear: "Clear the queue",
  play: (t: string) => `Play ${t}`,
  remove: (t: string) => `Remove ${t}`,
  total: (n: number, t: string) => `${n} ${n === 1 ? "track" : "tracks"}, ${t}`,
  ...pack(),
  ...props.labels,
}));
const clock = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};
const total = computed(() => clock(queue.value.reduce((n, t) => n + t.seconds, 0)));
const remove = (id: string) => (queue.value = queue.value.filter((t) => t.id !== id));
</script>

<style>
.bless-queue {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-queue__now {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-queue__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
}
.bless-queue__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bless-space-2);
}
.bless-queue__total {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-queue__clear {
  margin-inline-start: auto;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: underline;
  cursor: pointer;
}
.bless-queue__empty {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-queue__track {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--bless-space-3);
  min-inline-size: 0;
}
.bless-queue__track.is-now {
  padding: var(--bless-space-2);
  background: color-mix(in srgb, var(--bless-color-accent) 10%, var(--bless-color-bg));
}
/* gray text is too faint on the tint */
.is-now .bless-queue__artist {
  color: var(--bless-color-text);
}
.bless-queue__art {
  position: relative;
  flex: none;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: var(--bless-color-surface-2);
  color: inherit;
}
button.bless-queue__art {
  cursor: pointer;
}
.bless-queue__art img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-queue__playmark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 0.45);
  color: #fff;
  opacity: 0;
}
.bless-queue__art:hover .bless-queue__playmark,
.bless-queue__art:focus-visible .bless-queue__playmark {
  opacity: 1;
}
.bless-queue__text {
  display: grid;
  flex: 1;
  min-inline-size: 0;
}
.bless-queue__title,
.bless-queue__artist {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-queue__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-queue__artist {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-queue__time {
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-queue__x {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-queue__art:focus-visible,
.bless-queue__x:focus-visible,
.bless-queue__clear:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
