<script setup lang="ts">
import { ref } from "vue";
import { BlessDocumentChecklist, type BlessChecklistDoc } from "blessing-ui";

const docs = ref<BlessChecklistDoc[]>([
  {
    id: "ktp",
    name: "Identity card (KTP)",
    required: true,
    state: "accepted",
    file: "ktp-ana.jpg",
  },
  {
    id: "npwp",
    name: "Tax number card (NPWP)",
    required: true,
    state: "checking",
    file: "npwp.pdf",
  },
  {
    id: "lease",
    name: "Lease of the place",
    hint: "All pages, signed by you and the owner.",
    required: true,
    accept: ".pdf,image/*",
    state: "rejected",
    file: "lease.pdf",
    reason: "Page 2 is missing. Send the full lease again.",
  },
  {
    id: "photo",
    name: "Photo of the front of the place",
    required: true,
    accept: "image/*",
    state: "missing",
  },
  {
    id: "plan",
    name: "Floor plan",
    hint: "Only for places over 100 m².",
    accept: ".pdf",
    state: "missing",
  },
]);
function upload(id: string, file: File) {
  docs.value = docs.value.map((d) =>
    d.id === id ? { ...d, state: "uploaded", file: file.name, reason: undefined } : d,
  );
}
function remove(id: string) {
  docs.value = docs.value.map((d) =>
    d.id === id ? { ...d, state: "missing", file: undefined } : d,
  );
}
</script>

<template>
  <BlessDocumentChecklist :docs @upload="upload" @remove="remove" />
</template>
