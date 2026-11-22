<template>
  <div class="meet">
    <header class="meet__head">
      <div>
        <BlessText as="h1" size="lg" weight="light">Find a time</BlessText>
        <BlessText as="p" muted
          >{{ title }}, with {{ people.map((p) => p.name).join(", ") }}</BlessText
        >
      </div>
      <BlessField label="Length" class="meet__length">
        <BlessSelect
          :model-value="String(length)"
          :options="lengths"
          :disabled="!!booked"
          @update:model-value="(v) => v && (length = Number(v))"
        />
      </BlessField>
    </header>

    <BlessAlert v-if="booked" color="success" title="Booked">
      {{ when(booked) }}. Each person gets an invitation.
    </BlessAlert>

    <div class="meet__grids">
      <section class="meet__part" aria-labelledby="meet-mine">
        <BlessText id="meet-mine" as="h2" size="md" weight="bold">When you are free</BlessText>
        <BlessText as="p" size="sm" muted
          >Drag over the times, or use the arrows and Space.</BlessText
        >
        <BlessAvailabilityGrid
          v-if="days.length"
          v-model="mine"
          :days
          :day-start="HOURS.from"
          :day-end="HOURS.to"
          :step="HOURS.step"
          locale="en-GB"
          :disabled="!!booked"
          :labels="{ label: 'Your free times' }"
        />
      </section>
      <section class="meet__part" aria-labelledby="meet-all">
        <BlessText id="meet-all" as="h2" size="md" weight="bold">When everyone is free</BlessText>
        <BlessHeatmap
          v-if="days.length"
          :rows="times.map(hhmm)"
          :columns="days"
          :values="heat"
          :format="(v) => `${v} of ${people.length} free`"
          label="Free people at each time"
          color="success"
        />
      </section>
    </div>

    <section class="meet__part" aria-labelledby="meet-best">
      <BlessText id="meet-best" as="h2" size="md" weight="bold">Best times</BlessText>
      <ol role="list" class="meet__best">
        <li v-for="s in top" :key="`${s.day}${s.start}`" class="meet__slot">
          <div>
            <BlessText as="p" size="sm" weight="bold">{{ when(s) }}</BlessText>
            <BlessText as="p" size="sm" muted>{{
              s.away.length ? `${list(s.away)} cannot come` : "Everyone is free"
            }}</BlessText>
          </div>
          <BlessButton
            size="sm"
            :variant="s.away.length ? 'outline' : 'solid'"
            :disabled="!!booked"
            :loading="busy === s"
            @click="onBook(s)"
            >Book</BlessButton
          >
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessAvailabilityGrid,
  BlessButton,
  BlessField,
  BlessHeatmap,
  BlessSelect,
  BlessText,
  useToast,
} from "blessing-ui";
import { mockMeetApi } from "./api";
import { hhmm, type Slot } from "./domain";
import { useMeet } from "./useMeet";

const HOURS = { from: 9, to: 17, step: 30 };
const { title, days, people, times, length, mine, heat, top, booked, book } = useMeet(
  mockMeetApi,
  "sari",
  HOURS,
);
const { toast } = useToast();
const lengths = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1 hour 30 minutes" },
];
const list = (names: string[]) =>
  new Intl.ListFormat("en-GB", { type: "conjunction" }).format(names);
const when = (s: Slot) => `${s.day} November, ${hhmm(s.start)} to ${hhmm(s.end)}`;

const busy = ref<Slot>();
async function onBook(s: Slot) {
  busy.value = s;
  await book(s);
  busy.value = undefined;
  toast({ title: `Booked for ${when(s)}`, color: "success" });
}
</script>

<style scoped>
.meet {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.meet__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.meet__length {
  min-width: 12rem;
}
.meet__grids {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bless-space-8);
  align-items: start;
}
.meet__part {
  display: grid;
  gap: var(--bless-space-3);
  align-content: start;
  min-width: 0;
}
.meet__best {
  display: grid;
  margin: 0;
  padding: 0;
}
.meet__slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-4);
  padding-block: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
@media (max-width: 760px) {
  .meet {
    padding-inline: var(--bless-space-4);
  }
  .meet__grids {
    grid-template-columns: 1fr;
  }
}
</style>
