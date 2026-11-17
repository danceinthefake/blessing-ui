<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessAppointmentCard" });
const pack = useLabelPack("BlessAppointmentCard");

export type BlessAppointmentStatus = "confirmed" | "pending" | "cancelled";

const props = withDefaults(
  defineProps<{
    /** what the visit is for */
    title: string;
    /** YYYY-MM-DD */
    date: string;
    /** the time, as text, for example "09:30–10:00" */
    time: string;
    person: { name: string; role?: string; avatar?: string };
    /** an address; leave it out for a video call */
    place?: string;
    video?: boolean;
    status?: BlessAppointmentStatus;
    locale?: string;
    labels?: Partial<
      Record<BlessAppointmentStatus, string> & {
        video: string;
        join: string;
        reschedule: string;
        cancel: string;
      }
    >;
  }>(),
  { status: "confirmed", locale: "en" },
);
const emit = defineEmits<{ join: []; reschedule: []; cancel: [] }>();

const text = computed(() => ({
  confirmed: "Confirmed",
  pending: "Waiting for confirmation",
  cancelled: "Cancelled",
  video: "Video call",
  join: "Join the call",
  reschedule: "Reschedule",
  cancel: "Cancel",
  ...pack(),
  ...props.labels,
}));
const at = computed(() => new Date(`${props.date}T00:00:00Z`));
const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(props.locale, { ...o, timeZone: "UTC" }).format(at.value);
const MARK: Record<BlessAppointmentStatus, string> = {
  confirmed: "✓",
  pending: "…",
  cancelled: "✕",
};
</script>

<template>
  <article class="bless-appt" :class="`is-${status}`">
    <div class="bless-appt__date" aria-hidden="true">
      <span class="bless-appt__month">{{ fmt({ month: "short" }) }}</span>
      <span class="bless-appt__day">{{ fmt({ day: "numeric" }) }}</span>
      <span class="bless-appt__week">{{ fmt({ weekday: "short" }) }}</span>
    </div>
    <div class="bless-appt__body">
      <h3 class="bless-appt__title">{{ title }}</h3>
      <p class="bless-appt__when">
        <span class="bless-sr"
          >{{ fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }) }}, </span
        >{{ time }}
      </p>
      <div class="bless-appt__person">
        <BlessAvatar :name="person.name" :src="person.avatar" alt="" size="sm" />
        <span>
          <strong>{{ person.name }}</strong>
          <span v-if="person.role" class="bless-appt__role">{{ person.role }}</span>
        </span>
      </div>
      <p class="bless-appt__place">
        <span aria-hidden="true">{{ video ? "▶︎" : "⌖" }}</span> {{ video ? text.video : place }}
      </p>
      <p class="bless-appt__status">
        <span aria-hidden="true">{{ MARK[status] }}</span> {{ text[status] }}
      </p>
      <div v-if="status !== 'cancelled'" class="bless-appt__actions">
        <BlessButton v-if="video" size="sm" @click="emit('join')">{{ text.join }}</BlessButton>
        <BlessButton size="sm" variant="outline" @click="emit('reschedule')">{{
          text.reschedule
        }}</BlessButton>
        <BlessButton size="sm" variant="ghost" @click="emit('cancel')">{{
          text.cancel
        }}</BlessButton>
      </div>
    </div>
  </article>
</template>

<style>
.bless-appt {
  display: flex;
  gap: var(--bless-space-4);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-appt.is-cancelled {
  border-style: dashed;
}
.bless-appt__date {
  display: grid;
  flex: none;
  align-content: start;
  justify-items: center;
  inline-size: 4rem;
  padding-block: var(--bless-space-2);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  text-transform: uppercase;
}
.bless-appt__month,
.bless-appt__week {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-appt__day {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.1;
}
.bless-appt__body {
  display: grid;
  flex: 1;
  gap: var(--bless-space-2);
  min-inline-size: 0;
}
.bless-appt__title {
  margin: 0;
  font-size: var(--bless-text-md);
}
.is-cancelled .bless-appt__title {
  text-decoration: line-through;
}
.bless-appt__when,
.bless-appt__place,
.bless-appt__status {
  margin: 0;
}
.bless-appt__when {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-appt__person {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-appt__person > span {
  display: grid;
}
.bless-appt__role {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-appt__status {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-cancelled .bless-appt__status {
  color: var(--bless-color-danger-text);
}
.bless-appt__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-appt {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
