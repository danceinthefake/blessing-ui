import { computed, onMounted, ref } from "vue";
import type { BlessTransaction } from "blessing-ui";
import { check, toTransaction, type Budget, type Transfer } from "./domain";
import type { BankApi } from "./api";

/** the account and the two steps of a transfer: the form, then the PIN */
export function useBank(api: BankApi, today: string) {
  const balance = ref(0);
  const transactions = ref<BlessTransaction[]>([]);
  const budgets = ref<Budget[]>([]);
  onMounted(async () => {
    [balance.value, transactions.value, budgets.value] = await Promise.all([
      api.balance(),
      api.transactions(),
      api.budgets(),
    ]);
  });
  const change = computed(() => transactions.value.reduce((n, t) => n + t.amount, 0));

  const open = ref(false);
  const step = ref<"form" | "pin">("form");
  const transfer = ref<Transfer>({ to: "", amount: 0 });
  const error = ref("");
  const pin = ref("");
  const wrongPin = ref(false);
  function start() {
    transfer.value = { to: "", amount: 0 };
    step.value = "form";
    error.value = "";
    pin.value = "";
    open.value = true;
  }
  function next() {
    error.value = check(transfer.value, balance.value);
    if (!error.value) step.value = "pin";
  }
  /** resolves true when the money moved */
  async function confirm(code: string) {
    if (!(await api.send(transfer.value, code))) {
      wrongPin.value = true;
      setTimeout(() => (pin.value = ""), 600);
      return false;
    }
    wrongPin.value = false;
    balance.value -= transfer.value.amount;
    transactions.value.unshift(toTransaction(transfer.value, `n${Date.now()}`, today));
    open.value = false;
    return true;
  }
  return {
    balance,
    transactions,
    budgets,
    change,
    open,
    step,
    transfer,
    error,
    pin,
    wrongPin,
    start,
    next,
    confirm,
  };
}
