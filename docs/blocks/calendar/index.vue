<template>
  <div class="cal">
    <header class="cal__head">
      <BlessText as="h1" size="lg" weight="light">Calendar</BlessText>
      <div class="cal__tools">
        <BlessField label="Show times in" class="cal__zone">
          <BlessTimezonePicker v-model="viewZone" :zones />
        </BlessField>
        <BlessButton @click="startNew">New event</BlessButton>
      </div>
    </header>
    <BlessEventCalendar
      v-model:date="anchor"
      :events="cells"
      locale="en-GB"
      label="Events"
      @select="(e) => (openId = e.id)"
    />

    <BlessSheet
      :model-value="!!open"
      :title="open?.event.title ?? ''"
      size="26rem"
      @update:model-value="(v: boolean) => !v && (openId = '')"
    >
      <div v-if="open" class="cal__sheet">
        <BlessDescriptions :items="details" />
        <BlessRsvp
          v-if="open.event.going"
          :model-value="open.event.answer"
          :going="open.event.going"
          :counts="{ yes: open.event.going.length }"
          @update:model-value="(a) => answer(open!.event.id, a)"
        />
      </div>
    </BlessSheet>

    <BlessModal v-model="making" title="New event" size="sm">
      <form class="cal__form" @submit.prevent="onSave">
        <BlessField label="Title" :error="problem">
          <BlessInput v-model="draft.title" placeholder="For example: Lunch with Sari" />
        </BlessField>
        <BlessField label="Starts">
          <BlessDateTimePicker v-model="draft.at" locale="en-GB" />
        </BlessField>
        <BlessField label="Length">
          <BlessSelect v-model="draft.minutes" :options="lengths" />
        </BlessField>
        <BlessSwitch v-model="draft.repeats">Repeats</BlessSwitch>
        <BlessRecurrencePicker v-if="draft.repeats" v-model="draft.rule" locale="en-GB" />
        <BlessAlert v-if="overlap.length" color="warning" title="This overlaps">
          {{ overlap.map((o) => `${o.event.title} at ${hhmm(o.start!)}`).join(", ") }}. You can
          still save it.
        </BlessAlert>
        <BlessText as="p" size="sm" muted>Times are in {{ zoneName }}.</BlessText>
        <div><BlessButton type="submit" :loading="busy">Save</BlessButton></div>
      </form>
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessDateTimePicker,
  BlessDescriptions,
  BlessEventCalendar,
  BlessField,
  BlessInput,
  BlessModal,
  BlessRecurrencePicker,
  BlessRsvp,
  BlessSelect,
  BlessSheet,
  BlessSwitch,
  BlessText,
  BlessTimezonePicker,
  useToast,
  type BlessCalendarEvent,
  type BlessRecurrence,
} from "blessing-ui";
import { mockCalendarApi } from "./api";
import { describe, hhmm, type CalEvent } from "./domain";
import { useCalendar } from "./useCalendar";

const today = "2026-11-22";
const { anchor, viewZone, shown, openId, open, overlaps, create, answer } = useCalendar(
  mockCalendarApi,
  today,
  "Asia/Jakarta",
);
const { toast } = useToast();
const zones = ["Asia/Jakarta", "Asia/Tokyo", "Europe/Amsterdam", "America/New_York", "UTC"];
const zoneName = computed(() => viewZone.value.split("/").pop()!.replace("_", " "));

const cells = computed<BlessCalendarEvent[]>(() =>
  shown.value.map((o) => ({
    id: o.id,
    title: o.event.title,
    date: o.date,
    start: o.start,
    end: o.end,
    color: o.event.color,
  })),
);
const longDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
const details = computed(() => {
  const o = open.value!;
  const e = o.event;
  const own =
    e.start !== undefined && e.zone !== viewZone.value
      ? ` (${hhmm(e.start)} in ${e.zone.split("/").pop()!.replace("_", " ")})`
      : "";
  return [
    { label: "When", value: longDay(o.date) },
    {
      label: "Time",
      value: o.start === undefined ? "All day" : `${hhmm(o.start)} to ${hhmm(o.end!)}${own}`,
    },
    ...(e.repeat ? [{ label: "Repeats", value: describe(e.repeat) }] : []),
    ...(e.place ? [{ label: "Where", value: e.place }] : []),
  ];
});

// a new event
const lengths = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1 hour 30 minutes" },
];
const making = ref(false);
const busy = ref(false);
const problem = ref("");
const draft = reactive({
  title: "",
  at: "",
  minutes: "60",
  repeats: false,
  rule: { freq: "weekly", interval: 1, days: [0], end: { type: "never" } } as BlessRecurrence,
});
function startNew() {
  Object.assign(draft, { title: "", at: `${today}T12:00`, minutes: "60", repeats: false });
  problem.value = "";
  making.value = true;
}
const toEvent = (): Omit<CalEvent, "id"> => ({
  title: draft.title.trim(),
  date: draft.at.slice(0, 10),
  start: Number(draft.at.slice(11, 13)) * 60 + Number(draft.at.slice(14, 16)),
  minutes: Number(draft.minutes),
  zone: viewZone.value,
  repeat: draft.repeats ? draft.rule : undefined,
});
const overlap = computed(() => (making.value && draft.at ? overlaps(toEvent()) : []));
async function onSave() {
  problem.value = draft.title.trim() ? "" : "Give the event a title.";
  if (problem.value) return;
  busy.value = true;
  const e = await create(toEvent());
  busy.value = false;
  making.value = false;
  toast({ title: `${e.title} is on ${longDay(e.date)}`, color: "success" });
}
</script>

<style scoped>
.cal {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.cal__head,
.cal__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.cal__zone {
  min-width: 14rem;
}
.cal__sheet,
.cal__form {
  display: grid;
  gap: var(--bless-space-4);
}
@media (max-width: 760px) {
  .cal {
    padding-inline: var(--bless-space-4);
  }
  .cal__tools,
  .cal__zone {
    flex: 1 1 100%;
  }
}
</style>
