<script setup lang="ts">
import {
  BlessBalanceCard,
  BlessBudgetBars,
  BlessButton,
  BlessField,
  BlessForm,
  BlessInput,
  BlessInputNumber,
  BlessPinPad,
  BlessSheet,
  BlessText,
  BlessTransactionList,
  useToast,
} from "blessing-ui";
import { mockBankApi } from "./api";
import { useBank } from "./useBank";

const money = { currency: "IDR", locale: "en-ID" } as const;
const {
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
} = useBank(mockBankApi, "2026-11-19");
const { toast } = useToast();
async function onPin(code: string) {
  if (await confirm(code))
    toast({ title: "Transfer sent", description: `To ${transfer.value.to}`, color: "success" });
}
</script>

<template>
  <div class="bank">
    <div class="bank__side">
      <BlessBalanceCard
        label="Circle account"
        :amount="balance"
        v-bind="money"
        :change
        period="this week"
      >
        <BlessButton size="sm" @click="start">Transfer</BlessButton>
        <BlessButton size="sm" variant="outline">Statement</BlessButton>
      </BlessBalanceCard>
      <section aria-labelledby="bank-budget">
        <BlessText id="bank-budget" as="h2" size="sm" weight="bold" class="bank__h"
          >November budget</BlessText
        >
        <BlessBudgetBars :budgets v-bind="money" />
      </section>
    </div>
    <section class="bank__main" aria-labelledby="bank-recent">
      <BlessText id="bank-recent" as="h2" size="sm" weight="bold" class="bank__h">Recent</BlessText>
      <BlessTransactionList :transactions v-bind="money" />
    </section>

    <BlessSheet v-model="open" side="right" title="Transfer">
      <BlessForm v-if="step === 'form'" @submit="next">
        <BlessField label="To" required :error="error && !transfer.to.trim() ? error : undefined">
          <BlessInput v-model="transfer.to" required placeholder="Name or account number" />
        </BlessField>
        <BlessField
          label="Amount"
          required
          :error="error && transfer.to.trim() ? error : undefined"
        >
          <BlessInputNumber
            v-model="transfer.amount"
            :min="0"
            :step="50000"
            prefix="Rp"
            :locale="money.locale"
          />
        </BlessField>
        <BlessButton type="submit">Next</BlessButton>
      </BlessForm>
      <div v-else class="bank__pin">
        <BlessText as="p" size="sm"
          >Enter your PIN to send the money. In this demo, the PIN is 1984.</BlessText
        >
        <BlessPinPad v-model="pin" :invalid="wrongPin" @finish="onPin" />
        <BlessText as="p" size="sm" aria-live="polite" class="bank__wrong">{{
          wrongPin ? "Wrong PIN. Try again." : ""
        }}</BlessText>
        <BlessButton variant="ghost" @click="step = 'form'">Back</BlessButton>
      </div>
    </BlessSheet>
  </div>
</template>

<style scoped>
.bank {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 1.4fr);
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
.bank__side,
.bank__main {
  display: grid;
  gap: var(--bless-space-4);
  min-width: 0;
}
.bank__h {
  margin: 0 0 var(--bless-space-2);
}
.bank__pin {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-3);
  text-align: center;
}
.bank__wrong {
  min-height: 1.6em;
  margin: 0;
}
@media (max-width: 760px) {
  .bank {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
}
</style>
