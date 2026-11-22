import { computed, onMounted, ref, watch } from "vue";
import type { BlessSlot } from "blessing-ui";
import type { BookingApi } from "./api";
import { closed, endOf, type Details, type Service } from "./domain";

export const steps = [{ label: "Time" }, { label: "Details" }];

/** the choice of service, day, and time, then the details and the booking. `today` is YYYY-MM-DD */
export function useBooking(api: BookingApi, today: string) {
  const services = ref<Service[]>([]);
  onMounted(async () => {
    services.value = await api.services();
    service.value = services.value[0].id;
  });

  const service = ref("");
  const date = ref<string>();
  const time = ref<string | null>(null);
  const slots = ref<BlessSlot[]>([]);
  const loading = ref(false);
  // a new service or day has other free times: load them, and forget the time picked before
  watch([service, date], async ([s, d]) => {
    time.value = null;
    slots.value = [];
    if (!s || !d) return;
    loading.value = true;
    slots.value = await api.slots(s, d);
    loading.value = false;
  });
  const chosen = computed(() => services.value.find((s) => s.id === service.value));
  const isClosed = (iso: string) => closed(iso, today);

  const step = ref(0);
  const problem = ref("");
  function next() {
    problem.value = !date.value ? "Pick a day." : !time.value ? "Pick a time." : "";
    if (!problem.value) step.value = 1;
  }

  const sending = ref(false);
  const bookingId = ref("");
  async function book(details: Details) {
    sending.value = true;
    problem.value = "";
    try {
      bookingId.value = await api.book({
        ...details,
        service: service.value,
        date: date.value!,
        time: time.value!,
      });
    } catch (e) {
      // the time is gone: back to the times, with the reason
      problem.value = (e as Error).message;
      step.value = 0;
      slots.value = slots.value.map((s) => (s.time === time.value ? { ...s, disabled: true } : s));
      time.value = null;
    } finally {
      sending.value = false;
    }
  }
  /** after a booking: start again with a new day */
  function restart() {
    bookingId.value = "";
    step.value = 0;
    date.value = undefined;
  }
  const end = computed(() =>
    time.value && chosen.value ? endOf(time.value, chosen.value.minutes) : "",
  );

  return {
    services,
    service,
    chosen,
    date,
    time,
    end,
    slots,
    loading,
    isClosed,
    step,
    problem,
    next,
    sending,
    bookingId,
    book,
    restart,
  };
}
