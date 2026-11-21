<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 560px">
    <BlessText as="p" size="sm">1. Add the library:</BlessText>
    <BlessCodeTabs install="blessing-ui vue" />
    <BlessText as="p" size="sm"
      >2. Start the dev server. This block follows the choice above.</BlessText
    >
    <BlessCodeTabs run="dev" />
    <BlessText as="p" size="sm">Your own tabs, in their own group:</BlessText>
    <BlessCodeTabs
      group="os"
      :tabs="[
        { name: 'macOS', code: 'brew install ffmpeg', lang: 'sh' },
        { name: 'Ubuntu', code: 'sudo apt install ffmpeg', lang: 'sh' },
        { name: 'Windows', code: 'winget install ffmpeg', lang: 'sh' },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { BlessCodeTabs, BlessText } from "blessing-ui";
</script>
