<template>
  <BlessApprovalFlow :steps me="Ana Putri" style="max-width: 560px" @decide="decide" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessApprovalFlow, type BlessApprovalStep } from "blessing-ui";

// the sign-off of a sponsored episode before it goes out
const steps = ref<BlessApprovalStep[]>([
  {
    id: "edit",
    title: "Edit is final",
    approvers: [{ name: "Budi Santoso", decision: "approved", time: "15 Nov, 16:20" }],
  },
  {
    id: "producer",
    title: "Producer review",
    rule: "any",
    approvers: [
      { name: "Ana Putri" },
      { name: "Citra Dewi", decision: "pending", note: "I listen tonight." },
    ],
  },
  { id: "sponsor", title: "Sponsor check", approvers: [{ name: "Sponsor team" }] },
]);
// you are Ana in this example; a decision updates the step
function decide(id: string, decision: "approved" | "rejected", note: string) {
  steps.value = steps.value.map((s) =>
    s.id !== id
      ? s
      : {
          ...s,
          approvers: s.approvers.map((a) =>
            a.name === "Ana Putri" ? { ...a, decision, note: note || undefined, time: "now" } : a,
          ),
        },
  );
}
</script>
