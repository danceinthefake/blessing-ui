<script setup lang="ts">
import { useLink } from "../composables/useLink";
import BlessBadge from "./BlessBadge.vue";
import BlessDash from "./BlessDash.vue";

defineOptions({ name: "BlessListItem" });
const link = useLink();

defineProps<{
  /** leading meta, e.g. date */
  meta?: string;
  /** badge text; true = NEW! */
  badge?: boolean | string;
  href?: string;
}>();
</script>

<template>
  <li class="bless-list-item">
    <component
      :is="link(href, undefined, 'div').is"
      v-bind="link(href, undefined, 'div').attrs"
      class="bless-list-item__row"
      :class="{ 'bless-list-item__row--link': href }"
    >
      <span v-if="meta || badge" class="bless-list-item__meta">
        <slot name="meta">{{ meta }}</slot>
        <BlessDash />
        <BlessBadge v-if="badge" scaled>{{ badge === true ? "NEW!" : badge }}</BlessBadge>
      </span>
      <span class="bless-list-item__title"><slot /></span>
      <span v-if="$slots.suffix" class="bless-list-item__suffix"><slot name="suffix" /></span>
    </component>
  </li>
</template>

<style>
.bless-list-item__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1) var(--bless-space-3);
  padding: var(--bless-space-3) 0;
  color: var(--bless-color-text);
  text-decoration: none;
}
.bless-list-item__row--link {
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-list-item__row--link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-list-item__row--link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-list-item__meta {
  flex: none;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
  white-space: nowrap;
}
.bless-list-item__title {
  flex: 1 1 12em;
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-tight);
}
.bless-list-item__suffix {
  flex: none;
}
</style>
