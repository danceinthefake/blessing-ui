<script setup lang="ts">
import { BlessMasonry } from "blessing-ui";

const words =
  "A card can be short. Or it can carry a good deal more text, which makes it taller than the card beside it, and that is exactly when columns of equal rows leave gaps. ";
const items = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  title: `Card ${i + 1}`,
  body: words.slice(0, 30 + ((i * 53) % 150)),
}));
</script>

<template>
  <BlessMasonry
    :items
    :row-key="(c: (typeof items)[number]) => c.id"
    :min-width="160"
    :gap="12"
    label="Cards"
  >
    <template #default="{ item }">
      <div
        style="
          padding: 0.75rem;
          border: 1px solid var(--bless-color-border);
          background: var(--bless-color-bg);
        "
      >
        <strong>{{ (item as (typeof items)[number]).title }}</strong>
        <p style="margin: 0.25rem 0 0">{{ (item as (typeof items)[number]).body }}</p>
      </div>
    </template>
  </BlessMasonry>
</template>
