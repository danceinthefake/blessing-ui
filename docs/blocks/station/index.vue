<script setup lang="ts">
import {
  BlessDowntimePicker,
  BlessProductionCounter,
  BlessQualityCheck,
  BlessSheet,
  BlessText,
  BlessWorkInstructions,
  BlessWorkOrderCard,
  type BlessQualityResult,
  useToast,
} from "blessing-ui";
import { nextTick, onMounted, ref } from "vue";
import { mockStationApi } from "./api";
import { count, type Job } from "./domain";

const job = ref<Job>();
onMounted(async () => (job.value = await mockStationApi.job()));

// one unit: follow the steps, then check it; the check counts it and starts the next unit
const phase = ref<"steps" | "check">("steps");
const step = ref(0);
const results = ref<BlessQualityResult>({});
const checkTitle = ref<HTMLElement>();
function packed() {
  phase.value = "check";
  nextTick(() => checkTitle.value?.focus());
}
const { toast } = useToast();
async function checked(unit: BlessQualityResult, passed: boolean) {
  if (!job.value) return;
  job.value.order = count(job.value.order, passed);
  await mockStationApi.report(unit, passed);
  toast({ title: passed ? "Unit good" : "Unit to scrap", color: passed ? "success" : "warning" });
  results.value = {};
  step.value = 0;
  phase.value = "steps";
}

const stopping = ref(false);
const reason = ref<string>();
async function stop(r: string, note: string) {
  if (!job.value) return;
  job.value.order.state = "paused";
  stopping.value = false;
  await mockStationApi.stop(r, note);
}
</script>

<template>
  <div v-if="job" class="station">
    <aside class="station__order">
      <BlessWorkOrderCard
        :number="job.order.number"
        :product="job.order.product"
        :target="job.order.target"
        :done="job.order.good"
        :station="job.order.station"
        :due="job.order.due"
        :state="job.order.state"
        @pause="((reason = undefined), (stopping = true))"
        @start="job.order.state = 'running'"
        @finish="job.order.state = 'done'"
      />
      <BlessProductionCounter
        v-model:good="job.order.good"
        v-model:scrap="job.order.scrap"
        :target="job.order.target"
      />
    </aside>
    <main class="station__work">
      <BlessText v-if="job.order.state === 'done'" as="p" size="lg" weight="bold"
        >Order done. Take the next order from the board.</BlessText
      >
      <BlessText v-else-if="job.order.state !== 'running'" as="p" size="md"
        >The line is stopped. Press Start on the order to go on.</BlessText
      >
      <BlessWorkInstructions
        v-else-if="phase === 'steps'"
        v-model="step"
        :job="`${job.order.product} · ${job.order.number}`"
        :steps="job.steps"
        @finish="packed"
      />
      <section v-else aria-labelledby="station-check">
        <h2 id="station-check" ref="checkTitle" tabindex="-1" class="station__h">
          Check this unit
        </h2>
        <BlessQualityCheck v-model="results" :items="job.checks" @submit="checked" />
      </section>
    </main>

    <BlessSheet v-model="stopping" side="right" title="Why did the line stop?">
      <BlessDowntimePicker
        v-model="reason"
        :reasons="job.reasons"
        :machine="job.order.station"
        @save="stop"
      />
    </BlessSheet>
  </div>
</template>

<style scoped>
.station {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, 2fr);
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
.station__order,
.station__work {
  display: grid;
  gap: var(--bless-space-4);
  min-width: 0;
}
.station__h {
  margin: 0 0 var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-lg);
}
.station__h:focus {
  outline: none;
}
@media (max-width: 760px) {
  .station {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
}
</style>
