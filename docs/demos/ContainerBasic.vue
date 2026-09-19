<script setup lang="ts">
import { BlessContainer } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessContainer
      v-for="s in ['sm', 'md', 'lg'] as const"
      :key="s"
      :size="s"
      style="background: var(--bless-color-surface); padding-block: 8px"
    >
      <small>size {{ s }}</small>
    </BlessContainer>
  </div>
</template>
