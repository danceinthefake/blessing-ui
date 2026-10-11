<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { downsample, loadPeaks } from "./waveform";

defineOptions({ name: "BlessWaveform" });

const props = withDefaults(
  defineProps<{
    /** loudness per slice, 0 to 1. Compute them on your server for a long file. */
    peaks?: number[];
    /** an audio URL to decode in the browser when you have no `peaks` */
    src?: string;
    /** bars drawn */
    bars?: number;
    height?: number;
    /** names the seek control */
    label?: string;
    /** text for the position, for example `(p) => "1:05"`. Default: a percent. */
    valueText?: (position: number) => string;
    disabled?: boolean;
  }>(),
  { bars: 64, height: 48, label: "Seek" },
);
/** the position from 0 (start) to 1 (end) */
const position = defineModel<number>({ default: 0 });
const emit = defineEmits<{ seek: [position: number]; error: [error: unknown] }>();

const decoded = ref<number[]>([]);
// decode after mount only: the server has no audio, and the bars fill in once the file is read
watch(
  () => [props.src, props.peaks, props.bars] as const,
  async ([src, peaks, bars]) => {
    if (peaks || !src || typeof window === "undefined") return void (decoded.value = []);
    try {
      decoded.value = await loadPeaks(src, bars);
    } catch (e) {
      decoded.value = [];
      emit("error", e);
    }
  },
  { immediate: true },
);
const shown = computed(() => downsample(props.peaks ?? decoded.value, props.bars));
const text = computed(() =>
  props.valueText ? props.valueText(position.value) : `${Math.round(position.value * 100)}%`,
);
function onInput(e: Event) {
  position.value = Number((e.target as HTMLInputElement).value);
  emit("seek", position.value);
}
</script>

<template>
  <div
    class="bless-wave"
    :class="{ 'bless-wave--disabled': disabled }"
    :style="{ blockSize: `${height}px` }"
  >
    <div class="bless-wave__bars" aria-hidden="true">
      <span
        v-for="(p, i) in shown"
        :key="i"
        class="bless-wave__bar"
        :class="{ 'bless-wave__bar--played': (i + 0.5) / shown.length <= position }"
        :style="{ blockSize: `${Math.max(4, Math.round(p * 1000) / 10)}%` }"
      />
    </div>
    <!-- a native range lies over the bars, so the pointer and the keyboard both seek -->
    <input
      class="bless-wave__range"
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="position"
      :disabled="disabled"
      :aria-label="label"
      :aria-valuetext="text"
      @input="onInput"
    />
  </div>
</template>

<style>
.bless-wave {
  position: relative;
  inline-size: 100%;
  font-family: var(--bless-font-sans);
}
.bless-wave__bars {
  display: flex;
  align-items: center;
  gap: 2px;
  block-size: 100%;
}
.bless-wave__bar {
  flex: 1;
  min-inline-size: 1px;
  background: var(--bless-color-border);
}
/* color means chosen: the played part takes the accent, the rest stays gray */
.bless-wave__bar--played {
  background: var(--bless-color-accent);
}
.bless-wave__range {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.bless-wave:has(.bless-wave__range:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-wave--disabled {
  opacity: 0.4;
}
.bless-wave--disabled .bless-wave__range {
  cursor: not-allowed;
}
</style>
