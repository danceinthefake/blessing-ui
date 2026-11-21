<template>
  <component
    :is="block ? 'div' : 'span'"
    ref="root"
    class="bless-spoiler"
    :class="{ 'is-shown': shown, 'is-block': block }"
    :tabindex="shown ? -1 : undefined"
  >
    <span
      class="bless-spoiler__text"
      :aria-hidden="!shown || undefined"
      :inert="!shown || undefined"
    >
      <slot />
    </span>
    <button
      v-if="!shown"
      type="button"
      class="bless-spoiler__cover"
      :aria-label="hint ? text.showAbout(hint) : text.show"
      @click="reveal"
    >
      <span v-if="block" class="bless-spoiler__badge" aria-hidden="true">{{
        hint ? text.showAbout(hint) : text.show
      }}</span>
    </button>
  </component>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSpoiler" });
const pack = useLabelPack("BlessSpoiler");

const props = defineProps<{
  /** what the hidden text is about, for example "the end of episode 41" */
  hint?: string;
  /** a block of text in place of a few words in a line */
  block?: boolean;
  labels?: Partial<{ show: string; showAbout: (hint: string) => string }>;
}>();
/** the text shows */
const shown = defineModel<boolean>("shown", { default: false });

const text = computed(() => ({
  show: "Show the spoiler",
  showAbout: (h: string) => `Show the spoiler: ${h}`,
  ...pack(),
  ...props.labels,
}));
const root = ref<HTMLElement>();
function reveal() {
  shown.value = true;
  // the button goes away: put the focus on the text, so the reader does not lose the place
  nextTick(() => root.value?.focus());
}
</script>

<style>
.bless-spoiler {
  position: relative;
  display: inline;
  border-radius: 0;
}
.bless-spoiler.is-block {
  display: block;
}
.bless-spoiler:focus {
  outline: none;
}
.bless-spoiler__text {
  transition: filter var(--bless-duration-slow) var(--bless-ease-out);
}
/* hidden: the words are a blur on a gray band, and cannot be selected */
.bless-spoiler:not(.is-shown) .bless-spoiler__text {
  background: var(--bless-color-surface-2);
  filter: blur(5px);
  user-select: none;
}
.bless-spoiler__cover {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  cursor: pointer;
}
.bless-spoiler__cover:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-spoiler__badge {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
@media (prefers-reduced-motion: reduce) {
  .bless-spoiler__text {
    transition: none;
  }
}
</style>
