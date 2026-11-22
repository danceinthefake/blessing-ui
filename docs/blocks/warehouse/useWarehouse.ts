import { computed, onMounted, ref } from "vue";
import type { BlessPickLine } from "blessing-ui";
import type { WarehouseApi } from "./api";
import { pickLines, receive, reorder, ship, type Item, type Order } from "./domain";

/** the stock, the orders to pick, and the deliveries that come in */
export function useWarehouse(api: WarehouseApi) {
  const items = ref<Item[]>([]);
  const orders = ref<Order[]>([]);
  const loaded = ref(false);
  onMounted(async () => {
    ({ items: items.value, orders: orders.value } = await api.load());
    loaded.value = true;
    if (orders.value[0]) pick(orders.value[0].id);
  });

  // picking: one order at a time
  const orderId = ref("");
  const lines = ref<BlessPickLine[]>([]);
  const order = computed(() => orders.value.find((o) => o.id === orderId.value));
  const picked = computed(
    () => lines.value.length > 0 && lines.value.every((l) => (l.picked ?? 0) >= l.quantity),
  );
  function pick(id: string) {
    orderId.value = id;
    const o = orders.value.find((x) => x.id === id);
    lines.value = o ? pickLines(o, items.value) : [];
  }
  async function shipOrder() {
    const o = order.value!;
    await api.ship(o.id);
    items.value = ship(items.value, o);
    orders.value = orders.value.filter((x) => x.id !== o.id);
    pick(orders.value[0]?.id ?? "");
    return o;
  }

  // receiving: each scan adds a count of the item
  const received = ref<{ id: number; name: string; count: number }[]>([]);
  async function scanIn(barcode: string, count: number) {
    const r = receive(items.value, barcode, count);
    if (r.problem !== undefined) return r.problem;
    await api.receive(r.item.sku, count);
    items.value = r.items;
    received.value.unshift({ id: Date.now(), name: r.item.name, count });
    return "";
  }

  const toOrder = computed(() => reorder(items.value));
  async function purchase() {
    return api.purchase(toOrder.value.map((r) => ({ sku: r.item.sku, quantity: r.quantity })));
  }

  return {
    loaded,
    items,
    orders,
    orderId,
    order,
    lines,
    picked,
    pick,
    shipOrder,
    received,
    scanIn,
    toOrder,
    purchase,
  };
}
