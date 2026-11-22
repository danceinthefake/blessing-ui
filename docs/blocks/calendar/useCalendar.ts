import { computed, onMounted, ref } from "vue";
import type { BlessRsvpAnswer } from "blessing-ui";
import type { CalendarApi } from "./api";
import { addDays, clashes, occurrences, type CalEvent } from "./domain";

/** the events of the month on screen, seen from a zone you pick. `month` is any day of the month */
export function useCalendar(api: CalendarApi, month: string, zone: string) {
  const events = ref<CalEvent[]>([]);
  onMounted(async () => (events.value = await api.events()));
  const anchor = ref(month);
  const viewZone = ref(zone);

  // the six weeks a month grid can show
  const range = computed(() => {
    const first = `${anchor.value.slice(0, 7)}-01`;
    return [addDays(first, -7), addDays(first, 42)] as const;
  });
  const shown = computed(() =>
    occurrences(events.value, range.value[0], range.value[1], viewZone.value),
  );

  const openId = ref("");
  const open = computed(() => shown.value.find((o) => o.id === openId.value));

  const overlaps = (draft: Omit<CalEvent, "id">) =>
    clashes({ ...draft, id: "" }, events.value, viewZone.value);
  async function create(draft: Omit<CalEvent, "id">) {
    const e = await api.create({ ...draft, zone: viewZone.value });
    events.value.push(e);
    anchor.value = e.date;
    return e;
  }
  async function answer(id: string, a: BlessRsvpAnswer | undefined) {
    const e = events.value.find((x) => x.id === id)!;
    const before = e.answer;
    e.answer = a;
    try {
      await api.answer(id, a);
    } catch {
      e.answer = before;
    }
  }

  return { events, anchor, viewZone, shown, openId, open, overlaps, create, answer };
}
