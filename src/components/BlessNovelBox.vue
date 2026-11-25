<template>
  <figure
    ref="el"
    class="bless-novel"
    :class="{ 'bless-novel--done': done, 'bless-novel--portrait': hasPortrait }"
  >
    <div v-if="hasPortrait" class="bless-novel__portrait" aria-hidden="true">
      <slot name="portrait">
        <img v-if="avatar" :src="avatar" alt="" class="bless-novel__avatar" />
        <svg v-else-if="emblem" class="bless-novel__emblem" viewBox="0 0 32 32" width="24" height="24">
          <g transform="rotate(-10 16 16)">
            <ellipse cx="16" cy="8" rx="4.2" ry="6.8" fill="#cc466a" />
            <ellipse cx="16" cy="8" rx="4.2" ry="6.8" fill="#e6a817" transform="rotate(72 16 16)" />
            <ellipse cx="16" cy="8" rx="4.2" ry="6.8" fill="#2f75ad" transform="rotate(144 16 16)" />
            <ellipse cx="16" cy="8" rx="4.2" ry="6.8" fill="#8f5c8a" transform="rotate(216 16 16)" />
            <ellipse cx="16" cy="8" rx="4.2" ry="6.8" fill="#687b00" transform="rotate(288 16 16)" />
          </g>
        </svg>
      </slot>
    </div>
    <figcaption v-if="name || $slots.name" class="bless-novel__name">
      <span><slot name="name">{{ name }}</slot></span>
    </figcaption>
    <p class="bless-novel__text">
      <template v-if="text !== undefined">
        <span aria-hidden="true">{{ shown }}</span>
        <span class="bless-sr">{{ text }}</span>
      </template>
      <slot v-else />
    </p>
    <button
      v-if="interactive && more"
      type="button"
      class="bless-novel__more bless-novel__more--btn"
      :aria-label="done ? words.next : words.skip"
      @click="onMore"
    >
      <BlessIcon name="chevron-down" size="xs" />
    </button>
    <span v-else-if="more" class="bless-novel__more" aria-hidden="true">
      <BlessIcon name="chevron-down" size="xs" />
    </span>
  </figure>
</template>

<script setup lang="ts">
// The text box of a visual novel: frosted glass frame, optional portrait medallion (or neutral
// flower emblem), leaning −10° speaker nameplate, and a serif line that types out letter by letter.
// Screen readers read the full line at once. With calm or reduced motion (or on the server), the
// whole line shows at once. When `interactive`, clicking the prompt finishes a running line or
// asks for the next one.
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { reducedMotion } from "../composables/useMedia";
import BlessIcon from "./BlessIcon.vue";
import "./sr.css";

defineOptions({ name: "BlessNovelBox" });

const props = withDefaults(
  defineProps<{
    /** speaker name on the floating plate; omit for narration without a speaker */
    name?: string;
    /** optional circular speaker portrait URL */
    avatar?: string;
    /** show the neutral 5-petal Blessing flower emblem in the portrait medallion */
    emblem?: boolean;
    /** the line to type out; omit to render static content in the default slot */
    text?: string;
    /** milliseconds per character; 0 shows the whole line at once */
    speed?: number;
    /** show the whole line immediately without typing */
    instant?: boolean;
    /** show the continue indicator when the line finishes */
    more?: boolean;
    /** turn the continue indicator into a button that skips typing or emits `next` */
    interactive?: boolean;
    labels?: Partial<{ next: string; skip: string }>;
  }>(),
  { speed: 30, more: true },
);

const emit = defineEmits<{ done: []; next: [] }>();
const slots = useSlots();
const hasPortrait = computed(() => Boolean(props.avatar || props.emblem || slots.portrait));
const pack = useLabelPack("BlessNovelBox");
const words = computed(() => ({
  next: "Next line",
  skip: "Show full line",
  ...pack(),
  ...props.labels,
}));

const el = ref<HTMLElement>();
// null = full line (server render, reduced/calm motion, or finished); number = letters revealed
const revealed = ref<number | null>(null);
const letters = computed(() => [...(props.text ?? "")]);
const shown = computed(() =>
  revealed.value === null ? (props.text ?? "") : letters.value.slice(0, revealed.value).join(""),
);
const done = computed(() => revealed.value === null);
let timer = 0;

