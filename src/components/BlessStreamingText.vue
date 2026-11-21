<template>
  <div class="bless-streaming" :aria-busy="!done" aria-live="polite">
    <!-- aria-busy: screen readers wait for the full text, not each part -->
    <slot :text="shown">{{ shown }}</slot
    ><span v-if="!done" class="bless-streaming__caret" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

defineOptions({ name: "BlessStreamingText" });

const props = withDefaults(
  defineProps<{
    /** all the text that has come in so far; it grows as parts arrive */
    text: string;
    /** the last part came in: the caret goes away and screen readers read the text */
    done?: boolean;
    /** letters a second, to show the text at an even pace between parts; 0 shows each part at once */
    pace?: number;
  }>(),
  { pace: 0 },
);

const shown = ref(props.text);
let timer: ReturnType<typeof setInterval> | undefined;
const stop = () => {
  clearInterval(timer);
  timer = undefined;
};
const still = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

watch(
  () => [props.text, props.done, props.pace] as const,
  ([text, done, pace]) => {
    // new text that does not continue the old text, for example a new reply, starts over
    if (!text.startsWith(shown.value)) shown.value = "";
    if (!pace || done || still()) {
      stop();
      shown.value = text;
      return;
    }
    if (timer) return;
    const TICK = 30;
    timer = setInterval(() => {
      const want = props.text;
      // catch up faster when far behind, so the shown text never lags much
      const step = Math.max(
        1,
        Math.round((props.pace * TICK) / 1000),
        Math.ceil((want.length - shown.value.length) / 40),
      );
      shown.value = want.slice(0, shown.value.length + step);
      if (shown.value.length >= want.length) stop();
    }, TICK);
  },
);
onBeforeUnmount(stop);
</script>

<style>
.bless-streaming {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.bless-streaming__caret {
  display: inline-block;
  inline-size: 0.55em;
  block-size: 1em;
  margin-inline-start: 1px;
  vertical-align: text-bottom;
  background: var(--bless-color-accent);
  animation: bless-streaming-blink 1s steps(1) infinite;
}
@keyframes bless-streaming-blink {
  50% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-streaming__caret {
    animation: none;
  }
}
</style>
