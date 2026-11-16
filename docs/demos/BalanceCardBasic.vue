<script setup lang="ts">
import { BlessBalanceCard, BlessButton } from "blessing-ui";
</script>

<template>
  <div style="display: grid; gap: 16px; max-width: 360px">
    <BlessBalanceCard
      label="Studio account"
      :amount="18450000"
      currency="IDR"
      locale="id-ID"
      :change="2350000"
      period="this month"
    >
      <BlessButton size="sm">Transfer</BlessButton>
      <BlessButton size="sm" variant="outline">Top up</BlessButton>
    </BlessBalanceCard>
    <BlessBalanceCard label="Savings" :amount="3120.4" :change="-85.2" period="this week" />
  </div>
</template>
