<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessAchievements" });
const pack = useLabelPack("BlessAchievements");

export interface BlessAchievement {
  id: string;
  title: string;
  description?: string;
  /** an emoji or a short text for the badge */
  icon: string;
  /** when it was earned, as text; with it, the badge is earned */
  earned?: string;
  /** for a badge not yet earned: how far along, as [now, goal] */
  progress?: [number, number];
}

const props = defineProps<{
  achievements: BlessAchievement[];
  labels?: Partial<{
    title: string;
    earned: (when: string) => string;
    locked: string;
    count: (earned: number, total: number) => string;
  }>;
}>();

const text = computed(() => ({
  title: "Achievements",
  earned: (w: string) => `Earned ${w}`,
  locked: "Not earned yet",
  count: (e: number, t: number) => `${e} of ${t} earned`,
  ...pack(),
  ...props.labels,
}));
const earnedCount = computed(() => props.achievements.filter((a) => a.earned).length);
</script>

<template>
  <section class="bless-achieve" :aria-label="text.title">
    <p class="bless-achieve__count">{{ text.count(earnedCount, achievements.length) }}</p>
    <ul class="bless-achieve__grid">
      <li
        v-for="a in achievements"
        :key="a.id"
        class="bless-achieve__item"
        :class="{ 'is-earned': a.earned }"
      >
        <span class="bless-achieve__icon" aria-hidden="true">{{ a.icon }}</span>
        <strong class="bless-achieve__title">{{ a.title }}</strong>
        <span v-if="a.description" class="bless-achieve__desc">{{ a.description }}</span>
        <span class="bless-achieve__state">{{
          a.earned ? text.earned(a.earned) : text.locked
        }}</span>
        <progress
          v-if="!a.earned && a.progress"
          class="bless-achieve__bar"
          :value="a.progress[0]"
          :max="a.progress[1]"
          :aria-label="`${a.title}: ${a.progress[0]} / ${a.progress[1]}`"
        />
        <span v-if="!a.earned && a.progress" class="bless-achieve__num" aria-hidden="true">
          {{ a.progress[0] }} / {{ a.progress[1] }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-achieve {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-achieve__count {
  margin: 0 0 var(--bless-space-3);
  font-weight: var(--bless-font-weight-bold);
}
.bless-achieve__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-achieve__item {
  display: grid;
  justify-items: center;
  align-content: start;
  gap: var(--bless-space-1);
  padding: var(--bless-space-4) var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-border);
  text-align: center;
}
/* an earned badge has a solid edge, a shadow, and full color; a locked one is dashed and gray */
.bless-achieve__item.is-earned {
  border-style: solid;
  box-shadow: 4px 4px 0 var(--bless-color-border);
}
.bless-achieve__icon {
  display: grid;
  place-items: center;
  inline-size: 3.5rem;
  block-size: 3.5rem;
  margin-block-end: var(--bless-space-1);
  border-radius: 50%;
  background: var(--bless-color-surface-2);
  font-size: 1.75rem;
  filter: grayscale(1);
  opacity: 0.55;
}
.is-earned .bless-achieve__icon {
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
  filter: none;
  opacity: 1;
}
.bless-achieve__desc,
.bless-achieve__state,
.bless-achieve__num {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-achieve__bar {
  inline-size: 100%;
  block-size: 0.5rem;
  accent-color: var(--bless-color-accent);
}
</style>
