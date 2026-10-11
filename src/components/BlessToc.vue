<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useScrollSpy } from "../composables/useScrollSpy";

export interface BlessTocItem {
  id: string;
  label: string;
  /** indent step, from 0 (default) */
  level?: number;
}

defineOptions({ name: "BlessToc" });

const props = withDefaults(
  defineProps<{
    /** the headings to list. Leave out to collect them with `selector`. */
    items?: BlessTocItem[];
    /** headings to collect after mount. Each one needs an `id`. */
    selector?: string;
    /** names the navigation landmark */
    label?: string;
    /** passed to the observer that marks the current heading */
    rootMargin?: string;
  }>(),
  { selector: "h2, h3", label: "On this page" },
);

const found = ref<BlessTocItem[]>([]);
const list = computed(() => props.items ?? found.value);
// the observer reads its targets once, so pass ids when you give `items` and the selector otherwise
const { active } = useScrollSpy(
  props.items ? props.items.map((i) => i.id) : props.selector,
  props.rootMargin ? { rootMargin: props.rootMargin } : {},
);
onMounted(() => {
  if (props.items) return;
  found.value = Array.from(document.querySelectorAll<HTMLElement>(props.selector))
    .filter((h) => h.id)
    .map((h) => ({
      id: h.id,
      label: h.textContent?.trim() ?? h.id,
      level: Math.max(0, Number(h.tagName.slice(1)) - 2) || 0,
    }));
});
</script>

<template>
  <nav class="bless-toc" :aria-label="label">
    <ol v-if="list.length" class="bless-toc__list">
      <li v-for="i in list" :key="i.id" :style="{ '--_level': i.level ?? 0 }">
        <a
          class="bless-toc__link"
          :href="`#${i.id}`"
          :aria-current="active === i.id ? 'location' : undefined"
          >{{ i.label }}</a
        >
      </li>
    </ol>
  </nav>
</template>

<style>
.bless-toc__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
}
.bless-toc__link {
  display: block;
  padding-block: var(--bless-space-1);
  padding-inline: calc(var(--bless-space-3) + var(--_level, 0) * var(--bless-space-3))
    var(--bless-space-3);
  margin-inline-start: calc(-1 * var(--bless-border-width));
  border-inline-start: 2px solid transparent;
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-normal);
  color: var(--bless-color-text-muted);
  text-decoration: none;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    color var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-toc__link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-toc__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-toc__link[aria-current="location"] {
  border-inline-start-color: var(--bless-color-accent);
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
</style>
