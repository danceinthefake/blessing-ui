<template>
  <section class="bless-weather" :aria-label="place">
    <div class="bless-weather__now">
      <Icon :kind="weather" class="bless-weather__icon is-big" />
      <div class="bless-weather__main">
        <div class="bless-weather__place">{{ place }}</div>
        <div class="bless-weather__temp">{{ deg.format(temp) }}</div>
        <div class="bless-weather__word">{{ text[weather] }}</div>
      </div>
      <dl class="bless-weather__facts">
        <div v-if="feelsLike != null">
          <dt>{{ text.feelsLike }}</dt>
          <dd>{{ deg.format(feelsLike) }}</dd>
        </div>
        <div v-if="humidity != null">
          <dt>{{ text.humidity }}</dt>
          <dd>{{ pct.format(humidity / 100) }}</dd>
        </div>
        <div v-if="wind != null">
          <dt>{{ text.wind }}</dt>
          <dd>{{ kmh.format(wind) }}</dd>
        </div>
      </dl>
    </div>
    <ul
      v-if="days.length"
      class="bless-stagger bless-weather__days"
      :aria-label="text.days"
      role="list"
    >
      <li v-for="d in days" :key="d.date">
        <div class="bless-weather__day">
          <span class="bless-weather__name">{{ day.format(new Date(`${d.date}T00:00:00Z`)) }}</span>
          <Icon :kind="d.weather" class="bless-weather__icon" />
          <span class="bless-sr">{{ text[d.weather] }}</span>
          <span class="bless-weather__rain">{{
            d.rain ? text.rainOf(pct.format(d.rain / 100)) : ""
          }}</span>
          <span class="bless-weather__low" aria-hidden="true">{{ deg.format(d.low) }}</span>
          <span class="bless-weather__bar" aria-hidden="true">
            <span
              :style="{ insetInlineStart: `${at(d.low)}%`, insetInlineEnd: `${100 - at(d.high)}%` }"
            />
          </span>
          <span class="bless-weather__high" aria-hidden="true">{{ deg.format(d.high) }}</span>
          <span class="bless-sr">{{ text.range(deg.format(d.low), deg.format(d.high)) }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessWeatherForecast" });
const pack = useLabelPack("BlessWeatherForecast");

export type BlessWeather = "clear" | "partly-cloudy" | "cloudy" | "rain" | "storm" | "snow" | "fog";
export interface BlessWeatherDay {
  /** the day as YYYY-MM-DD */
  date: string;
  weather: BlessWeather;
  high: number;
  low: number;
  /** the chance of rain, 0 to 100 */
  rain?: number;
}

const props = withDefaults(
  defineProps<{
    place: string;
    /** the temperature now, in the unit of `unit` */
    temp: number;
    weather: BlessWeather;
    feelsLike?: number;
    humidity?: number;
    /** the wind speed in kilometers per hour */
    wind?: number;
    days?: BlessWeatherDay[];
    unit?: "celsius" | "fahrenheit";
    locale?: string;
    labels?: Partial<
      Record<BlessWeather, string> & {
        feelsLike: string;
        humidity: string;
        wind: string;
        days: string;
        rainOf: (pct: string) => string;
        range: (low: string, high: string) => string;
      }
    >;
  }>(),
  { days: () => [], unit: "celsius", locale: "en" },
);

const text = computed(() => ({
  clear: "Clear",
  "partly-cloudy": "Partly cloudy",
  cloudy: "Cloudy",
  rain: "Rain",
  storm: "Thunderstorm",
  snow: "Snow",
  fog: "Fog",
  feelsLike: "Feels like",
  humidity: "Humidity",
  wind: "Wind",
  days: "Next days",
  rainOf: (p: string) => `${p} rain`,
  range: (l: string, h: string) => `low ${l}, high ${h}`,
  ...pack(),
  ...props.labels,
}));
// the icons as SVG shapes; each kind is a sun, a cloud, or a cloud with marks under it
const SUN = [
  h("circle", { cx: 24, cy: 24, r: 8, class: "is-sun" }),
  h("path", {
    d: "M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4",
    class: "is-line",
  }),
];
const cloud = (dy = 0) =>
  h("path", {
    d: "M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-1 18z",
    class: "is-cloud",
    transform: `translate(0 ${dy})`,
  });
const UNDER: Partial<Record<BlessWeather, [string, string]>> = {
  rain: ["M16 36l-2 6M24 36l-2 6M32 36l-2 6", "is-drop"],
  storm: ["M25 30l-5 8h6l-4 8", "is-line"],
  snow: ["M16 38v4M14 40h4M24 38v4M22 40h4M32 38v4M30 40h4", "is-line"],
};
const Icon: FunctionalComponent<{ kind: BlessWeather }> = ({ kind }) => {
  const parts =
    kind === "clear"
      ? SUN
      : kind === "fog"
        ? [h("path", { d: "M8 18h32M6 26h36M10 34h28", class: "is-line" })]
        : kind === "partly-cloudy"
          ? [
              h("g", { transform: "translate(-4 -4) scale(.8)" }, SUN),
              h("g", { transform: "translate(6 6) scale(.85)" }, [cloud()]),
            ]
          : kind === "cloudy"
            ? [cloud()]
            : [cloud(-6), h("path", { d: UNDER[kind]![0], class: UNDER[kind]![1] })];
  return h("svg", { viewBox: "0 0 48 48", "aria-hidden": "true" }, parts);
};
const deg = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "unit",
      unit: props.unit,
      maximumFractionDigits: 0,
    }),
);
const pct = computed(
  () => new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 0 }),
);
const kmh = computed(
  () => new Intl.NumberFormat(props.locale, { style: "unit", unit: "kilometer-per-hour" }),
);
const day = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: "short", timeZone: "UTC" }),
);
const lo = computed(() => Math.min(...props.days.map((d) => d.low)));
const hi = computed(() => Math.max(...props.days.map((d) => d.high)));
const at = (v: number) => ((v - lo.value) / (hi.value - lo.value || 1)) * 100;
</script>

