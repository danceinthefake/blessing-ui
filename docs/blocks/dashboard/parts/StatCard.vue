<script setup lang="ts">
import { BlessBadge, BlessCard, BlessText } from "blessing-ui";
import { fmt, fmtDelta, type Stat } from "../domain";

defineProps<{ stat: Stat }>();
</script>

<template>
  <BlessCard>
    <BlessText as="p" size="xs" muted tracking="wider" uppercase>{{ stat.label }}</BlessText>
    <div class="stat__row">
      <BlessText size="lg" weight="light">{{ fmt(stat) }}</BlessText>
      <BlessBadge :color="stat.delta >= 0 ? 'success' : 'danger'">{{
        fmtDelta(stat.delta)
      }}</BlessBadge>
    </div>
  </BlessCard>
</template>

<style scoped>
.stat__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-1);
}
</style>
