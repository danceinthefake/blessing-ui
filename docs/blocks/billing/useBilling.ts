import { computed, onMounted, ref } from "vue";
import { invoiceTotals } from "blessing-ui";
import type { BillingApi } from "./api";
import { moveProblem, type Account, type Bill } from "./domain";

/** the account, its plan and invoices, and the actions on them */
export function useBilling(api: BillingApi) {
  const account = ref<Account>();
  onMounted(async () => (account.value = await api.load()));

  const plan = computed(() => account.value?.plans.find((p) => p.id === account.value!.plan));
  const total = (b: Bill) => invoiceTotals(b.lines).total;
  const overdue = computed(() => account.value?.bills.filter((b) => b.status === "overdue") ?? []);
  const owed = computed(() => overdue.value.reduce((n, b) => n + total(b), 0));

  /** resolves to the reason when the plan cannot hold the account, else "" */
  async function changePlan(id: string) {
    const a = account.value!;
    const problem = moveProblem(
      a.plans.find((p) => p.id === id)!,
      a.usage,
    );
    if (problem) return problem;
    await api.changePlan(id);
    a.plan = id;
    return "";
  }
  async function cancel() {
    account.value!.ends = await api.cancel();
  }
  async function resume() {
    await api.resume();
    account.value!.ends = undefined;
  }
  async function pay(b: Bill) {
    await api.pay(b.number);
    b.status = "paid";
  }

  return { account, plan, total, overdue, owed, changePlan, cancel, resume, pay };
}
