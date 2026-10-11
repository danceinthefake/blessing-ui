<script setup lang="ts">
import { computed } from "vue";
import { useLink } from "../composables/useLink";

export interface BlessCloudTag {
  label: string;
  /** how big it is: a count, a score */
  weight: number;
  href?: string;
}

defineOptions({ name: "BlessTagCloud" });

const props = withDefaults(
  defineProps<{
    tags: BlessCloudTag[];
    /** smallest and largest text size, in rem */
    min?: number;
    max?: number;
    /** `weight` puts the biggest first. `none` keeps your order. */
    sort?: "none" | "weight" | "label";
    /** names the list for screen readers */
    label?: string;
  }>(),
  { min: 0.75, max: 2, sort: "none", label: "Tags" },
);
const emit = defineEmits<{ select: [tag: BlessCloudTag] }>();
const link = useLink();

const list = computed(() => {
  const t = [...props.tags];
  if (props.sort === "weight") t.sort((a, b) => b.weight - a.weight);
  if (props.sort === "label") t.sort((a, b) => a.label.localeCompare(b.label));
  return t;
});
const size = (w: number) => {
  const ws = props.tags.map((t) => t.weight);
  const lo = Math.min(...ws);
  const span = Math.max(...ws) - lo;
  const f = span ? (w - lo) / span : 0.5;
  return `${(props.min + f * (props.max - props.min)).toFixed(3)}rem`;
};
</script>

<template>
  <ul class="bless-cloud" :aria-label="label">
    <li v-for="t in list" :key="t.label">
      <component
        :is="link(t.href, undefined, 'button').is"
        v-bind="link(t.href, undefined, 'button').attrs"
        class="bless-cloud__tag"
        :type="t.href ? undefined : 'button'"
        :style="{ fontSize: size(t.weight) }"
        @click="emit('select', t)"
        >{{ t.label }}</component
      >
    </li>
  </ul>
</template>

<style>
.bless-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
}
.bless-cloud__tag {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: inherit;
  font-weight: var(--bless-font-weight-light);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text);
  text-decoration: none;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-cloud__tag:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-cloud__tag:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
