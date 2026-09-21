<script setup lang="ts">
defineOptions({ name: "BlessKbd" });

defineProps<{
  /** keys joined with + ; slot wins if present */
  keys?: string[];
}>();
</script>

<template>
  <kbd class="bless-kbd">
    <template v-if="keys?.length">
      <template v-for="(k, i) in keys" :key="k"
        ><kbd class="bless-kbd__key"
          ><span>{{ k }}</span></kbd
        ><span v-if="i < keys.length - 1" class="bless-kbd__plus" aria-hidden="true"
          >+</span
        ></template
      >
    </template>
    <kbd v-else class="bless-kbd__key"
      ><span><slot /></span
    ></kbd>
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
/* a small cut plate per key; flat — no keycap shadow */
.bless-kbd__key {
  display: inline-block;
  min-width: 1.2em;
  padding: 2px 5px;
  border: var(--bless-border-width) solid var(--bless-color-text-muted);
  background: var(--bless-color-bg);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  transform: skewX(var(--bless-skew));
}
.bless-kbd__key > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-kbd__plus {
  color: var(--bless-color-text-muted);
}
</style>
