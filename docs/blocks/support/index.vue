<template>
  <div class="desk">
    <BlessText as="h1" size="lg" weight="light">Support</BlessText>
    <div class="desk__body" :class="{ 'is-open': open }">
      <section class="desk__queue" aria-label="Tickets">
        <BlessTabs v-model="view" :tabs label="Queue">
          <ul role="list" class="desk__list">
            <li v-for="t in shown" :key="t.id">
              <button
                type="button"
                class="desk__row"
                :aria-current="t.id === openId ? 'true' : undefined"
                @click="openId = t.id"
              >
                <span class="desk__line">
                  <strong>{{ t.subject }}</strong>
                  <BlessBadge :color="COLOR[t.priority]" variant="outline">{{
                    PRIORITY[t.priority]
                  }}</BlessBadge>
                </span>
                <span class="desk__line desk__muted">
                  <span>#{{ t.number }} · {{ t.customer.name }}</span>
                  <span>{{ dueText(t) }}</span>
                </span>
              </button>
            </li>
          </ul>
          <BlessEmpty v-if="!shown.length" title="No tickets here" />
        </BlessTabs>
      </section>

      <section v-if="open && limits" class="desk__ticket" aria-label="Ticket">
        <div class="desk__back">
          <BlessButton size="sm" variant="ghost" @click="openId = ''"
            >Back to the queue</BlessButton
          >
        </div>
        <div class="desk__limits">
          <BlessSlaTimer
            label="First reply"
            :due="limits.reply"
            :window="windowOf(open.created, limits.reply)"
            :warn="30"
            :now="NOW"
            :met="limits.replied"
          />
          <BlessSlaTimer
            label="Resolve"
            :due="limits.resolve"
            :window="windowOf(open.created, limits.resolve)"
            :warn="120"
            :now="NOW"
            :met="limits.resolved"
          />
        </div>
        <BlessField label="Priority" class="desk__priority">
          <BlessSelect
            :model-value="open.priority"
            :options="priorities"
            @update:model-value="(p) => p && setPriority(p)"
          />
        </BlessField>
        <BlessTicketView
          :key="open.id"
          :subject="open.subject"
          :number="`#${open.number}`"
          :customer="open.customer"
          :priority="open.priority"
          :messages="open.messages.map((m) => ({ ...m, time: stamp(m.at) }))"
          :status="open.status"
          @update:status="onStatus"
          @reply="onReply"
        />
      </section>
      <BlessEmpty v-else class="desk__ticket desk__none" title="No ticket open">
        Pick a ticket in the queue.
      </BlessEmpty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  BlessBadge,
  BlessButton,
  BlessEmpty,
  BlessField,
  BlessSelect,
  BlessSlaTimer,
  BlessTabs,
  BlessText,
  BlessTicketView,
  useToast,
  type BlessTicketPriority,
  type BlessTicketStatus,
} from "blessing-ui";
import { mockSupportApi } from "./api";
import { nextDeadline, type Hours, type Ticket } from "./domain";
import { useSupport } from "./useSupport";

// the team works Monday to Friday, 09:00 to 17:00 in Jakarta; "now" is Monday morning
const HOURS: Hours = { days: [0, 1, 2, 3, 4], open: 9 * 60, close: 17 * 60, offset: 7 * 60 };
const NOW = "2026-11-23T03:30:00Z";
const { solved, shown, openId, open, limits, reply, setStatus, setPriority } = useSupport(
  mockSupportApi,
  HOURS,
);
const { toast } = useToast();

const PRIORITY: Record<BlessTicketPriority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};
const COLOR = { urgent: "danger", high: "warning", normal: "info", low: "text" } as const;
const priorities = Object.entries(PRIORITY).map(([value, label]) => ({
  value: value as BlessTicketPriority,
  label,
}));
const tabs = [
  { value: "open", label: "To do" },
  { value: "solved", label: "Solved" },
];
const view = computed({
  get: () => (solved.value ? "solved" : "open"),
  set: (v: string) => (solved.value = v === "solved"),
});

const fmt = (o: Intl.DateTimeFormatOptions) => (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", ...o }).format(Date.parse(iso));
const stamp = fmt({
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const clock = fmt({ weekday: "short", hour: "2-digit", minute: "2-digit" });
const windowOf = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / 60_000;
function dueText(t: Ticket) {
  const d = nextDeadline(t, HOURS);
  if (!d) return "Done";
  return d < NOW ? `Late since ${clock(d)}` : `Due ${clock(d)}`;
}

async function onReply(body: string, internal: boolean) {
  await reply(body, internal);
  toast({ title: internal ? "Note added" : "Reply sent", color: "success" });
}
async function onStatus(s: BlessTicketStatus) {
  await setStatus(s);
  if (s === "solved") toast({ title: `#${open.value?.number} is solved`, color: "success" });
}
</script>

<style scoped>
.desk {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 72rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.desk__body {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: var(--bless-space-6);
  align-items: start;
}
.desk__ticket {
  display: grid;
  gap: var(--bless-space-4);
  align-content: start;
}
.desk__list {
  margin: 0;
  padding: var(--bless-space-3) 0 0;
}
.desk__row {
  display: grid;
  gap: var(--bless-space-1);
  width: 100%;
  padding: var(--bless-space-3);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-sm);
  text-align: start;
  cursor: pointer;
}
.desk__row:hover,
.desk__row[aria-current] {
  background: var(--bless-color-surface-2);
}
.desk__row[aria-current] {
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.desk__row:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.desk__line {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.desk__muted {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.desk__limits {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bless-space-4);
}
.desk__priority {
  max-width: 12rem;
}
.desk__back {
  display: none;
}
@media (max-width: 760px) {
  .desk {
    padding-inline: var(--bless-space-4);
  }
  /* a phone shows one pane: the queue, or the open ticket */
  .desk__body {
    grid-template-columns: 1fr;
  }
  .desk__body.is-open .desk__queue,
  .desk__body:not(.is-open) .desk__ticket {
    display: none;
  }
  .desk__back {
    display: block;
  }
  .desk__limits {
    grid-template-columns: 1fr;
  }
}
</style>
