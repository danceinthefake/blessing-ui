<template>
  <div class="ts">
    <header class="ts__head">
      <div>
        <BlessText as="h1" size="lg" weight="light">Timesheet</BlessText>
        <BlessText as="p" muted>Week of 16 November 2026, times in Jakarta</BlessText>
      </div>
      <BlessButton :disabled="sent" :loading="busy" @click="onSubmit">
        {{ sent ? "Sent for approval" : "Send the week" }}
      </BlessButton>
    </header>

    <div class="ts__body">
      <section class="ts__part" aria-labelledby="ts-log">
        <BlessText id="ts-log" as="h2" size="md" weight="bold">Time</BlessText>
        <BlessTimeTracker v-model="entries" locale="en-GB" time-zone="Asia/Jakarta" />
      </section>
      <div class="ts__part">
        <section class="ts__part" aria-labelledby="ts-week">
          <BlessText id="ts-week" as="h2" size="md" weight="bold">Hours this week</BlessText>
          <BlessBarChart
            :data="chart"
            x="day"
            :series="[
              { key: 'regular', label: 'Normal' },
              { key: 'overtime', label: 'Overtime', color: 'warning' },
            ]"
            stacked
            :height="200"
            :format="(v) => `${round(v)} h`"
            label="Hours each day, normal and overtime"
          />
          <BlessText as="p" size="sm" muted>
            {{ round(total) }} h, of which {{ round(extra) }} h overtime. A work day has 8 normal
            hours, and Saturday and Sunday are rest days.
          </BlessText>
        </section>
        <BlessApprovalFlow v-if="sent" :steps me="Sari Lestari" />
      </div>
    </div>

    <BlessPayslip
      :employee="{ name: 'Sari Lestari', id: 'TS-014', role: 'Shop assistant' }"
      company="Toko Senja"
      period="November 2026, so far"
      :earnings="[
        { label: 'Base pay', amount: monthly },
        { label: 'Overtime, this week', amount: pay },
        { label: 'Overtime, earlier weeks', amount: earlier },
      ]"
      :deductions="[
        { label: 'BPJS Kesehatan, 1%', amount: Math.round(monthly * 0.01) },
        { label: 'BPJS JHT, 2%', amount: Math.round(monthly * 0.02) },
        { label: 'BPJS JP, 1%', amount: Math.round(monthly * 0.01) },
      ]"
      currency="IDR"
      locale="en-GB"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BlessApprovalFlow,
  BlessBarChart,
  BlessButton,
  BlessPayslip,
  BlessText,
  BlessTimeTracker,
  useToast,
} from "blessing-ui";
import { mockTimesheetApi } from "./api";
import { useTimesheet } from "./useTimesheet";

const { entries, monthly, earlier, days, pay, steps, sent, submit } = useTimesheet(
  mockTimesheetApi,
  "2026-11-16",
  7 * 60,
);
const { toast } = useToast();
const NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const round = (h: number) => Math.round(h * 10) / 10;
const chart = computed(() =>
  days.value.map((d) => ({
    day: NAMES[d.weekday],
    regular: round(d.regular),
    overtime: round(d.overtime),
  })),
);
const total = computed(() => days.value.reduce((n, d) => n + d.hours, 0));
const extra = computed(() => days.value.reduce((n, d) => n + d.overtime, 0));

const busy = ref(false);
async function onSubmit() {
  busy.value = true;
  await submit();
  busy.value = false;
  toast({ title: "The week went to Bayu for approval", color: "success" });
}
</script>

<style scoped>
.ts {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.ts__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.ts__body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bless-space-8);
  align-items: start;
}
.ts__part {
  display: grid;
  gap: var(--bless-space-3);
  align-content: start;
  min-width: 0;
}
@media (max-width: 760px) {
  .ts {
    padding-inline: var(--bless-space-4);
  }
  .ts__body {
    grid-template-columns: 1fr;
  }
}
</style>
