<template>
  <div class="checkout">
    <section
      v-if="orderId"
      ref="panel"
      tabindex="-1"
      class="checkout__done"
      aria-labelledby="checkout-done"
    >
      <BlessText id="checkout-done" as="h1" size="lg" weight="light">Thank you</BlessText>
      <BlessText as="p">
        Order <strong>{{ orderId }}</strong> is placed. A confirmation is on its way to your email.
      </BlessText>
      <BlessButton href="#" variant="outline">Keep shopping</BlessButton>
    </section>
    <template v-else>
      <div class="checkout__main">
        <BlessText as="h1" size="lg" weight="light">Checkout</BlessText>
        <BlessSteps v-model="step" :steps clickable label="Checkout steps" />
        <section ref="panel" tabindex="-1" class="checkout__panel" :aria-label="steps[step].label">
          <BlessAddressFields v-if="step === 0" v-model="address" label="Delivery address" />
          <BlessDeliveryPicker
            v-else-if="step === 1"
            v-model="window"
            :days
            currency="IDR"
            locale="en-ID"
          />
          <div v-else class="checkout__card">
            <BlessField label="Card number">
              <BlessCardInput v-model="card.number" validate />
            </BlessField>
            <BlessGrid :columns="2">
              <BlessField label="Expiry date" description="MM/YY">
                <BlessInput v-model="card.expiry" inputmode="numeric" autocomplete="cc-exp" />
              </BlessField>
              <BlessField label="Security code">
                <BlessInput v-model="card.cvc" inputmode="numeric" autocomplete="cc-csc" />
              </BlessField>
            </BlessGrid>
            <BlessText as="p" size="xs" muted
              >Test cards: 4242 4242 4242 4242 pays, 4000 0000 0000 0002 is declined.</BlessText
            >
          </div>
          <BlessAlert v-if="problem" color="danger" class="checkout__problem">{{
            problem
          }}</BlessAlert>
        </section>
        <div class="checkout__actions">
          <BlessButton v-if="step > 0" variant="outline" @click="back">Back</BlessButton>
          <BlessButton :loading="placing" @click="next">{{
            step === steps.length - 1 ? `Pay ${money.format(total)}` : "Continue"
          }}</BlessButton>
        </div>
      </div>
      <aside class="checkout__aside" aria-label="Your order">
        <BlessOrderSummary
          :lines
          currency="IDR"
          locale="en-ID"
          :discount
          :discount-label="coupon?.code"
          :shipping
          :tax
        />
        <BlessCouponInput
          :applied="coupon && { code: coupon.code, saving: `${coupon.percent}% off` }"
          :error="couponError"
          :loading="couponLoading"
          uppercase
          @apply="applyCoupon"
          @remove="coupon = undefined"
        />
        <BlessText as="p" size="xs" muted>Try the code BLESS10.</BlessText>
      </aside>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import {
  BlessAddressFields,
  BlessAlert,
  BlessButton,
  BlessCardInput,
  BlessCouponInput,
  BlessDeliveryPicker,
  BlessField,
  BlessGrid,
  BlessInput,
  BlessOrderSummary,
  BlessSteps,
  BlessText,
} from "blessing-ui";
import { mockCheckoutApi } from "./api";
import { steps, useCheckout } from "./useCheckout";

const {
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
} = useCheckout(mockCheckoutApi, "2026-11-22");

const money = new Intl.NumberFormat("en-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

// a new step or the thanks replaces the panel: focus follows it, so a screen reader hears where it is
const panel = ref<HTMLElement>();
watch([step, orderId], () => {
  if (!orderId.value) problem.value = "";
  nextTick(() => panel.value?.focus());
});
</script>

<style scoped>
.checkout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: var(--bless-space-8);
  padding: var(--bless-space-8) var(--bless-space-6);
}
.checkout__main {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
}
.checkout__panel {
  display: grid;
  gap: var(--bless-space-4);
}
.checkout__panel:focus,
.checkout__done:focus {
  outline: none;
}
.checkout__card {
  display: grid;
  gap: var(--bless-space-4);
}
.checkout__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-2);
}
.checkout__aside {
  display: grid;
  gap: var(--bless-space-4);
  align-content: start;
  position: sticky;
  top: var(--bless-space-4);
  align-self: start;
}
.checkout__done {
  grid-column: 1 / -1;
  display: grid;
  gap: var(--bless-space-4);
  justify-items: start;
  max-width: 36rem;
}
@media (max-width: 760px) {
  .checkout {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: var(--bless-space-4);
  }
  .checkout__aside {
    position: static;
  }
}
</style>
