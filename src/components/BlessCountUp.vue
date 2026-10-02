<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { reducedMotion } from "../composables/useMedia";

defineOptions({ name: "BlessCountUp" });

const props = withDefaults(
  defineProps<{
    value: number;
    /** milliseconds to travel from the shown number to `value` */
    duration?: number;
    locale?: string;
    /** `Intl.NumberFormat` options: `{ style: "currency", currency: "IDR" }` */
    options?: Intl.NumberFormatOptions;
    /** start at 0 and count up when first shown; off shows `value` straight away */
    appear?: boolean;
    /** roll each digit in its own column, like an odometer */
    odometer?: boolean;
  }>(),
  { duration: 800, appear: true },
);

const shown = ref(props.appear ? 0 : props.value);
const fmt = computed(() => new Intl.NumberFormat(props.locale, props.options));
/** decimals the number is shown with, so a whole-number target never flickers through fractions */
const digits = computed(() => {
  const o = props.options ?? {};
  const explicit =
    o.style === "currency" ||
    o.style === "percent" ||
    o.minimumFractionDigits != null ||
    o.maximumFractionDigits != null;
  return explicit || !Number.isInteger(props.value)
    ? (fmt.value.resolvedOptions().maximumFractionDigits ?? 0)
    : 0;
});
const text = (n: number) => fmt.value.format(n);
const round = (n: number) => Math.round(n * 10 ** digits.value) / 10 ** digits.value;
const final = computed(() => text(props.value));
const parts = computed(() => Array.from(text(shown.value)));

let raf = 0;
function run(to: number) {
  cancelAnimationFrame(raf);
  const from = shown.value;
  if (reducedMotion() || !props.duration || from === to) {
    shown.value = to;
    return;
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const k = Math.min(1, (now - t0) / props.duration);
    shown.value = round(from + (to - from) * (1 - (1 - k) ** 3)); // ease-out cubic
    if (k < 1) raf = requestAnimationFrame(tick);
    else shown.value = to;
  };
  raf = requestAnimationFrame(tick);
}
onMounted(() => props.appear && run(props.value));
watch(
  () => props.value,
  (v) => run(v),
);
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <span class="bless-countup" :class="{ 'bless-countup--odometer': odometer }">
    <span class="bless-countup__visual" aria-hidden="true">
      <template v-if="odometer">
        <template v-for="(c, i) in parts" :key="i">
          <span v-if="/\d/.test(c)" class="bless-countup__digit">
            <span class="bless-countup__reel" :style="{ '--bless-digit': c }">
              <i v-for="d in 10" :key="d">{{ d - 1 }}</i>
            </span>
          </span>
          <span v-else>{{ c }}</span>
        </template>
      </template>
      <template v-else>{{ text(shown) }}</template>
    </span>
    <span class="bless-countup__final">{{ final }}</span>
  </span>
</template>

<style>
.bless-countup {
  position: relative;
  font-variant-numeric: tabular-nums;
}
.bless-countup--odometer .bless-countup__visual {
  display: inline-flex;
}
.bless-countup__digit {
  display: inline-block;
  height: 1lh;
  overflow: hidden;
}
.bless-countup__reel {
  display: flex;
  flex-direction: column;
  translate: 0 calc(var(--bless-digit) * -1lh);
  transition: translate var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-countup__reel i {
  font-style: normal;
  height: 1lh;
}
.bless-countup__final {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (prefers-reduced-motion: reduce) {
  .bless-countup__reel {
    transition: none;
  }
}
</style>
