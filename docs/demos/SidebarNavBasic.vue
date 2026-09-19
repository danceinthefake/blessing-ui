<script setup lang="ts">
import { ref } from "vue";
import { BlessSidebarNav } from "blessing-ui";
import { navItems } from "./_nav";
const active = ref("#news");
</script>

<template>
  <div style="max-width: 220px">
    <BlessSidebarNav
      :items="navItems"
      :active
      @select="
        (i, e) => {
          if (!i.external) {
            e.preventDefault();
            active = i.href;
          }
        }
      "
    />
  </div>
</template>
