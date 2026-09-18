<script setup lang="ts">
defineOptions({ name: "BlessCollapsible" });

defineProps<{
  title?: string;
  /** native exclusive-open group (details name=) */
  name?: string;
  disabled?: boolean;
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <details
    class="bless-collapsible"
    :class="{ 'bless-collapsible--disabled': disabled }"
    :open
    :name
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary
      class="bless-collapsible__summary"
      :tabindex="disabled ? -1 : undefined"
      :aria-disabled="disabled || undefined"
      @click="disabled && $event.preventDefault()"
    >
      <span class="bless-collapsible__title"
        ><slot name="title">{{ title }}</slot></span
      >
      <span class="bless-collapsible__chevron" aria-hidden="true" />
    </summary>
    <div class="bless-collapsible__content">
      <div class="bless-collapsible__inner"><slot /></div>
    </div>
  </details>
</template>

<style>
.bless-collapsible {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-collapsible__summary {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) 0;
  list-style: none;
  cursor: pointer;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  transition: color var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-collapsible__summary::-webkit-details-marker {
  display: none;
}
.bless-collapsible__summary:hover {
  color: var(--bless-color-accent);
}
.bless-collapsible__summary:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-collapsible__title {
  flex: 1;
}
.bless-collapsible__chevron {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
  transition: transform var(--bless-duration-base) var(--bless-ease-in-out);
}
.bless-collapsible[open] > .bless-collapsible__summary .bless-collapsible__chevron {
  transform: rotate(-135deg) translateY(-2px);
}
.bless-collapsible__content {
  display: grid;
}
.bless-collapsible__inner {
  padding: 0 0 var(--bless-space-4);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-collapsible--disabled {
  opacity: 0.4;
}
.bless-collapsible--disabled .bless-collapsible__summary {
  cursor: not-allowed;
}
/* open animation where supported */
@supports (interpolate-size: allow-keywords) {
  .bless-collapsible::details-content {
    height: 0;
    overflow: clip;
    transition:
      height var(--bless-duration-slow) var(--bless-ease-in-out),
      content-visibility var(--bless-duration-slow) allow-discrete;
  }
  .bless-collapsible[open]::details-content {
    height: auto;
  }
}
</style>
