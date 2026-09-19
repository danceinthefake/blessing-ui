<script setup lang="ts">
import { BlessBreadcrumb } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessBreadcrumb
      :items="[
        { label: 'Home', href: '#' },
        { label: 'News', href: '#' },
        { label: 'Blu-ray BOX 発売決定' },
      ]"
    />
    <BlessBreadcrumb
      separator="›"
      :items="[{ label: 'Character', href: '#' }, { label: '加藤恵' }]"
    />
  </div>
</template>
