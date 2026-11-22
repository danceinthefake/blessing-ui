import { computed, onMounted, ref } from "vue";
import type { StatusApi, StatusData } from "./api";
import { checkEmail, daysOf, history, planned, stateOf, uptime } from "./domain";

/** the state of each part, its days, and the incidents. `offset` is the minutes from UTC to show */
export function useStatus(api: StatusApi, days: number, offset: number) {
  const data = ref<StatusData>();
  const busy = ref(false);
  async function refresh() {
    busy.value = true;
    data.value = await api.load();
    busy.value = false;
  }
  onMounted(refresh);

  const now = computed(() => (data.value ? Date.parse(data.value.checked) : 0));
  const parts = computed(() => {
    const d = data.value;
    if (!d) return [];
    return d.parts.map((p) => ({
      ...p,
      status: stateOf(p.id, d.incidents, d.maintenance, now.value),
      days: daysOf(p, d.incidents, now.value, days, offset),
      uptime: uptime(p, d.incidents, now.value, days, offset),
    }));
  });
  const open = computed(() => data.value?.incidents.filter((i) => !i.end) ?? []);
  const past = computed(() =>
    data.value ? history(data.value.incidents, now.value, days, offset) : [],
  );
  const coming = computed(() => (data.value ? planned(data.value.maintenance, now.value) : []));
  const nameOf = (id: string) => data.value?.parts.find((p) => p.id === id)?.name ?? id;

  /** resolves to the problem, or "" when it is saved */
  async function subscribe(email: string, ids: string[]) {
    const problem = checkEmail(email) || (ids.length ? "" : "Pick at least one part.");
    if (problem) return problem;
    await api.subscribe(email.trim(), ids);
    return "";
  }

  return { data, busy, refresh, now, parts, open, past, coming, nameOf, subscribe };
}
