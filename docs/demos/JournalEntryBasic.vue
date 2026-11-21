<template>
  <BlessJournalEntry
    v-model="lines"
    :accounts
    currency="IDR"
    locale="id-ID"
    @post="posted = true"
  />
  <p v-if="posted" style="margin-top: 12px">The entry is posted.</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessJournalEntry, type BlessJournalLine } from "blessing-ui";

const accounts = [
  { code: "1100", name: "Cash in bank" },
  { code: "1200", name: "Accounts receivable" },
  { code: "2100", name: "Tax payable" },
  { code: "4000", name: "Sponsor income" },
  { code: "6100", name: "Studio gear" },
];
// a sponsor paid an invoice of Rp 3.330.000, with 11% tax; one line is still missing
const lines = ref<BlessJournalLine[]>([
  { id: "1", account: "1100", debit: 3330000, memo: "INV-2026-0042" },
  { id: "2", account: "4000", credit: 3000000, memo: "Sponsored episode" },
  { id: "3", account: "", memo: "Tax, 11%" },
]);
const posted = ref(false);
</script>
