import { computed, onMounted, ref } from "vue";
import type { MeetApi } from "./api";
import { best, cells, counts, type Person, type Slot } from "./domain";

/** a poll for a meeting time: your free times, everyone's, and the best times to book */
export function useMeet(
  api: MeetApi,
  me: string,
  hours: { from: number; to: number; step: number },
) {
  const title = ref("");
  const days = ref<string[]>([]);
  const people = ref<Person[]>([]);
  onMounted(async () => {
    ({ title: title.value, days: days.value, people: people.value } = await api.poll());
  });

  const times = cells(hours.from, hours.to, hours.step);
  const length = ref(60);
  const mine = computed({
    get: () => people.value.find((p) => p.id === me)?.free ?? [],
    set: (free) => {
      people.value.find((p) => p.id === me)!.free = free;
      api.saveFree(me, free);
    },
  });
  const heat = computed(() => counts(people.value, days.value, times));
  const top = computed(() => best(people.value, days.value, times, hours.step, length.value));

  const booked = ref<Slot>();
  async function book(s: Slot) {
    await api.book(s);
    booked.value = s;
  }

  return { title, days, people, times, length, mine, heat, top, booked, book };
}
