<template>
  <div class="orders">
    <BlessText as="h1" size="lg" weight="light">Your orders</BlessText>
    <BlessText v-if="!orders.length" as="p" muted>Loading your orders…</BlessText>
    <BlessOrderHistory v-else :orders="past" currency="IDR" locale="en-ID" @again="onAgain" />

    <BlessSheet
      :model-value="!!order"
      :title="order ? `Order ${order.number}` : ''"
      size="34rem"
      @update:model-value="(v: boolean) => !v && close()"
    >
      <div v-if="order" class="orders__sheet">
        <BlessText as="p" size="sm" muted
          >Placed on {{ day(order.placed) }} · {{ money.format(total(order)) }}</BlessText
        >
        <BlessAlert v-if="order.status === 'cancelled'" title="This order is cancelled">
          You were not charged for it.
        </BlessAlert>
        <BlessShipmentTracker
          v-else
          :stage="order.stage"
          :events="order.updates"
          :carrier="order.carrier"
          :tracking="order.tracking"
        />
        <section class="orders__items" aria-labelledby="orders-items">
          <BlessText id="orders-items" as="h3" size="sm" weight="bold">Items</BlessText>
          <ul role="list">
            <li v-for="i in order.items" :key="i.id">
              <span>{{ i.quantity }} × {{ i.name }}</span>
              <span>{{ money.format(i.quantity * i.price) }}</span>
            </li>
            <li>
              <span>Shipping</span>
              <span>{{ order.shipping ? money.format(order.shipping) : "Free" }}</span>
            </li>
          </ul>
        </section>
        <BlessAlert v-if="order.returned" color="success" title="Return requested">
          Return {{ order.returned }}. We sent a label to your email. Drop the parcel at any Kilat
          Express point.
        </BlessAlert>
        <template v-else-if="returnable">
          <BlessReturnRequest
            v-if="returning"
            :items="order.items"
            currency="IDR"
            locale="en-ID"
            @submit="onReturn"
          />
          <BlessText v-else as="p" size="sm" muted
            >You can return items until {{ day(returnUntil(order)!) }}.</BlessText
          >
        </template>
        <BlessText v-else-if="order.status === 'delivered'" as="p" size="sm" muted
          >Returns closed on {{ day(returnUntil(order)!) }}.</BlessText
        >
      </div>
      <template v-if="order && (cancellable || (returnable && !returning))" #footer>
        <BlessButton v-if="cancellable" variant="outline" color="danger" @click="cancelling = true"
          >Cancel order</BlessButton
        >
        <BlessButton v-else variant="outline" @click="returning = true">Return items</BlessButton>
      </template>
    </BlessSheet>
    <BlessAlertDialog
      v-model="cancelling"
      :title="`Cancel order ${order?.number}?`"
      description="We stop it before it ships. You are not charged."
      :labels="{ confirm: 'Cancel order', cancel: 'Keep it' }"
      :loading="busy"
      @confirm="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  BlessAlert,
  BlessAlertDialog,
  BlessButton,
  BlessOrderHistory,
  BlessReturnRequest,
  BlessSheet,
  BlessShipmentTracker,
  BlessText,
  useToast,
  type BlessPastOrder,
  type BlessReturnPayload,
} from "blessing-ui";
import { mockOrdersApi } from "./api";
import { returnUntil, total } from "./domain";
import { useOrders } from "./useOrders";

const today = "2026-11-22";
const { orders, openId, order, returnable, cancellable, cancel, buyAgain, requestReturn } =
  useOrders(mockOrdersApi, today);
const { toast } = useToast();
const money = new Intl.NumberFormat("en-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const day = (iso: string) =>
  new Intl.DateTimeFormat("en-ID", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

// "View order" is a link to #order-<id>, so the open order survives a reload and the back button
const past = computed<BlessPastOrder[]>(() =>
  orders.value.map((o) => ({
    id: o.id,
    number: o.number,
    date: day(o.placed),
    status: o.status,
    total: total(o),
    items: o.items,
    href: `#order-${o.id}`,
  })),
);
const fromHash = () => (openId.value = location.hash.match(/^#order-(.+)$/)?.[1] ?? "");
onMounted(() => {
  fromHash();
  addEventListener("hashchange", fromHash);
});
onBeforeUnmount(() => removeEventListener("hashchange", fromHash));
function close() {
  history.replaceState(null, "", location.pathname + location.search);
  openId.value = "";
}

const returning = ref(false);
watch(openId, () => (returning.value = false));

const busy = ref(false);
const cancelling = ref(false);
async function onCancel() {
  busy.value = true;
  await cancel();
  busy.value = false;
  cancelling.value = false;
  toast({ title: `Order ${order.value!.number} is cancelled`, color: "success" });
}
async function onAgain(id: string) {
  const n = await buyAgain(id);
  toast({
    title: n === 1 ? "1 item is in your cart" : `${n} items are in your cart`,
    color: "success",
  });
}
async function onReturn(p: BlessReturnPayload) {
  await requestReturn(p.items, p.reason);
  returning.value = false;
}
</script>

<style scoped>
.orders {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 48rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.orders__sheet,
.orders__items {
  display: grid;
  gap: var(--bless-space-4);
}
.orders__items ul {
  display: grid;
  font-size: var(--bless-text-sm);
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.orders__items li {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.orders__items li:last-child {
  padding-top: var(--bless-space-2);
  border-top: 1px solid var(--bless-color-border);
  color: var(--bless-color-text-muted);
}
@media (max-width: 760px) {
  .orders {
    padding-inline: var(--bless-space-4);
  }
}
</style>
