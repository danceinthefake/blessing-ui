<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSwitch from "./BlessSwitch.vue";

defineOptions({ name: "BlessDeviceTile" });
const pack = useLabelPack("BlessDeviceTile");

const props = defineProps<{
  name: string;
  /** the room, for example "Studio" */
  room?: string;
  /** an emoji or a short text for the device */
  icon?: string;
  /** the main reading, as text, for example "21.5 °C" or "Door closed" */
  reading?: string;
  /** the device does not answer: the switch is off and the tile says so */
  offline?: boolean;
  /** a sensor has no switch */
  sensor?: boolean;
  labels?: Partial<{ on: string; off: string; offline: string; power: (name: string) => string }>;
}>();
const on = defineModel<boolean>({ default: false });

const text = computed(() => ({
  on: "On",
  off: "Off",
  offline: "Offline",
  power: (n: string) => `Power, ${n}`,
  ...pack(),
  ...props.labels,
}));
const state = computed(() =>
  props.offline
    ? text.value.offline
    : props.sensor
      ? ""
      : on.value
        ? text.value.on
        : text.value.off,
);
</script>

<template>
  <article
    class="bless-device"
    :class="{ 'is-on': on && !offline && !sensor, 'is-offline': offline }"
  >
    <div class="bless-device__top">
      <span v-if="icon" class="bless-device__icon" aria-hidden="true">{{ icon }}</span>
      <BlessSwitch
        v-if="!sensor"
        v-model="on"
        :disabled="offline"
        :aria-label="text.power(name)"
        size="sm"
      />
    </div>
    <h3 class="bless-device__name">{{ name }}</h3>
    <p v-if="room" class="bless-device__room">{{ room }}</p>
    <p class="bless-device__status">
      <span v-if="state" class="bless-device__state">{{ state }}</span>
      <template v-if="state && reading && !offline"> · </template>
      <span v-if="reading && !offline" class="bless-device__reading">{{ reading }}</span>
    </p>
  </article>
</template>

<style>
.bless-device {
  display: grid;
  align-content: start;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
/* on: a thick top edge in the accent color and the word; offline: dashed and the word */
.bless-device.is-on {
  border-block-start: 4px solid var(--bless-color-accent);
}
.bless-device.is-offline {
  border-style: dashed;
}
.bless-device__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
  min-block-size: 2rem;
}
.bless-device__icon {
  font-size: var(--bless-text-lg);
}
.is-offline .bless-device__icon {
  filter: grayscale(1);
  opacity: 0.5;
}
.bless-device__name {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-device__room {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-device__status {
  margin: 0;
  font-size: var(--bless-text-xs);
}
.bless-device__state {
  font-weight: var(--bless-font-weight-bold);
}
.is-offline .bless-device__state {
  color: var(--bless-color-danger-text);
}
.bless-device__reading {
  font-variant-numeric: tabular-nums;
}
</style>
