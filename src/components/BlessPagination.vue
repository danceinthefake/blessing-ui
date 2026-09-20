<script setup lang="ts">
import { useLink } from "../composables/useLink";
import { computed } from "vue";
import BlessSkew from "./BlessSkew.vue";

defineOptions({ name: "BlessPagination" });
const link = useLink();

const props = withDefaults(
  defineProps<{
    total: number;
    /** pages shown either side of current */
    siblings?: number;
    label?: string;
    prevLabel?: string;
    nextLabel?: string;
    /** render <a href> using this fn instead of buttons */
    href?: (page: number) => string;
  }>(),
  { siblings: 1, label: "Pagination", prevLabel: "Previous", nextLabel: "Next" },
);

const page = defineModel<number>({ default: 1 });

const items = computed<(number | "…")[]>(() => {
  const t = props.total;
  const cur = page.value;
  const s = props.siblings;
  if (t <= 2 * s + 5) return Array.from({ length: t }, (_, i) => i + 1);
  const left = Math.max(2, cur - s);
  const right = Math.min(t - 1, cur + s);
  const out: (number | "…")[] = [1];
  if (left > 2) out.push("…");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < t - 1) out.push("…");
  out.push(t);
  return out;
});

function go(p: number) {
  if (p >= 1 && p <= props.total) page.value = p;
}
</script>

<template>
  <nav class="bless-pagination" :aria-label="label">
    <ul class="bless-pagination__list">
      <li>
        <BlessSkew
          :as="link(href && page > 1 ? href(page - 1) : undefined, undefined, 'button').is"
          v-bind="link(href && page > 1 ? href(page - 1) : undefined, undefined, 'button').attrs"
          :type="href ? undefined : 'button'"
          class="bless-pagination__btn bless-pagination__btn--nav"
          :aria-label="prevLabel"
          :disabled="page <= 1 || undefined"
          @click="!href && go(page - 1)"
          ><span aria-hidden="true">‹</span></BlessSkew
        >
      </li>
      <li v-for="(it, i) in items" :key="i">
        <span v-if="it === '…'" class="bless-pagination__ellipsis" aria-hidden="true">…</span>
        <BlessSkew
          v-else
          :as="link(href ? href(it) : undefined, undefined, 'button').is"
          v-bind="link(href ? href(it) : undefined, undefined, 'button').attrs"
          :type="href ? undefined : 'button'"
          class="bless-pagination__btn"
          :class="{ 'bless-pagination__btn--current': it === page }"
          :color="it === page ? 'accent' : 'none'"
          :aria-current="it === page ? 'page' : undefined"
          :aria-label="`Page ${it}`"
          @click="!href && go(it)"
          >{{ it }}</BlessSkew
        >
      </li>
      <li>
        <BlessSkew
          :as="link(href && page < total ? href(page + 1) : undefined, undefined, 'button').is"
          v-bind="
            link(href && page < total ? href(page + 1) : undefined, undefined, 'button').attrs
          "
          :type="href ? undefined : 'button'"
          class="bless-pagination__btn bless-pagination__btn--nav"
          :aria-label="nextLabel"
          :disabled="page >= total || undefined"
          @click="!href && go(page + 1)"
          ><span aria-hidden="true">›</span></BlessSkew
        >
      </li>
    </ul>
  </nav>
</template>

<style>
.bless-pagination__list {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
}
.bless-pagination__btn {
  border-radius: var(--bless-radius-plate);
  min-width: 36px;
  height: 36px;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid transparent;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  line-height: 34px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    border-color var(--bless-duration-slow);
}
.bless-pagination__btn:hover:not(:disabled):not(.bless-pagination__btn--current) {
  border-color: var(--bless-color-text);
}
.bless-pagination__btn--current {
  cursor: default;
}
.bless-pagination__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.bless-pagination__btn--nav {
  font-size: var(--bless-text-lg);
}
.bless-pagination__ellipsis {
  display: inline-block;
  min-width: 24px;
  text-align: center;
  color: var(--bless-color-text-muted);
}
</style>
