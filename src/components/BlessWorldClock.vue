<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "BlessWorldClock" });

export interface BlessClockZone {
  /** the IANA name, for example `Asia/Jakarta` */
  zone: string;
  /** the name to show; default: the city of the zone, for example "Jakarta" */
  label?: string;
}

const props = withDefaults(
  defineProps<{
    zones: (BlessClockZone | string)[];
    /** language of the times and the day words, for example `id`. Default: English. */
    locale?: string;
    /** a 12-hour clock; default: the habit of the locale */
    hour12?: boolean;
    /** the zone that "today" and "tomorrow" compare with; default: the zone of the reader */
    home?: string;
    /** a fixed moment; with it the clocks do not run */
    now?: Date | number;
  }>(),
  { locale: "en", hour12: undefined },
);

// the server and the browser disagree on "now", so the clocks start after mount, or at once with a fixed `now`
const ms = ref<number>();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (props.now !== undefined) return;
  ms.value = Date.now();
  timer = setInterval(() => (ms.value = Date.now()), 15_000);
});
onBeforeUnmount(() => clearInterval(timer));
const at = computed(() => (props.now !== undefined ? +props.now : ms.value));

const city = (zone: string) => zone.split("/").pop()!.replaceAll("_", " ");
const ymd = (d: Date, timeZone?: string) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en", { year: "numeric", month: "numeric", day: "numeric", timeZone })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return Date.UTC(+p.year!, +p.month! - 1, +p.day!);
};
const clocks = computed(() => {
  const days = new Intl.RelativeTimeFormat(props.locale, { numeric: "auto" });
  return props.zones.map((z) => {
    const { zone, label } = typeof z === "string" ? { zone: z, label: undefined } : z;
    const name = label ?? city(zone);
    if (at.value === undefined)
      return { zone, name, time: "--:--", day: "", offset: "", night: false };
    const d = new Date(at.value);
    const parts = new Intl.DateTimeFormat(props.locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: props.hour12,
      timeZone: zone,
      timeZoneName: "shortOffset",
    }).formatToParts(d);
    const time = parts
      .filter((x) => x.type !== "timeZoneName")
      .map((x) => x.value)
      .join("")
      .trim();
    const offset = parts.find((x) => x.type === "timeZoneName")?.value ?? "";
    const hour = +new Intl.DateTimeFormat("en", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: zone,
    }).format(d);
    const diff = Math.round((ymd(d, zone) - ymd(d, props.home)) / 86_400_000);
    return {
      zone,
      name,
      time,
      day: days.format(diff, "day"),
      offset,
      night: hour < 6 || hour >= 18,
    };
  });
});
</script>

<template>
  <ul class="bless-clock">
    <li
      v-for="c in clocks"
      :key="c.zone"
      class="bless-clock__zone"
      :class="{ 'is-night': c.night }"
    >
      <span class="bless-clock__name">{{ c.name }}</span>
      <time class="bless-clock__time">{{ c.time }}</time>
      <span class="bless-clock__meta">{{ [c.day, c.offset].filter(Boolean).join(" · ") }}</span>
    </li>
  </ul>
</template>

<style>
.bless-clock {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-clock__zone {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
}
/* night hours get the dark plate, so the time of day shows at a glance */
.bless-clock__zone.is-night {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-clock__name {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-clock__time {
  font-size: var(--bless-text-xl);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.bless-clock__meta {
  font-size: var(--bless-text-xs);
  opacity: 0.8;
}
</style>
