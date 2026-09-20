<script setup lang="ts">
defineOptions({ name: "BlessKbd" });

defineProps<{
  /** keys joined with + ; slot wins if present */
  keys?: string[];
}>();
</script>

<template>
  <kbd class="bless-kbd">
    <slot>
      <template v-for="(k, i) in keys" :key="k"
        ><kbd class="bless-kbd__key">{{ k }}</kbd
        ><span v-if="i < keys!.length - 1" class="bless-kbd__plus" aria-hidden="true"
          >+</span
        ></template
      >
    </slot>
  </kbd>
</template>

<style>
.bless-kbd {
  border-radius: var(--bless-radius);
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
}
.bless-kbd__key,
.bless-kbd > :not(.bless-kbd__key):not(.bless-kbd__plus) {
  display: inline-block;
  min-width: 1.2em;
  padding: 2px 5px;
  border: var(--bless-border-width) solid var(--bless-color-text-muted);
  border-bottom-width: 2px;
  background: var(--bless-color-bg);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  transform: skewX(var(--bless-skew));
}
.bless-kbd__plus {
  color: var(--bless-color-text-muted);
}
</style>
