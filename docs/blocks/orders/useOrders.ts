import { computed, onMounted, ref } from "vue";
import type { OrdersApi } from "./api";
import { canCancel, canReturn, type Order } from "./domain";

/** the past orders, the open one, and the actions on it. `today` is YYYY-MM-DD */
export function useOrders(api: OrdersApi, today: string) {
  const orders = ref<Order[]>([]);
  onMounted(async () => (orders.value = await api.list()));

  const openId = ref("");
  const order = computed(() => orders.value.find((o) => o.id === openId.value));
  const returnable = computed(() => !!order.value && canReturn(order.value, today));
  const cancellable = computed(() => !!order.value && canCancel(order.value));

  async function cancel() {
    await api.cancel(order.value!.id);
    order.value!.status = "cancelled";
  }
  async function buyAgain(id: string) {
    const o = orders.value.find((x) => x.id === id)!;
    await api.buyAgain(id);
    return o.items.reduce((n, i) => n + i.quantity, 0);
  }
  async function requestReturn(items: { id: string; quantity: number }[], reason: string) {
    order.value!.returned = await api.requestReturn(order.value!.id, items, reason);
  }

  return { orders, openId, order, returnable, cancellable, cancel, buyAgain, requestReturn };
}
