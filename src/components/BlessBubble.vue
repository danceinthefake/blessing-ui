<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "BlessBubble" });

export interface BlessReaction {
  emoji: string;
  count?: number;
  /** current user reacted */
  active?: boolean;
}

withDefaults(
  defineProps<{
    variant?: "surface" | "accent" | "outline" | "plain";
    align?: "start" | "end";
    /** clamp to n lines with a show-more toggle */
    collapsible?: boolean;
    lines?: number;
    reactions?: BlessReaction[];
    moreLabel?: string;
    lessLabel?: string;
  }>(),
  { variant: "surface", align: "start", lines: 4, moreLabel: "Show more", lessLabel: "Show less" },
);
const emit = defineEmits<{ react: [reaction: BlessReaction] }>();
const expanded = ref(false);
</script>

<template>
  <div
    class="bless-bubble"
    :class="[
      `bless-bubble--${variant}`,
      `bless-bubble--${align}`,
      { 'bless-bubble--clamped': collapsible && !expanded },
    ]"
    :style="collapsible ? { '--_lines': lines } : undefined"
  >
    <div class="bless-bubble__content"><slot /></div>
    <button
      v-if="collapsible"
      type="button"
      class="bless-bubble__more"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? lessLabel : moreLabel }}
    </button>
    <div v-if="reactions?.length" class="bless-bubble__reactions">
      <button
        v-for="r in reactions"
        :key="r.emoji"
        type="button"
        class="bless-bubble__reaction"
        :aria-pressed="!!r.active"
        @click="emit('react', r)"
      >
        {{ r.emoji }}<span v-if="r.count">{{ r.count }}</span>
      </button>
    </div>
  </div>
</template>

<style>
/* flat block, one skewed corner cut (the "tail") on the sender side */
.bless-bubble {
  --_bg: var(--bless-color-surface);
  --_fg: var(--bless-color-text);
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  max-width: 100%;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--_bg);
  color: var(--_fg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
}
.bless-bubble--end {
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
}
.bless-bubble--accent {
  --_bg: var(--bless-color-accent);
  --_fg: var(--bless-color-on-accent);
}
.bless-bubble--outline {
  --_bg: transparent;
  box-shadow: inset 0 0 0 var(--bless-border-width) var(--bless-color-border);
}
.bless-bubble--plain {
  --_bg: transparent;
  padding: 0;
  clip-path: none;
}
.bless-bubble + .bless-bubble {
  margin-top: 2px;
}
.bless-bubble__content > :first-child {
  margin-top: 0;
}
.bless-bubble__content > :last-child {
  margin-bottom: 0;
}
.bless-bubble--clamped .bless-bubble__content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--_lines);
  line-clamp: var(--_lines);
  overflow: hidden;
}
.bless-bubble__more {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0.8;
}
.bless-bubble__more:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-bubble__reactions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-bubble__reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px var(--bless-space-2);
  border: var(--bless-border-width) solid transparent;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-bubble__reaction > * {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-bubble__reaction[aria-pressed="true"] {
  border-color: var(--bless-color-accent);
  color: var(--bless-color-accent);
}
.bless-bubble__reaction:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
