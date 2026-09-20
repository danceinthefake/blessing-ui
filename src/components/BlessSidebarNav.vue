<script setup lang="ts">
import { useLink } from "../composables/useLink";
import BlessBadge from "./BlessBadge.vue";
import BlessDash from "./BlessDash.vue";

defineOptions({ name: "BlessSidebarNav" });

export interface BlessNavItem {
  label: string;
  href: string;
  /** small text after a dash, e.g. a date */
  meta?: string;
  /** badge text; true = NEW! */
  badge?: boolean | string;
  external?: boolean;
}

withDefaults(defineProps<{ items: BlessNavItem[]; active?: string; label?: string }>(), {
  label: "Main",
});
const link = useLink();
const emit = defineEmits<{ select: [item: BlessNavItem, event: MouseEvent] }>();
</script>

<template>
  <nav class="bless-sidebar-nav" :aria-label="label">
    <ul class="bless-sidebar-nav__list">
      <li v-for="item in items" :key="item.href" class="bless-sidebar-nav__item">
        <component
          :is="link(item.href, item.external).is"
          v-bind="link(item.href, item.external).attrs"
          class="bless-sidebar-nav__link"
          :class="{ 'bless-sidebar-nav__link--active': item.href === active }"
          :aria-current="item.href === active ? 'page' : undefined"
          @click="emit('select', item, $event)"
        >
          <slot name="item" :item>
            <span class="bless-sidebar-nav__label">{{ item.label }}</span>
            <template v-if="item.meta || item.badge">
              <BlessDash />
              <span v-if="item.meta" class="bless-sidebar-nav__meta">{{ item.meta }}</span>
              <BlessBadge v-if="item.badge">{{
                item.badge === true ? "NEW!" : item.badge
              }}</BlessBadge>
            </template>
          </slot>
        </component>
      </li>
    </ul>
  </nav>
</template>

<style>
.bless-sidebar-nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-sidebar-nav__item {
  margin: var(--bless-space-2) 0;
}
.bless-sidebar-nav__link {
  display: inline-flex;
  align-items: center;
  padding: var(--bless-space-1) 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-sidebar-nav__link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-sidebar-nav__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-sidebar-nav__link--active {
  color: var(--bless-color-accent-text);
}
.bless-sidebar-nav__meta {
  font-size: var(--bless-text-sm);
}
</style>
