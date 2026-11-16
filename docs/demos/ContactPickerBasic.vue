<script setup lang="ts">
import { ref } from "vue";
import { BlessContactPicker, type BlessContact } from "blessing-ui";

const contacts: BlessContact[] = [
  { id: "ana", name: "Ana Putri", detail: "ana@homestudio.example" },
  { id: "budi", name: "Budi Santoso", detail: "Sound engineer" },
  { id: "citra", name: "Citra Dewi", detail: "Producer" },
  { id: "dimas", name: "Dimas Pratama", detail: "+62 812 555 0104" },
  { id: "eka", name: "Eka Lestari", detail: "Guest, episode 42" },
  { id: "fajar", name: "Fajar Nugroho", detail: "Radio Kita" },
];
const chosen = ref(["citra"]);
</script>

<template>
  <BlessContactPicker
    v-model="chosen"
    :contacts
    :recent="['ana', 'citra']"
    style="max-width: 360px"
  />
</template>