function isCalm() {
  if (typeof window === "undefined") return true;
  if (reducedMotion()) return true;
  if (el.value?.closest('[data-motion="calm"]')) return true;
  return document.documentElement.dataset.motion === "calm";
}

function finish(notify = true) {
  if (timer) {
    clearInterval(timer);
    timer = 0;
  }
  const wasTyping = revealed.value !== null;
  revealed.value = null;
  if (wasTyping && notify) emit("done");
}

function play() {
  if (timer) {
    clearInterval(timer);
    timer = 0;
  }
  if (props.text === undefined) {
    revealed.value = null;
    return;
  }
  const total = letters.value.length;
  if (props.instant || props.speed <= 0 || isCalm() || total === 0) {
    revealed.value = null;
    emit("done");
    return;
  }
  revealed.value = 0;
  timer = window.setInterval(() => {
    const next = (revealed.value ?? 0) + 1;
    if (next >= total) finish();
    else revealed.value = next;
  }, props.speed);
}

function onMore() {
  if (!done.value) finish();
  else emit("next");
}

onMounted(play);
watch(
  () => [props.text, props.instant, props.speed] as const,
  () => {
    if (typeof window !== "undefined") play();
  },
);
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style>
.bless-novel {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  margin: var(--bless-space-3) 0 0;
  padding: var(--bless-space-4) var(--bless-space-6) var(--bless-space-4);
  border-radius: var(--bless-radius);
  border: var(--bless-border-width) solid
    color-mix(in srgb, var(--bless-color-accent) 26%, var(--bless-color-border));
  background: var(--bless-color-surface-glass);
  backdrop-filter: blur(14px);
  color: var(--bless-color-text);
  box-shadow:
    0 10px 26px -12px color-mix(in srgb, var(--bless-color-accent) 24%, transparent),
    var(--bless-shadow-sm);
  font-family: var(--bless-font-sans);
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap);
}
.bless-novel--portrait {
  padding-inline-start: var(--bless-space-4);
}
.bless-novel__portrait {
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--bless-radius-pill);
  overflow: hidden;
  background: var(--bless-color-surface);
  border: 2px solid color-mix(in srgb, var(--bless-color-accent) 62%, var(--bless-color-surface));
  box-shadow: 0 4px 12px -3px color-mix(in srgb, var(--bless-color-accent) 42%, transparent);
}
.bless-novel__avatar {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 25%;
}
.bless-novel__emblem {
  display: block;
}
.bless-novel__name {
  position: absolute;
  inset-block-start: -12px;
  inset-inline-start: var(--bless-space-4);
  padding: 3px var(--bless-space-3);
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-tight);
  box-shadow: 0 4px 10px -4px color-mix(in srgb, var(--bless-color-accent) 55%, transparent);
  transform: skewX(var(--bless-lean));
}
.bless-novel--portrait .bless-novel__name {
  inset-inline-start: 68px;
}
.bless-novel__name > span {
  display: inline-block;
  transform: skewX(calc(-1 * var(--bless-lean)));
}
.bless-novel__text {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-inline-end: var(--bless-space-4);
  font-family: var(--bless-font-serif);
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-normal);
}
.bless-novel__more {
  position: absolute;
  inset-block-end: var(--bless-space-2);
  inset-inline-end: var(--bless-space-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--bless-color-accent-text);
  opacity: 0;
  transition: opacity var(--bless-duration-base) var(--bless-ease-out);
}
.bless-novel__more--btn {
  min-width: 28px;
  min-height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--bless-radius-pill);
  background: transparent;
  cursor: pointer;
  opacity: 1;
}
.bless-novel__more--btn:hover {
  background: var(--bless-color-surface-2);
}
.bless-novel__more--btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-novel--done .bless-novel__more {
  opacity: 1;
  animation: bless-novel-bob 1.2s ease-in-out infinite;
}
@keyframes bless-novel-bob {
  50% {
    translate: 0 3px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-novel--done .bless-novel__more {
    animation: none;
  }
}
[data-motion="calm"] .bless-novel--done .bless-novel__more {
  animation: none;
}
</style>
