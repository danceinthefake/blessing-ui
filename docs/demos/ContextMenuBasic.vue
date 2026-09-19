<script setup lang="ts">
import { ref } from "vue";
import { BlessContextMenu } from "blessing-ui";
import { menu } from "./_menu";
const last = ref("");
</script>

<template>
  <BlessContextMenu :items="menu" @select="last = 'label' in $event ? $event.label : ''">
    <div
      style="
        display: grid;
        place-items: center;
        height: 120px;
        max-width: 480px;
        border: 1px dashed var(--bless-color-text-muted);
      "
    >
      right-click here {{ last && `· ${last}` }}
    </div>
  </BlessContextMenu>
</template>
