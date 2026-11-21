<template>
  <section v-if="items.length" class="bless-resume" :aria-labelledby="`${uid}-title`">
    <h3 :id="`${uid}-title`" class="bless-resume__title">{{ text.title }}</h3>
    <ul class="bless-stagger bless-resume__list">
      <li v-for="i in items" :key="i.id" class="bless-resume__item">
        <a class="bless-resume__link" :href="i.href">
          <span class="bless-resume__image">
            <img :src="i.image" alt="" loading="lazy" />
            <span class="bless-resume__bar" aria-hidden="true">
              <span :style="{ inlineSize: `${Math.min(1, Math.max(0, i.progress)) * 100}%` }" />
            </span>
          </span>
          <span class="bless-resume__name">{{ i.title }}</span>{{ " "
          }}<span v-if="i.subtitle" class="bless-resume__sub">{{ i.subtitle }}</span>{{ " "
          }}<span class="bless-resume__left">{{ where(i) }}</span>
        </a>
        <button
          type="button"
          class="bless-resume__x"
          :aria-label="text.remove(i.title)"
          :title="text.remove(i.title)"
          @click="emit('remove', i.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessContinueWatching" });
const pack = useLabelPack("BlessContinueWatching");

export interface BlessResumeItem {
  id: string;
  title: string;
  /** for example "S1 · E4: Pick a microphone" */
  subtitle?: string;
  image: string;
  href: string;
  /** how much is done, 0 to 1 */
  progress: number;
  /** the length in minutes, for the time left */
  minutes?: number;
}

const props = defineProps<{
  items: BlessResumeItem[];
  labels?: Partial<{
    title: string;
    left: (minutes: number) => string;
    done: (percent: number) => string;
    remove: (title: string) => string;
  }>;
}>();
const emit = defineEmits<{ remove: [id: string] }>();

const text = computed(() => ({
  title: "Continue watching",
  left: (m: number) => `${m} min left`,
  done: (p: number) => `${p}% done`,
  remove: (t: string) => `Remove ${t} from this row`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const where = (i: BlessResumeItem) =>
  i.minutes
    ? text.value.left(Math.max(1, Math.round(i.minutes * (1 - i.progress))))
    : text.value.done(Math.round(i.progress * 100));
</script>

<style>
.bless-resume {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-resume__title {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-resume__list {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 15rem;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 3px 3px var(--bless-space-2);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  list-style: none;
}
.bless-resume__item {
  position: relative;
  scroll-snap-align: start;
}
.bless-resume__link {
  display: grid;
  gap: 2px;
  color: inherit;
  text-decoration: none;
}
.bless-resume__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-resume__image {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bless-color-surface-2);
}
.bless-resume__image img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-resume__bar {
  position: absolute;
  inset: auto 0 0;
  block-size: 4px;
  background: rgb(0 0 0 / 0.4);
}
.bless-resume__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-resume__name {
  margin-block-start: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
.bless-resume__sub,
.bless-resume__left {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-resume__x {
  position: absolute;
  inset-block-start: var(--bless-space-1);
  inset-inline-end: var(--bless-space-1);
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.7);
  color: #fff;
  cursor: pointer;
}
.bless-resume__x:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
