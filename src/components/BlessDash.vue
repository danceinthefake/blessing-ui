<script setup lang="ts">
defineOptions({ name: "BlessDash" });

withDefaults(defineProps<{ color?: "text" | "muted" | "accent" }>(), { color: "text" });
</script>

<template>
  <span class="bless-dash" :class="`bless-dash--${color}`" aria-hidden="true" />
</template>

<style>
.bless-dash {
  display: inline-block;
  width: var(--bless-dash-width);
  height: var(--bless-border-width);
  margin-inline: var(--bless-space-2);
  vertical-align: middle;
  background: var(--bless-color-text);
}
.bless-dash--muted {
  background: var(--bless-color-text-muted);
}
.bless-dash--accent {
  background: var(--bless-color-accent);
}
</style>
