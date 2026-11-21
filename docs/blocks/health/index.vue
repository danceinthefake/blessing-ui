<template>
  <div v-if="day" class="health">
    <header class="health__head">
      <BlessText as="h2" size="lg" weight="bold">Today</BlessText>
      <BlessText as="p" size="sm" muted>Thursday, 19 November</BlessText>
    </header>
    <BlessVitalsPanel :vitals="day.vitals" class="health__wide" />
    <section aria-labelledby="health-meds">
      <BlessText id="health-meds" as="h3" size="sm" weight="bold">Medicines</BlessText>
      <BlessMedicationSchedule v-model="day.taken" :doses="day.doses" now="10:05" />
    </section>
    <section aria-labelledby="health-sleep">
      <BlessText id="health-sleep" as="h3" size="sm" weight="bold">Last night</BlessText>
      <BlessSleepChart :spans="day.sleep" />
    </section>
    <section aria-labelledby="health-habits" class="health__wide">
      <BlessText id="health-habits" as="h3" size="sm" weight="bold">This week</BlessText>
      <BlessHabitTracker v-model:done="day.done" :habits="day.habits" end="2026-11-19" />
    </section>
    <section aria-labelledby="health-visit" class="health__wide">
      <BlessText id="health-visit" as="h3" size="sm" weight="bold">Next visit</BlessText>
      <BlessAppointmentCard
        v-if="day.visit"
        :title="day.visit.title"
        :date="day.visit.date"
        :time="span(day.visit.start, day.visit.minutes)"
        :person="day.visit.doctor"
        :place="day.visit.place"
        @reschedule="reschedule"
        @cancel="cancel"
      />
      <BlessText v-else as="p" size="sm" muted>No visit booked.</BlessText>
    </section>

    <BlessSheet v-model="picking" side="right" title="Pick a new time">
      <div class="health__pick">
        <BlessText as="p" size="sm">Free times on Tuesday, 24 November.</BlessText>
        <BlessSlotPicker v-model="pick" :slots locale="en" />
        <BlessButton :disabled="!pick || pick === day.visit?.start" @click="save"
          >Move the visit</BlessButton
        >
      </div>
    </BlessSheet>
  </div>
</template>

<script setup lang="ts">
import {
  BlessAppointmentCard,
  BlessButton,
  BlessHabitTracker,
  BlessMedicationSchedule,
  BlessSheet,
  BlessSleepChart,
  BlessSlotPicker,
  BlessText,
  BlessVitalsPanel,
  useToast,
} from "blessing-ui";
import { onMounted, ref } from "vue";
import { mockHealthApi } from "./api";
import { span, type BlessSlot, type Day } from "./domain";

const day = ref<Day>();
onMounted(async () => (day.value = await mockHealthApi.today()));

const picking = ref(false);
const slots = ref<BlessSlot[]>([]);
const pick = ref<string | null>(null);
async function reschedule() {
  if (!day.value?.visit) return;
  slots.value = await mockHealthApi.slots(day.value.visit.date);
  pick.value = day.value.visit.start;
  picking.value = true;
}
const { toast } = useToast();
async function save() {
  const v = day.value?.visit;
  if (!v || !pick.value) return;
  v.start = pick.value;
  picking.value = false;
  await mockHealthApi.reschedule(v.start);
  toast({ title: "Visit moved", description: span(v.start, v.minutes), color: "success" });
}
function cancel() {
  if (!day.value) return;
  const visit = day.value.visit;
  day.value.visit = null;
  toast({
    title: "Visit canceled",
    action: { label: "Undo", onClick: () => day.value && (day.value.visit = visit) },
  });
}
</script>

<style scoped>
.health {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
/* a grid item is as wide as its content by default; the charts measure the column instead */
.health > * {
  min-width: 0;
}
.health__head,
.health__wide {
  grid-column: 1 / -1;
}
.health h2,
.health h3,
.health__head p {
  margin: 0 0 var(--bless-space-2);
}
.health__pick {
  display: grid;
  gap: var(--bless-space-4);
  justify-items: start;
}
@media (max-width: 760px) {
  .health {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
}
</style>
