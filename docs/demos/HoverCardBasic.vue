<script setup lang="ts">
import { BlessAvatar, BlessHoverCard, BlessText } from "blessing-ui";
</script>

<template>
  <div>
    Follow
    <BlessHoverCard>
      <template #trigger
        ><a href="#" style="color: var(--bless-color-accent-text); font-weight: 700"
          >@saenai_heroine</a
        ></template
      >
      <div style="display: flex; gap: 12px; align-items: center">
        <BlessAvatar name="Saenai Heroine" color="accent" size="lg" />
        <div>
          <BlessText as="p" weight="bold">冴えない彼女の育てかた</BlessText>
          <BlessText as="p" size="xs" muted>TVアニメ公式 · joined 2014</BlessText>
        </div>
      </div>
    </BlessHoverCard>
    for updates.
  </div>
</template>
