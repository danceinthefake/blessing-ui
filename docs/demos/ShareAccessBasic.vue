<script setup lang="ts">
import { ref } from "vue";
import { BlessShareAccess, type BlessAccessRole, type BlessSharePerson } from "blessing-ui";

const people = ref<BlessSharePerson[]>([
  { id: "1", name: "Ana Putri", email: "ana@example.com", role: "owner" },
  { id: "2", name: "Budi Santoso", email: "budi@example.com", role: "edit" },
  { id: "3", name: "Sari Wulandari", email: "sari@example.com", role: "comment" },
]);
const linkAccess = ref<"restricted" | BlessAccessRole>("restricted");
const invite = (email: string, role: BlessAccessRole) =>
  people.value.push({ id: email, name: email.split("@")[0]!, email, role });
</script>

<template>
  <BlessShareAccess
    v-model:people="people"
    v-model:link-access="linkAccess"
    link="https://example.com/docs/q4-plan"
    @invite="invite"
  />
</template>
