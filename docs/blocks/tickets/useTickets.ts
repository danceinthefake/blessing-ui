import { computed, onMounted, ref } from "vue";
import type { BlessSeatRow, BlessSeatZone } from "blessing-ui";
import type { Show, TicketsApi } from "./api";
import { bestSeats, fee, markTaken, subtotal } from "./domain";

/** the seat map, the chosen seats and their price, and the hold that can lose a seat */
export function useTickets(api: TicketsApi) {
  const show = ref<Show>();
  const rows = ref<BlessSeatRow[]>([]);
  const zones = ref<BlessSeatZone[]>([]);
  onMounted(async () => {
    ({ show: show.value, rows: rows.value, zones: zones.value } = await api.load());
  });

  const chosen = ref<string[]>([]);
  const price = computed(() => subtotal(chosen.value, rows.value, zones.value));
  const charge = computed(() => fee(price.value));

  /** resolves to a problem, or "" when it found seats */
  function pickBest(zone: string, n: number) {
    const ids = bestSeats(rows.value, zone, n);
    if (!ids) return `No ${n} seats side by side are free there. Try fewer seats or another zone.`;
    chosen.value = ids;
    return "";
  }

  const tickets = ref<{ seat: string; code: string }[]>([]);
  /** resolves to a problem, or "" when the seats are paid */
  async function buy() {
    const { taken } = await api.hold(chosen.value);
    if (taken.length) {
      rows.value = markTaken(rows.value, taken);
      chosen.value = chosen.value.filter((id) => !taken.includes(id));
      return `${taken.join(" and ")} ${taken.length === 1 ? "was" : "were"} just taken by someone else. Pick another seat.`;
    }
    tickets.value = await api.pay(chosen.value);
    rows.value = markTaken(rows.value, chosen.value);
    chosen.value = [];
    return "";
  }

  return { show, rows, zones, chosen, price, charge, pickBest, tickets, buy };
}
