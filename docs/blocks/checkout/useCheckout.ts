import { computed, onMounted, ref } from "vue";
import { luhn, type BlessDeliveryDay } from "blessing-ui";
import type { CheckoutApi } from "./api";
import {
  addressProblem,
  cardProblem,
  discountOf,
  subtotal,
  taxOf,
  type Address,
  type Card,
  type Coupon,
  type Line,
} from "./domain";

export const steps = [{ label: "Address" }, { label: "Delivery" }, { label: "Payment" }];

/** the cart, the three steps, and the order. `today` is YYYY-MM-DD, for the card expiry */
export function useCheckout(api: CheckoutApi, today: string) {
  const lines = ref<Line[]>([]);
  const days = ref<BlessDeliveryDay[]>([]);
  onMounted(async () => {
    [lines.value, days.value] = await Promise.all([api.cart(), api.deliveryDays()]);
  });

  const address = ref<Address>({ country: "ID" });
  const window = ref<string>();
  const card = ref<Card>({ number: "", expiry: "", cvc: "" });

  const coupon = ref<Coupon>();
  const couponError = ref("");
  const couponLoading = ref(false);
  async function applyCoupon(code: string) {
    couponLoading.value = true;
    couponError.value = "";
    try {
      coupon.value = await api.coupon(code);
    } catch (e) {
      couponError.value = (e as Error).message;
    } finally {
      couponLoading.value = false;
    }
  }

  const sub = computed(() => subtotal(lines.value));
  const discount = computed(() => discountOf(coupon.value, sub.value));
  const shipping = computed(
    () => days.value.flatMap((d) => d.windows).find((w) => w.id === window.value)?.fee,
  );
  const tax = computed(() => taxOf(sub.value - discount.value));
  const total = computed(() => sub.value - discount.value + (shipping.value ?? 0) + tax.value);

  const step = ref(0);
  const problem = ref("");
  const placing = ref(false);
  const orderId = ref("");
  const check = () =>
    [
      () => addressProblem(address.value),
      () => (window.value ? "" : "Pick a delivery time."),
      () => cardProblem(card.value, luhn(card.value.number.replace(/\D/g, "")), today),
    ][step.value]();

  /** goes to the next step, or places the order on the last one */
  async function next() {
    problem.value = check();
    if (problem.value) return;
    if (step.value < steps.length - 1) return void step.value++;
    placing.value = true;
    try {
      orderId.value = await api.place({
        lines: lines.value,
        address: address.value,
        window: window.value!,
        card: card.value,
        coupon: coupon.value?.code,
      });
    } catch (e) {
      problem.value = (e as Error).message;
    } finally {
      placing.value = false;
    }
  }
  function back() {
    problem.value = "";
    step.value--;
  }

  return {
    lines,
    days,
    address,
    window,
    card,
    coupon,
    couponError,
    couponLoading,
    applyCoupon,
    discount,
    shipping,
    tax,
    total,
    step,
    problem,
    placing,
    orderId,
    next,
    back,
  };
}
