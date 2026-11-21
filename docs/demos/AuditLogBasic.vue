<template>
  <BlessAuditLog :entries style="max-width: 600px" />
</template>

<script setup lang="ts">
import { BlessAuditLog, type BlessAuditEntry } from "blessing-ui";

const entries: BlessAuditEntry[] = [
  {
    id: "5",
    who: "Ana Putri",
    when: "16 Nov, 10:42",
    action: "updated",
    target: "INV-2026-0042",
    changes: [
      { field: "Status", from: "Sent", to: "Paid" },
      { field: "Paid on", to: "16 Nov 2026" },
    ],
  },
  {
    id: "4",
    who: "Budi Santoso",
    when: "16 Nov, 09:05",
    action: "viewed",
    target: "INV-2026-0042",
    source: "Mobile app",
  },
  {
    id: "3",
    who: "Billing robot",
    when: "15 Nov, 23:00",
    action: "updated",
    target: "INV-2026-0042",
    source: "API",
    changes: [{ field: "Due date", from: "20 Nov 2026", to: "25 Nov 2026" }],
  },
  { id: "2", who: "Citra Dewi", when: "14 Nov, 14:12", action: "created", target: "INV-2026-0042" },
  {
    id: "1",
    who: "Citra Dewi",
    when: "14 Nov, 14:10",
    action: "deleted",
    target: "INV-2026-0041 (a draft)",
  },
];
</script>
