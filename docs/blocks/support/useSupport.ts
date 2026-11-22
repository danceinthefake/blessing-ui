import { computed, onMounted, ref } from "vue";
import type { BlessTicketPriority, BlessTicketStatus } from "blessing-ui";
import type { SupportApi } from "./api";
import { deadlines, queue, type Hours, type Ticket } from "./domain";

/** the queue by the nearest deadline, the open ticket, and its replies */
export function useSupport(api: SupportApi, hours: Hours) {
  const tickets = ref<Ticket[]>([]);
  const openId = ref("");
  const solved = ref(false);
  onMounted(async () => {
    tickets.value = await api.tickets();
    openId.value = queue(tickets.value, false, hours)[0]?.id ?? "";
  });

  const shown = computed(() => queue(tickets.value, solved.value, hours));
  const open = computed(() => tickets.value.find((t) => t.id === openId.value));
  const limits = computed(() => (open.value ? deadlines(open.value, hours) : undefined));
  const due = (t: Ticket) => deadlines(t, hours);

  async function reply(body: string, internal: boolean) {
    const t = open.value!;
    t.messages.push(await api.reply(t.id, body, internal));
  }
  async function setStatus(s: BlessTicketStatus) {
    open.value!.status = s;
    await api.setStatus(open.value!.id, s);
  }
  async function setPriority(p: BlessTicketPriority) {
    open.value!.priority = p;
    await api.setPriority(open.value!.id, p);
  }

  return { tickets, solved, shown, openId, open, limits, due, reply, setStatus, setPriority };
}
