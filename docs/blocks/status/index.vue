<template>
  <div class="st">
    <header class="st__head">
      <BlessText as="h1" size="lg" weight="light">Toko Senja status</BlessText>
      <div class="st__actions">
        <BlessButton variant="outline" :loading="busy" @click="refresh">Refresh</BlessButton>
        <BlessButton @click="startSubscribe">Get updates</BlessButton>
      </div>
    </header>
    <BlessText v-if="!data" as="p" muted>Loading…</BlessText>
    <template v-else>
      <BlessSystemStatus :parts :updated="`at ${clock(now)} ${ZONE}`" />

      <BlessAlert v-for="m in coming" :key="m.id" color="info" :title="`Planned: ${m.title}`">
        {{ span(m.start, m.end) }}, for {{ m.parts.map(nameOf).join(" and ") }}. {{ m.text }}
      </BlessAlert>

      <section v-if="open.length" class="st__section" aria-labelledby="st-now">
        <BlessText id="st-now" as="h2" size="md" weight="bold">Now</BlessText>
        <BlessIncidentTimeline
          v-for="i in open"
          :key="i.id"
          :title="i.title"
          :impact="i.impact"
          :affected="i.parts.map(nameOf)"
          :updates="i.updates.map(asUpdate)"
        />
      </section>

      <section class="st__section" aria-labelledby="st-uptime">
        <BlessText id="st-uptime" as="h2" size="md" weight="bold"
          >Uptime, last {{ DAYS }} days</BlessText
        >
        <ul role="list" class="st__parts">
          <li v-for="p in parts" :key="p.id" class="st__part">
            <div class="st__part-head">
              <BlessText as="span" size="sm" weight="bold">{{ p.name }}</BlessText>
              <BlessText as="span" size="sm" muted>{{ percent(p.uptime) }}</BlessText>
            </div>
            <BlessUptimeBar
              :items="p.days.map((d) => ({ status: d.status, label: shortDay(d.date) }))"
              locale="en-GB"
              :labels="{ summary: (pc, n) => `${p.name}: ${pc} uptime over ${n} days` }"
            />
          </li>
        </ul>
      </section>

      <section class="st__section" aria-labelledby="st-past">
        <BlessText id="st-past" as="h2" size="md" weight="bold">Past incidents</BlessText>
        <BlessText v-if="!past.length" as="p" muted
          >No incidents in the last {{ DAYS }} days.</BlessText
        >
        <div v-for="d in past" :key="d.date" class="st__day">
          <BlessText as="h3" size="sm" weight="bold" muted>{{ longDay(d.date) }}</BlessText>
          <BlessIncidentTimeline
            v-for="i in d.incidents"
            :key="i.id"
            :title="i.title"
            :impact="i.impact"
            :affected="i.parts.map(nameOf)"
            :updates="i.updates.map(asUpdate)"
          />
        </div>
      </section>
    </template>

    <BlessModal v-model="subscribing" title="Get updates by email" size="sm">
      <form class="st__form" novalidate @submit.prevent="onSubscribe">
        <BlessField label="Email" :error="problem">
          <BlessInput v-model="email" type="email" autocomplete="email" />
        </BlessField>
        <BlessFieldset legend="Send an email when these change">
          <div class="st__checks">
            <BlessCheckbox
              v-for="p in data?.parts ?? []"
              :key="p.id"
              v-model="picked"
              :value="p.id"
              >{{ p.name }}</BlessCheckbox
            >
          </div>
        </BlessFieldset>
        <div><BlessButton type="submit" :loading="saving">Subscribe</BlessButton></div>
      </form>
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessCheckbox,
  BlessField,
  BlessFieldset,
  BlessIncidentTimeline,
  BlessInput,
  BlessModal,
  BlessSystemStatus,
  BlessText,
  BlessUptimeBar,
  useToast,
  type BlessIncidentUpdate,
} from "blessing-ui";
import { mockStatusApi } from "./api";
import type { Update } from "./domain";
import { useStatus } from "./useStatus";

const DAYS = 30;
const ZONE = "WIB";
const { data, busy, refresh, now, parts, open, past, coming, nameOf, subscribe } = useStatus(
  mockStatusApi,
  DAYS,
  7 * 60,
);
const { toast } = useToast();

const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", ...o });
const clock = (t: number) => fmt({ hour: "2-digit", minute: "2-digit" }).format(t);
const stamp = (iso: string) =>
  `${fmt({ day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(Date.parse(iso))} ${ZONE}`;
const span = (a: string, b: string) =>
  `${fmt({ weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(Date.parse(a))} to ${clock(Date.parse(b))} ${ZONE}`;
const utcDay = (o: Intl.DateTimeFormatOptions) => (d: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(Date.parse(`${d}T00:00:00Z`));
const shortDay = utcDay({ day: "numeric", month: "short" });
const longDay = utcDay({ dateStyle: "full" });
const percent = (r: number) =>
  new Intl.NumberFormat("en-GB", { style: "percent", maximumFractionDigits: 2 }).format(r);
const asUpdate = (u: Update): BlessIncidentUpdate => ({
  status: u.status,
  time: stamp(u.at),
  text: u.text,
});

const subscribing = ref(false);
const saving = ref(false);
const email = ref("");
const picked = ref<string[]>([]);
const problem = ref("");
function startSubscribe() {
  problem.value = "";
  picked.value = data.value?.parts.map((p) => p.id) ?? [];
  subscribing.value = true;
}
async function onSubscribe() {
  saving.value = true;
  problem.value = await subscribe(email.value, picked.value);
  saving.value = false;
  if (problem.value) return;
  subscribing.value = false;
  toast({ title: `We will email ${email.value.trim()} when a state changes`, color: "success" });
}
</script>

<style scoped>
.st {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 48rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.st__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.st__actions {
  display: flex;
  gap: var(--bless-space-2);
}
.st__section,
.st__day,
.st__form {
  display: grid;
  gap: var(--bless-space-3);
}
.st__parts {
  display: grid;
  gap: var(--bless-space-6);
  margin: 0;
  padding: 0;
}
.st__part {
  display: grid;
  gap: var(--bless-space-2);
}
.st__part-head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.st__checks {
  display: grid;
  gap: var(--bless-space-2);
}
@media (max-width: 760px) {
  .st {
    padding-inline: var(--bless-space-4);
  }
}
</style>
