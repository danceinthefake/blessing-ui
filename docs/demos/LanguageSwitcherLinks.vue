<template>
  <BlessLanguageSwitcher
    model-value="en"
    :languages
    :href="(code) => (code === 'en' ? '#' : `#${code}`)"
  />
</template>

<script setup lang="ts">
import { BlessLanguageSwitcher } from "blessing-ui";

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ja", label: "日本語" },
];
</script>
