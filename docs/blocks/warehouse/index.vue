<template>
  <div class="wh">
    <BlessText as="h1" size="lg" weight="light">Warehouse</BlessText>
    <BlessText v-if="!loaded" as="p" muted>Loading…</BlessText>
    <BlessTabs v-else v-model="tab" :tabs label="Warehouse">
      <template #default="{ tab: t }">
        <div v-if="t.value === 'stock'" class="wh__panel">
          <BlessStockLevels :items locale="en-GB" />
          <div v-if="toOrder.length">
            <BlessButton @click="ordering = true">
              Order more of {{ toOrder.length }} {{ toOrder.length === 1 ? "item" : "items" }}
            </BlessButton>
          </div>
        </div>

        <div v-else-if="t.value === 'pick'" class="wh__panel">
          <BlessEmpty v-if="!orders.length" title="No orders to pick">
            New paid orders come here.
          </BlessEmpty>
          <template v-else>
            <BlessField label="Order" class="wh__order">
              <BlessSelect
                :model-value="orderId"
                :options="orders.map((o) => ({ value: o.id, label: `#${o.id}, ${o.customer}` }))"
                @update:model-value="(v) => v && pick(String(v))"
              />
            </BlessField>
            <BlessPickingList v-model="lines" :order="`#${orderId}`" />
            <div>
              <BlessButton :disabled="!picked" :loading="busy" @click="onShip">
                Ship #{{ orderId }}
              </BlessButton>
            </div>
          </template>
        </div>

        <div v-else class="wh__panel">
          <BlessText as="p" size="sm" muted>
            Scan each pack of a delivery. Each scan adds the count below to the stock.
          </BlessText>
          <BlessField label="Count for each scan" class="wh__count">
            <BlessInput v-model="count" type="number" min="1" />
          </BlessField>
          <BlessSkuField kind="barcode" label="Barcode" clear-on-scan @scan="onScan" />
          <BlessAlert v-if="problem" color="danger" title="Not added">{{ problem }}</BlessAlert>
          <ul v-if="received.length" role="list" class="wh__received" aria-label="Added now">
            <li v-for="r in received" :key="r.id">
              <BlessText as="span" size="sm"
                ><strong>+{{ r.count }}</strong> {{ r.name }}</BlessText
              >
            </li>
          </ul>
        </div>
      </template>
    </BlessTabs>

    <BlessModal v-model="ordering" title="Order more" size="sm">
      <div class="wh__panel">
        <BlessDescriptions
          :items="toOrder.map((r) => ({ label: r.item.name, value: `${r.quantity}` }))"
        />
        <BlessText as="p" size="sm" muted>
          Each item comes back to three times its reorder point.
        </BlessText>
        <div>
          <BlessButton :loading="busy" @click="onPurchase">Send to the supplier</BlessButton>
        </div>
      </div>
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessButton,
  BlessDescriptions,
  BlessEmpty,
  BlessField,
  BlessInput,
  BlessModal,
  BlessPickingList,
  BlessSelect,
  BlessSkuField,
  BlessStockLevels,
  BlessTabs,
  BlessText,
  useToast,
} from "blessing-ui";
import { mockWarehouseApi } from "./api";
import { useWarehouse } from "./useWarehouse";

const {
  loaded,
  items,
  orders,
  orderId,
  lines,
  picked,
  pick,
  shipOrder,
  received,
  scanIn,
  toOrder,
  purchase,
} = useWarehouse(mockWarehouseApi);
const { toast } = useToast();

const tabs = [
  { value: "stock", label: "Stock" },
  { value: "pick", label: "Pick" },
  { value: "receive", label: "Receive" },
];
const tab = ref("stock");
const busy = ref(false);

async function onShip() {
  busy.value = true;
  const o = await shipOrder();
  busy.value = false;
  toast({ title: `#${o.id} is shipped. The stock is less now.`, color: "success" });
}

const count = ref<string | number>(1);
const problem = ref("");
async function onScan(barcode: string) {
  problem.value = await scanIn(barcode, Number(count.value));
}

const ordering = ref(false);
async function onPurchase() {
  busy.value = true;
  const id = await purchase();
  busy.value = false;
  ordering.value = false;
  toast({ title: `${id} went to the supplier`, color: "success" });
}
</script>

<style scoped>
.wh {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 60rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.wh__panel {
  display: grid;
  gap: var(--bless-space-4);
  align-content: start;
}
.wh__order {
  max-width: 22rem;
}
.wh__count {
  max-width: 10rem;
}
.wh__received {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
}
@media (max-width: 760px) {
  .wh {
    padding-inline: var(--bless-space-4);
  }
}
</style>
