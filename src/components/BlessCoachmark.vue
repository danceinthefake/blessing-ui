<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessCoachmark" });

const props = withDefaults(
  defineProps<{
    /** what is new, said in the bubble and to screen readers */
    text: string;
    /** remembers a dismissal under this key (localStorage), so it shows once; omit to show until `dismissed` is set */
    id?: string;
    /** which corner of the wrapped element the dot sits on */
    placement?: "top-end" | "top-start" | "bottom-end" | "bottom-start";
    /** using the wrapped element (a click inside it) counts as seen */
    dismissOnUse?: boolean;
    labels?: Partial<{ dot: (text: string) => string; ok: string }>;
  }>(),
  { placement: "top-end", dismissOnUse: true },
);
const dismissed = defineModel<boolean>("dismissed", { default: false });
const emit = defineEmits<{ dismiss: [] }>();

const text = computed(() => ({
  dot: (t: string) => `New: ${t}`,
  ok: "Got it",
  ...props.labels,
}));
const key = computed(() => (props.id ? `bless-coachmark:${props.id}` : null));
const open = ref(false);
const ready = ref(false); // storage is read after mount, so the server and first client render agree
const bubble = `${useId()}-bubble`;

onMounted(() => {
  try {
    if (key.value && localStorage.getItem(key.value)) dismissed.value = true;
  } catch {
    /* storage can be blocked; the mark then shows each visit */
  }
  ready.value = true;
});
function dismiss() {
  if (dismissed.value) return;
  dismissed.value = true;
  open.value = false;
  try {
    if (key.value) localStorage.setItem(key.value, "1");
  } catch {
    /* ignore */
  }
  emit("dismiss");
}
// a click on the wrapped element counts; a click on the dot or its bubble is the mark itself
const used = (e: MouseEvent) => {
  if (
    props.dismissOnUse &&
    !(e.target as Element).closest?.(".bless-coachmark__dot, .bless-coachmark__bubble")
  )
    dismiss();
};
</script>

<template>
  <span class="bless-coachmark" @click.capture="used" @keydown.esc="open = false">
    <slot />
    <template v-if="ready && !dismissed">
      <button
        type="button"
        class="bless-coachmark__dot"
        :class="`bless-coachmark__dot--${placement}`"
        :aria-label="text.dot(props.text)"
        :aria-expanded="open"
        :aria-controls="bubble"
        @click.stop="open = !open"
      />
      <span
        v-if="open"
        :id="bubble"
        class="bless-coachmark__bubble"
        :class="`bless-coachmark__bubble--${placement}`"
        role="status"
      >
        {{ props.text }}
        <BlessButton size="sm" @click="dismiss">{{ text.ok }}</BlessButton>
      </span>
    </template>
  </span>
</template>

<style>
.bless-coachmark {
  position: relative;
  display: inline-flex;
}
.bless-coachmark__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  background: var(--bless-color-badge);
  cursor: pointer;
}
/* a touch target bigger than the dot, without moving it */
.bless-coachmark__dot::before {
  content: "";
  position: absolute;
  inset: -10px;
}
.bless-coachmark__dot::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 2px solid var(--bless-color-badge);
  animation: bless-coachmark-pulse 1.8s var(--bless-ease-out) infinite;
}
.bless-coachmark__dot:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 3px;
}
.bless-coachmark__dot--top-end {
  top: -4px;
  inset-inline-end: -4px;
}
.bless-coachmark__dot--top-start {
  top: -4px;
  inset-inline-start: -4px;
}
.bless-coachmark__dot--bottom-end {
  bottom: -4px;
  inset-inline-end: -4px;
}
.bless-coachmark__dot--bottom-start {
  bottom: -4px;
  inset-inline-start: -4px;
}
.bless-coachmark__bubble {
  position: absolute;
  z-index: 2;
  display: grid;
  gap: var(--bless-space-2);
  width: max-content;
  max-width: 220px;
  padding: var(--bless-space-3);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-accent);
  box-shadow: var(--bless-shadow-plate);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-coachmark__bubble--top-end,
.bless-coachmark__bubble--top-start {
  top: calc(100% + 12px);
}
.bless-coachmark__bubble--bottom-end,
.bless-coachmark__bubble--bottom-start {
  bottom: calc(100% + 12px);
}
.bless-coachmark__bubble--top-end,
.bless-coachmark__bubble--bottom-end {
  inset-inline-end: 0;
}
.bless-coachmark__bubble--top-start,
.bless-coachmark__bubble--bottom-start {
  inset-inline-start: 0;
}
@keyframes bless-coachmark-pulse {
  from {
    opacity: 0.9;
    transform: scale(0.6);
  }
  to {
    opacity: 0;
    transform: scale(1.6);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-coachmark__dot::after {
    animation: none;
    opacity: 0.5;
    transform: none;
  }
}
</style>
