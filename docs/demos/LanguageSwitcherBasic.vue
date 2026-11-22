<template>
  <BlessLanguageSwitcher v-model="lang" :languages />
  <BlessText as="p" size="sm" muted>Current: {{ lang }}</BlessText>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessLanguageSwitcher, BlessText } from "blessing-ui";

const lang = ref("en");
const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
];
</script>
