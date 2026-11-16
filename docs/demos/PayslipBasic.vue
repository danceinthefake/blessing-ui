<script setup lang="ts">
import { BlessPayslip } from "blessing-ui";
</script>

<template>
  <BlessPayslip
    company="Home Studio"
    :employee="{ name: 'Budi Santoso', id: 'EMP-007', role: 'Sound engineer' }"
    period="November 2026"
    pay-date="25 November 2026"
    :earnings="[
      { label: 'Base pay', amount: 9500000 },
      { label: 'Overtime, 6 hours', amount: 720000 },
      { label: 'Transport', amount: 500000 },
    ]"
    :deductions="[
      { label: 'Income tax', amount: 536000 },
      { label: 'Health insurance', amount: 95000 },
      { label: 'Pension', amount: 190000 },
    ]"
    currency="IDR"
    locale="id-ID"
  />
</template>
