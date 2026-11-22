<template>
  <div class="tix">
    <BlessCountdownBanner
      v-if="show"
      :to="show.starts"
      :title="`${show.title}, ${show.venue}`"
      :now="NOW"
      locale="en-GB"
    />

    <template v-if="tickets.length">
      <BlessAlert color="success" title="Your tickets">
        We also sent them by email. Show the code at the door.
      </BlessAlert>
      <div class="tix__tickets">
        <BlessTicket
          v-for="t in tickets"
          :key="t.code"
          :event="show!.title"
          :subtitle="show!.venue"
          :date="day(show!.starts)"
          :time="clock(show!.starts)"
          :seat="t.seat"
          holder="Sari Lestari"
          :code="t.code"
        />
      </div>
      <div><BlessButton variant="outline" @click="tickets = []">Buy more seats</BlessButton></div>
    </template>

    <div v-else-if="show" class="tix__body">
      <section class="tix__map" aria-labelledby="tix-seats">
        <BlessText id="tix-seats" as="h2" size="md" weight="bold">Pick your seats</BlessText>
        <form class="tix__best" @submit.prevent="onBest">
          <BlessField label="Seats">
            <BlessSelect
              v-model="count"
              :options="[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))"
            />
          </BlessField>
          <BlessField label="Zone">
            <BlessSelect
              v-model="zone"
              :options="
                zones.map((z) => ({ value: z.key, label: `${z.label}, ${money(z.price)}` }))
              "
            />
          </BlessField>
          <BlessButton type="submit" variant="outline">Find the best seats</BlessButton>
        </form>
        <BlessSeatPicker v-model="chosen" :rows :zones :max="4" currency="IDR" locale="en-GB" />
      </section>
      <aside class="tix__sum" aria-labelledby="tix-sum">
        <BlessText id="tix-sum" as="h2" size="md" weight="bold">Your order</BlessText>
        <BlessAlert v-if="problem" color="danger" title="Not done">{{ problem }}</BlessAlert>
        <BlessDescriptions
          :items="[
            { label: 'Seats', value: chosen.length ? chosen.join(', ') : 'None yet' },
            { label: 'Tickets', value: money(price) },
            { label: 'Service fee', value: money(charge) },
            { label: 'Total', value: money(price + charge) },
          ]"
        />
        <BlessButton :disabled="!chosen.length" :loading="busy" @click="onBuy">
          Pay {{ money(price + charge) }}
        </BlessButton>
        <BlessText as="p" size="sm" muted>At most 4 seats for each person.</BlessText>
      </aside>
    </div>
    <BlessText v-else as="p" muted>Loading…</BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessCountdownBanner,
  BlessDescriptions,
  BlessField,
  BlessSeatPicker,
  BlessSelect,
  BlessText,
  BlessTicket,
} from "blessing-ui";
import { mockTicketsApi } from "./api";
import { useTickets } from "./useTickets";

// the demo stands on one moment, so the countdown is the same each time
const NOW = Date.parse("2026-11-22T03:00:00Z");
const { show, rows, zones, chosen, price, charge, pickBest, tickets, buy } =
  useTickets(mockTicketsApi);

const money = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
const fmt = (o: Intl.DateTimeFormatOptions) => (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", ...o }).format(Date.parse(iso));
const day = fmt({ weekday: "short", day: "numeric", month: "short", year: "numeric" });
const clock = fmt({ hour: "2-digit", minute: "2-digit" });

const count = ref(2);
const zone = ref("middle");
const problem = ref("");
const busy = ref(false);
function onBest() {
  problem.value = pickBest(zone.value, count.value);
}
async function onBuy() {
  busy.value = true;
  problem.value = await buy();
  busy.value = false;
}
</script>

<style scoped>
.tix {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.tix__body {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: var(--bless-space-8);
  align-items: start;
}
.tix__map,
.tix__sum {
  display: grid;
  gap: var(--bless-space-4);
  align-content: start;
  min-width: 0;
}
.tix__best {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: var(--bless-space-3);
}
.tix__tickets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: var(--bless-space-4);
}
@media (max-width: 760px) {
  .tix {
    padding-inline: var(--bless-space-4);
  }
  .tix__body {
    grid-template-columns: 1fr;
  }
}
</style>
