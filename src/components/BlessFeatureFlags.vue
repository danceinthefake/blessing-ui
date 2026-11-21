<template>
  <section class="bless-flags" :aria-label="text.title">
    <ul class="bless-stagger bless-flags__list">
      <li
        v-for="f in flags"
        :key="f.key"
        class="bless-flags__item"
        :class="{ 'is-on': enabled[f.key] }"
      >
        <div class="bless-flags__main">
          <BlessSwitch
            :model-value="!!enabled[f.key]"
            @update:model-value="(v: boolean) => set(f.key, v)"
          >
            <span class="bless-flags__name">{{ f.name }}</span>
          </BlessSwitch>
          <code class="bless-flags__key">{{ f.key }}</code>
          <span v-if="f.env" class="bless-flags__env">{{ f.env }}</span>
        </div>
        <p v-if="f.description" class="bless-flags__desc">{{ f.description }}</p>
        <div class="bless-flags__rollout">
          <span class="bless-flags__bar" aria-hidden="true">
            <span :style="{ inlineSize: `${enabled[f.key] ? (f.rollout ?? 100) : 0}%` }" />
          </span>
          <span class="bless-flags__share">
            {{
              !enabled[f.key]
                ? text.off
                : f.rollout === undefined || f.rollout >= 100
                  ? text.everyone
                  : text.rollout(f.rollout)
            }}
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSwitch from "./BlessSwitch.vue";

defineOptions({ name: "BlessFeatureFlags" });
const pack = useLabelPack("BlessFeatureFlags");

export interface BlessFlag {
  key: string;
  name: string;
  description?: string;
  /** the share of users that get it while it is on, 0 to 100; none means all */
  rollout?: number;
  /** for example "production" or "staging" */
  env?: string;
}

const props = defineProps<{
  flags: BlessFlag[];
  labels?: Partial<{
    title: string;
    rollout: (pct: number) => string;
    everyone: string;
    off: string;
  }>;
}>();
/** which flags are on, by key */
const enabled = defineModel<Record<string, boolean>>({ default: () => ({}) });
const emit = defineEmits<{ toggle: [key: string, on: boolean] }>();

const text = computed(() => ({
  title: "Feature flags",
  rollout: (p: number) => `${p}% of users`,
  everyone: "All users",
  off: "Off",
  ...pack(),
  ...props.labels,
}));
function set(key: string, on: boolean) {
  enabled.value = { ...enabled.value, [key]: on };
  emit("toggle", key, on);
}
</script>

<style>
.bless-flags {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-flags__list {
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
.bless-flags__item {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3);
}
.bless-flags__item + .bless-flags__item {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-flags__main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-flags__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-flags__key {
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-flags__env {
  margin-inline-start: auto;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-flags__desc {
  margin: 0;
  padding-inline-start: 2.75rem;
  color: var(--bless-color-text-muted);
}
.bless-flags__rollout {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding-inline-start: 2.75rem;
}
.bless-flags__bar {
  flex: 0 1 10rem;
  block-size: 4px;
  background: var(--bless-color-surface-2);
}
.bless-flags__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-flags__share {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-flags__item.is-on .bless-flags__share {
  color: var(--bless-color-text);
}
</style>
