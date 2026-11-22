<template>
  <div class="billing">
    <BlessText as="h1" size="lg" weight="light">Billing</BlessText>
    <BlessText v-if="!account" as="p" muted>Loading the account…</BlessText>
    <template v-else>
      <BlessAlert
        v-if="overdue.length"
        color="danger"
        title="An invoice is overdue"
        class="billing__overdue"
      >
        <p>You owe {{ money.format(owed) }}. Pay it to keep the Team features.</p>
        <BlessButton size="sm" @click="view(overdue[0].number)"
          >Pay {{ overdue[0].number }}</BlessButton
        >
      </BlessAlert>
      <div class="billing__cards">
        <BlessCard label="Plan">
          <div class="billing__card">
            <BlessText as="h2" size="lg" weight="bold">{{ plan?.name }}</BlessText>
            <BlessText as="p">{{ money.format(plan?.price ?? 0) }} a month</BlessText>
            <BlessText as="p" size="sm" muted>
              {{
                account.ends ? `Ends on ${day(account.ends)}` : `Renews on ${day(account.renews)}`
              }}
            </BlessText>
            <div class="billing__actions">
              <template v-if="!account.ends">
                <BlessButton size="sm" @click="startChange">Change plan</BlessButton>
                <BlessButton size="sm" variant="ghost" @click="cancelling = true"
                  >Cancel plan</BlessButton
                >
              </template>
              <BlessButton v-else size="sm" :loading="busy" @click="onResume"
                >Keep the plan</BlessButton
              >
            </div>
          </div>
        </BlessCard>
        <BlessCard label="Usage">
          <BlessQuotaUsage
            :quotas="[
              { label: 'Seats', used: account.usage.seats, limit: plan?.seats ?? 0 },
              {
                label: 'Storage',
                used: account.usage.storage,
                limit: plan?.storage ?? 0,
                unit: 'GB',
              },
            ]"
            locale="en-ID"
          />
        </BlessCard>
        <BlessCard label="Card">
          <div class="billing__card">
            <BlessText as="p" weight="bold"
              >{{ account.card.brand }} ending in {{ account.card.last4 }}</BlessText
            >
            <BlessText as="p" size="sm" muted>Expires {{ account.card.expires }}</BlessText>
          </div>
        </BlessCard>
      </div>
      <section class="billing__bills" aria-labelledby="billing-bills">
        <BlessText id="billing-bills" as="h2" size="md" weight="bold">Invoices</BlessText>
        <BlessTable :columns :rows row-key="number">
          <template #cell-number="{ value }">
            <BlessButton size="sm" variant="ghost" @click="view(String(value))">{{
              value
            }}</BlessButton>
          </template>
        </BlessTable>
      </section>
    </template>

    <BlessSheet v-model="open" :title="shown?.number" size="40rem">
      <BlessInvoice
        v-if="shown"
        v-bind="shown"
        :from="{ name: 'Awan Kerja', lines: ['Jl. Dago 88', 'Bandung 40135'] }"
        :to="{ name: 'Toko Senja', lines: ['Jl. Riau 5', 'Bandung 40115'] }"
        currency="IDR"
        locale="en-ID"
      />
      <template v-if="shown && shown.status !== 'paid'" #footer>
        <BlessButton :loading="busy" @click="onPay"
          >Pay {{ money.format(total(shown)) }} with {{ account?.card.brand }}
          {{ account?.card.last4 }}</BlessButton
        >
      </template>
    </BlessSheet>
    <BlessModal v-model="changing" title="Change plan" size="sm">
      <div class="billing__change">
        <BlessRadioGroup v-model="next" label="Plan">
          <BlessRadio
            v-for="p in account?.plans"
            :key="p.id"
            :value="p.id"
            :description="`${money.format(p.price)} a month · ${p.seats} seats · ${p.storage} GB`"
            >{{ p.name }}</BlessRadio
          >
        </BlessRadioGroup>
        <BlessAlert v-if="problem" color="danger" class="billing__problem">{{
          problem
        }}</BlessAlert>
        <BlessButton :loading="busy" @click="onChange">Save</BlessButton>
      </div>
    </BlessModal>
    <BlessAlertDialog
      v-model="cancelling"
      title="Cancel the plan?"
      :description="`You keep it until ${day(account?.renews ?? '')}. After that, the team cannot sign in.`"
      :labels="{ confirm: 'Cancel plan', cancel: 'Keep it' }"
      :loading="busy"
      @confirm="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BlessAlert,
  BlessAlertDialog,
  BlessButton,
  BlessCard,
  BlessInvoice,
  BlessModal,
  BlessQuotaUsage,
  BlessRadio,
  BlessRadioGroup,
  BlessSheet,
  BlessTable,
  BlessText,
  useToast,
} from "blessing-ui";
import { mockBillingApi } from "./api";
import { useBilling } from "./useBilling";

const { account, plan, total, overdue, owed, changePlan, cancel, resume, pay } =
  useBilling(mockBillingApi);
const { toast } = useToast();
const money = new Intl.NumberFormat("en-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const day = (iso: string) =>
  iso
    ? new Intl.DateTimeFormat("en-ID", { dateStyle: "long", timeZone: "UTC" }).format(
        new Date(`${iso}T00:00:00Z`),
      )
    : "";
const STATUS = { draft: "Draft", sent: "Sent", paid: "Paid", overdue: "Overdue" };

const columns = [
  { key: "number" as const, label: "Invoice", header: true },
  { key: "issued" as const, label: "Issued" },
  { key: "amount" as const, label: "Amount", align: "right" as const },
  { key: "status" as const, label: "Status" },
];
const rows = computed(() =>
  (account.value?.bills ?? []).map((b) => ({
    number: b.number,
    issued: day(b.issued),
    amount: money.format(total(b)),
    status: STATUS[b.status],
  })),
);

const busy = ref(false);
async function run(job: () => Promise<unknown>) {
  busy.value = true;
  try {
    return await job();
  } finally {
    busy.value = false;
  }
}

const open = ref(false);
const shownNumber = ref("");
const shown = computed(() => account.value?.bills.find((b) => b.number === shownNumber.value));
function view(number: string) {
  shownNumber.value = number;
  open.value = true;
}
async function onPay() {
  await run(() => pay(shown.value!));
  open.value = false;
  toast({ title: `${shownNumber.value} is paid`, color: "success" });
}

const changing = ref(false);
const next = ref("");
const problem = ref("");
function startChange() {
  next.value = account.value!.plan;
  problem.value = "";
  changing.value = true;
}
async function onChange() {
  problem.value = (await run(() => changePlan(next.value))) as string;
  if (problem.value) return;
  changing.value = false;
  toast({ title: `You are on ${plan.value!.name} now`, color: "success" });
}

const cancelling = ref(false);
async function onCancel() {
  await run(cancel);
  cancelling.value = false;
}
const onResume = () => run(resume);
</script>

<style scoped>
.billing {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.billing__overdue p {
  margin: 0 0 var(--bless-space-3);
}
.billing__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--bless-space-4);
}
.billing__card {
  display: grid;
  gap: var(--bless-space-2);
  justify-items: start;
}
.billing__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-2);
}
.billing__bills,
.billing__change {
  display: grid;
  gap: var(--bless-space-4);
}
.billing__change {
  justify-items: start;
}
@media (max-width: 760px) {
  .billing {
    padding-inline: var(--bless-space-4);
  }
}
</style>
