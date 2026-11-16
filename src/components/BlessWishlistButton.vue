<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessWishlistButton" });
const pack = useLabelPack("BlessWishlistButton");

const props = defineProps<{
  /** the name of the product, for the name of the button */
  name: string;
  /** how many people saved it */
  count?: number;
  labels?: Partial<{
    save: (name: string) => string;
    added: (name: string) => string;
    removed: (name: string) => string;
  }>;
}>();
const saved = defineModel<boolean>({ default: false });

const text = computed(() => ({
  save: (n: string) => `Save ${n} to the wishlist`,
  added: (n: string) => `${n} is in your wishlist.`,
  removed: (n: string) => `${n} is out of your wishlist.`,
  ...pack(),
  ...props.labels,
}));
// the message is set only by a click, so a page load says nothing
const said = ref("");
function toggle() {
  // the model may update only after the parent writes it back, so use the new value here
  const next = !saved.value;
  saved.value = next;
  said.value = next ? text.value.added(props.name) : text.value.removed(props.name);
}
</script>

<template>
  <span class="bless-wish">
    <button
      type="button"
      class="bless-wish__button"
      :class="{ 'is-saved': saved }"
      :aria-pressed="saved"
      :title="text.save(name)"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-9.4-9.3C1.3 8 3.3 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.5 0 5.5 3.5 4.2 6.7-1.9 4.7-9.4 9.3-9.4 9.3Z"
        />
      </svg>
      <span class="bless-sr">{{ text.save(name) }}</span>{{ " "
      }}<span v-if="count !== undefined" class="bless-wish__count">{{ count }}</span>
    </button>
    <span class="bless-sr" role="status">{{ said }}</span>
  </span>
</template>

<style>
.bless-wish {
  display: inline-flex;
}
.bless-wish__button {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-inline-size: 2.5rem;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.bless-wish__button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* an outline when not saved, a filled heart when saved: the shape changes, not only the color */
.bless-wish__button svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}
.bless-wish__button.is-saved svg {
  fill: var(--bless-color-accent);
  stroke: var(--bless-color-accent);
}
@media (prefers-reduced-motion: no-preference) {
  .bless-wish__button.is-saved svg {
    animation: bless-wish-pop var(--bless-duration-base) ease-out;
  }
}
@keyframes bless-wish-pop {
  50% {
    transform: scale(1.25);
  }
}
</style>
