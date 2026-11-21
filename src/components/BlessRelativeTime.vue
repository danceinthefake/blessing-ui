<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { refreshEvery, relativeParts, toDate } from "./relativeTime";

defineOptions({ name: "BlessRelativeTime" });

const props = withDefaults(
  defineProps<{
    /** a Date, a timestamp in ms, or a date string */
    value: Date | number | string;
    /** language of the words, for example `de`. Default: English until you choose. */
    locale?: string;
    /** `auto` writes "yesterday" and "now". `always` writes "1 day ago". */
    numeric?: "auto" | "always";
    /** `long` ("2 hours ago"), `short` ("2 hr. ago"), or `narrow` */
    format?: "long" | "short" | "narrow";
    /** keep the text up to date while the page is open */
    live?: boolean;
    /** the moment to count from. Default: the time now. Pass one for a fixed result. */
    now?: Date | number;
  }>(),
  { numeric: "auto", format: "long", live: true },
);

const tick = ref(0);
const mounted = ref(false);
const date = computed(() => toDate(props.value));
const valid = computed(() => !Number.isNaN(date.value.getTime()));
const nowMs = computed(() => {
  void tick.value; // reading it makes the text update when the timer fires
  void props.value; // and a new value counts from the time now, not from the old "now"
  return props.now !== undefined ? +props.now : Date.now();
});
const seconds = computed(() => (date.value.getTime() - nowMs.value) / 1000);

// The server and the browser disagree on "now", and on the time zone. So before mount the text is
// a plain date in UTC, and the relative text appears after mount. A fixed `now` agrees on both sides, so it shows at once.
const absolute = computed(() =>
  valid.value
    ? new Intl.DateTimeFormat(props.locale ?? "en", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date.value)
    : "",
);
const relative = computed(() => {
  if (!valid.value) return "";
  const [n, unit] = relativeParts(seconds.value);
  return new Intl.RelativeTimeFormat(props.locale ?? "en", {
    numeric: props.numeric,
    style: props.format,
  }).format(n, unit);
});
// the full date and time, in the time zone of the reader, for the tooltip
const full = computed(() =>
  valid.value
    ? new Intl.DateTimeFormat(props.locale ?? "en", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date.value)
    : "",
);

let timer: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(timer);
  if (!props.live || props.now !== undefined || !valid.value) return;
  timer = setTimeout(() => {
    tick.value++;
    schedule();
  }, refreshEvery(seconds.value));
}
onMounted(() => {
  mounted.value = true;
  schedule();
});
watch(() => [props.value, props.live, props.now], schedule);
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <time
    v-if="valid"
    class="bless-reltime"
    :datetime="date.toISOString()"
    :title="mounted ? full : undefined"
    >{{ mounted || now !== undefined ? relative : absolute }}</time
  >
</template>
