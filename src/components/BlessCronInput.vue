<template>
  <div class="bless-cron">
    <div class="bless-cron__fields" role="group" :aria-labelledby="fs.labelledby">
      <label v-for="(k, i) in KEYS" :key="k" class="bless-cron__part">
        <span class="bless-cron__name">{{ text[k] }}</span>
        <input
          :id="i === 0 ? id() : undefined"
          class="bless-cron__input"
          :class="{ 'bless-cron__input--bad': bad[i] }"
          :value="parts[i]"
          :disabled
          spellcheck="false"
          autocomplete="off"
          :aria-invalid="bad[i] || fs.invalid.value ? 'true' : undefined"
          :aria-describedby="joinIds(`${uid}-out`, fs.describedby.value)"
          @change="set(i, ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>
    <div :id="`${uid}-out`" class="bless-cron__out">
      <p v-if="bad.includes(true)" class="bless-cron__invalid">{{ text.invalid }}</p>
      <template v-else-if="runs.length">
        <span class="bless-cron__next">{{ text.next }}</span>
        <ul class="bless-cron__runs" role="list">
          <li v-for="r in runs" :key="r.getTime()">
            <time :datetime="r.toISOString()">{{ fmt.format(r) }}</time>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";
import { joinIds, useFieldId, useFieldState } from "../composables/useFieldId";
import { useLabelPack } from "../composables/useLabels";
import { blessCronNext, cronField } from "./cron";

defineOptions({ name: "BlessCronInput" });
const pack = useLabelPack("BlessCronInput");

const props = withDefaults(
  defineProps<{
    id?: string;
    /** how many next run times to show; 0 hides the list */
    count?: number;
    /** for the run times, for example `id-ID` */
    locale?: string;
    disabled?: boolean;
    labels?: Partial<{
      minute: string;
      hour: string;
      day: string;
      month: string;
      weekday: string;
      next: string;
      invalid: string;
    }>;
  }>(),
  { count: 3 },
);
/** five fields separated by spaces, for example `0 9 * * 1-5` */
const model = defineModel<string>({ default: "* * * * *" });

const text = computed(() => ({
  minute: "Minute",
  hour: "Hour",
  day: "Day",
  month: "Month",
  weekday: "Weekday",
  next: "Next runs",
  invalid: "Check the marked part",
  ...pack(),
  ...props.labels,
}));
const id = useFieldId(props);
const fs = useFieldState();
const uid = useId();

const KEYS = ["minute", "hour", "day", "month", "weekday"] as const;
const parts = computed(() => {
  const p = model.value.trim().split(/\s+/);
  return KEYS.map((_, i) => p[i] ?? "*");
});
const bad = computed(() => parts.value.map((p, i) => !cronField(p, i)));
function set(i: number, v: string) {
  const next = [...parts.value];
  next[i] = v.replace(/\s+/g, "") || "*";
  model.value = next.join(" ");
}

// the clock and the time zone are read after mount, so a server-rendered page and its first client
// render agree (as in BlessRelativeTime)
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const runs = computed(() =>
  mounted.value && props.count && !bad.value.includes(true)
    ? blessCronNext(model.value, new Date(), props.count)
    : [],
);
const fmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
);
</script>

<style>
.bless-cron {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-cron__fields {
  display: grid;
  grid-template-columns: repeat(5, minmax(3.5rem, 1fr));
  /* fuse when grouped: five parts of one value, no gap between them */
  gap: 0;
}
.bless-cron__part {
  display: grid;
  gap: var(--bless-space-1);
  min-inline-size: 0;
}
.bless-cron__part + .bless-cron__part {
  margin-inline-start: calc(-1 * var(--bless-border-width));
}
.bless-cron__name {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  color: var(--bless-color-text-muted);
}
.bless-cron__input {
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: var(--bless-text-sm);
  text-align: center;
}
.bless-cron__input:focus-visible {
  position: relative;
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -1px;
}
.bless-cron__input--bad {
  position: relative;
  border-color: var(--bless-color-danger);
}
.bless-cron__input:disabled {
  opacity: 0.5;
}
.bless-cron__out {
  font-size: var(--bless-text-sm);
}
.bless-cron__invalid {
  margin: 0;
  color: var(--bless-color-danger-text);
}
.bless-cron__next {
  color: var(--bless-color-text-muted);
}
.bless-cron__runs {
  margin: var(--bless-space-1) 0 0;
  padding: 0;
  list-style: none;
  font-variant-numeric: tabular-nums;
}
</style>
