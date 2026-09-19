<script setup lang="ts">
import { BlessButton, BlessIcon } from "blessing-ui";
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
  <div class="row">
    <BlessIcon v-for="s in sizes" :key="s" :size="s">
      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </BlessIcon>
    <BlessIcon size="40px" label="external">
      <svg viewBox="0 0 24 24">
        <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H7v10h10v-4h2v6H5z" />
      </svg>
    </BlessIcon>
    <BlessButton color="accent">
      <template #prefix>
        <BlessIcon size="sm"
          ><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg
        ></BlessIcon>
      </template>
      play
    </BlessButton>
  </div>
</template>
