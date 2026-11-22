import { computed, onMounted, ref } from "vue";
import type { BlessApprovalStep, BlessTimeEntry } from "blessing-ui";
import type { TimesheetApi } from "./api";
import { overtimePay, week } from "./domain";

/** the entries of a week, the hours of each day, the overtime pay, and the approval */
export function useTimesheet(api: TimesheetApi, monday: string, offset: number) {
  const list = ref<BlessTimeEntry[]>([]);
  const monthly = ref(0);
  const earlier = ref(0);
  onMounted(async () => {
    ({ entries: list.value, monthly: monthly.value, earlier: earlier.value } = await api.load());
  });

  const steps = ref<BlessApprovalStep[]>([]);
  const sent = computed(() => steps.value.length > 0);
  /** the entries; a change saves them, and a sent week does not change */
  const entries = computed({
    get: () => list.value,
    set: (v) => {
      if (sent.value) return;
      list.value = v;
      api.save(v);
    },
  });

  const days = computed(() => week(list.value, monday, offset));
  const pay = computed(() => overtimePay(days.value, monthly.value));
  async function submit() {
    steps.value = await api.submit(monday);
  }

  return { entries, monthly, earlier, days, pay, steps, sent, submit };
}
