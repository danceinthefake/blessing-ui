<script setup lang="ts">
defineOptions({ name: "BlessDash" });

// a zero-size space inside, so "2019.04.04—Title" reads as two words without one in the markup
withDefaults(defineProps<{ color?: "text" | "muted" | "accent" }>(), { color: "text" });
</script>

<template>
  <span class="bless-dash" :class="`bless-dash--${color}`">{{ " " }}</span>
</template>

<style>
.bless-dash {
  display: inline-block;
  width: var(--bless-dash-width);
  height: var(--bless-border-width);
  margin-inline: var(--bless-space-2);
  vertical-align: middle;
  background: var(--bless-color-text);
  font-size: 0;
}
.bless-dash--muted {
  background: var(--bless-color-text-muted);
}
.bless-dash--accent {
  background: var(--bless-color-accent);
}
</style>
