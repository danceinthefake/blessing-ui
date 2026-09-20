<script setup lang="ts">
import { useLink } from "../composables/useLink";
defineOptions({ name: "BlessBreadcrumb" });
const link = useLink();

export interface BlessCrumb {
  label: string;
  href?: string;
}

withDefaults(defineProps<{ items: BlessCrumb[]; label?: string; separator?: string }>(), {
  label: "Breadcrumb",
  separator: "/",
});
</script>

<template>
  <nav class="bless-breadcrumb" :aria-label="label">
    <ol class="bless-breadcrumb__list">
      <li v-for="(item, i) in items" :key="i" class="bless-breadcrumb__item">
        <slot name="item" :item :last="i === items.length - 1">
          <component
            :is="link(item.href).is"
            v-if="item.href && i < items.length - 1"
            v-bind="link(item.href).attrs"
            class="bless-breadcrumb__link"
            >{{ item.label }}</component
          >
          <span
            v-else
            class="bless-breadcrumb__current"
            :aria-current="i === items.length - 1 ? 'page' : undefined"
            >{{ item.label }}</span
          >
        </slot>
        <span v-if="i < items.length - 1" class="bless-breadcrumb__sep" aria-hidden="true">{{
          separator
        }}</span>
      </li>
    </ol>
  </nav>
</template>

<style>
.bless-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-breadcrumb__link {
  color: var(--bless-color-text-muted);
  text-decoration: none;
  transition: color var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-breadcrumb__link:hover {
  color: var(--bless-color-accent-text);
}
.bless-breadcrumb__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-breadcrumb__current {
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-breadcrumb__sep {
  color: var(--bless-color-text-muted);
  display: inline-block;
  transform: skewX(var(--bless-skew));
}
</style>
