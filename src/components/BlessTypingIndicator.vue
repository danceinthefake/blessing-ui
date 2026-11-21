<template>
  <div class="bless-typing" role="status">
    <!-- the status stays in the page while empty, so a screen reader hears the first line too -->
    <template v-if="line">
      <span class="bless-typing__dots" aria-hidden="true"><span /><span /><span /></span>
      <span>{{ line }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTypingIndicator" });
const pack = useLabelPack("BlessTypingIndicator");

const props = defineProps<{
  /** the people who type now; empty shows nothing */
  names: string[];
  labels?: Partial<{
    one: (name: string) => string;
    two: (a: string, b: string) => string;
    /** the first name and how many more */
    many: (name: string, more: number) => string;
  }>;
}>();

const text = computed(() => ({
  one: (n: string) => `${n} is typing…`,
  two: (a: string, b: string) => `${a} and ${b} are typing…`,
  many: (n: string, more: number) => `${n} and ${more} others are typing…`,
  ...pack(),
  ...props.labels,
}));
const line = computed(() => {
  const [a, b] = props.names;
  if (!a) return "";
  if (!b) return text.value.one(a);
  return props.names.length === 2
    ? text.value.two(a, b)
    : text.value.many(a, props.names.length - 1);
});
</script>

<style>
.bless-typing {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-block-size: 1.5em;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-typing__dots {
  display: inline-flex;
  gap: 3px;
}
.bless-typing__dots > span {
  inline-size: 5px;
  block-size: 5px;
  background: currentColor;
  animation: bless-typing 1.2s var(--bless-ease-in-out) infinite;
}
.bless-typing__dots > span:nth-child(2) {
  animation-delay: 0.15s;
}
.bless-typing__dots > span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes bless-typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-typing__dots > span {
    animation: none;
    opacity: 0.6;
  }
}
.bless-typing {
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap);
}
</style>