<style>
.bless-weather {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 30rem;
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-weather__now {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--bless-space-2) var(--bless-space-4);
}
.bless-weather__icon {
  inline-size: 2rem;
  block-size: 2rem;
}
.bless-weather__icon.is-big {
  inline-size: 4.5rem;
  block-size: 4.5rem;
}
.bless-weather .is-sun {
  fill: var(--bless-color-chart-3, var(--bless-color-accent));
}
.bless-weather .is-cloud {
  fill: var(--bless-color-surface-2);
  stroke: var(--bless-color-text);
  stroke-width: 2.5;
}
.bless-weather .is-line,
.bless-weather .is-drop,
.bless-weather .is-bolt {
  fill: none;
  stroke: var(--bless-color-text);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-weather .is-drop {
  stroke: var(--bless-color-chart-2, var(--bless-color-text));
}
.bless-weather__place {
  font-weight: var(--bless-font-weight-bold);
}
.bless-weather__temp {
  font-size: 2.75rem;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.bless-weather__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-4);
  grid-column: 1 / -1;
  margin: 0;
}
.bless-weather__facts dt {
  font-size: var(--bless-text-xs);
}
.bless-weather__facts dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-weather__days {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-weather__day {
  display: grid;
  grid-template-columns: 3rem 2rem 4.5rem 2.75rem minmax(3rem, 1fr) 2.75rem;
  align-items: center;
  gap: var(--bless-space-2);
  padding-block: var(--bless-space-1);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  font-variant-numeric: tabular-nums;
}
.bless-weather__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-weather__rain {
  font-size: var(--bless-text-xs);
}
.bless-weather__low {
  text-align: end;
}
.bless-weather__high {
  font-weight: var(--bless-font-weight-bold);
}
.bless-weather__bar {
  position: relative;
  block-size: 6px;
  background: var(--bless-color-surface-2);
}
.bless-weather__bar span {
  position: absolute;
  inset-block: 0;
  background: var(--bless-color-text);
}
</style>
