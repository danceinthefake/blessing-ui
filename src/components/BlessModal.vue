<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from "vue";
import { useHash } from "../composables/useHash";

defineOptions({ name: "BlessModal" });

const props = withDefaults(
  defineProps<{
    title?: string;
    /** open when location.hash matches; open/close updates the hash (saenai-style deep links) */
    hash?: string;
    size?: "sm" | "md" | "lg" | "full";
    /** click on backdrop closes */
    dismissible?: boolean;
    closeLabel?: string;
  }>(),
  { size: "md", dismissible: true, closeLabel: "Close" },
);

const open = defineModel<boolean>({ default: false });
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
const hash = useHash();

function sync(isOpen: boolean) {
  const el = dialog.value;
  if (!el) return;
  if (isOpen && !el.open) {
    el.showModal();
    // browsers may leave focus on body; keep keyboard inside the dialog
    if (!el.contains(document.activeElement))
      el.querySelector<HTMLElement>(".bless-modal__panel")?.focus();
  } else if (!isOpen && el.open) el.close();
}

// opening pushes a history entry; closing takes that same entry back off, so Back after a close
// doesn't land on a page that looks identical
let pushed = false;
watch(open, (v) => {
  nextTick(() => sync(v));
  if (!props.hash) return;
  if (v && hash.value !== props.hash) {
    history.pushState(null, "", `#${props.hash}`);
    pushed = true;
  } else if (!v && hash.value === props.hash) {
    if (pushed) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  }
  if (!v) pushed = false;
  hash.value = v ? props.hash : "";
});

watch(
  hash,
  (h) => {
    if (!props.hash) return;
    // a link to #hash inside the page pushed an entry too: closing should take it off. (A deep
    // link on load opens in onMounted instead, and closing it must not leave the site.)
    if (h === props.hash && !open.value) pushed = true;
    open.value = h === props.hash;
  },
  { immediate: false },
);

function onClose() {
  open.value = false;
  emit("close");
}

// a click on the backdrop closes, but only if the press started there too: a text selection
// dragged out of the panel ends in a click on the dialog and must not close it
let downOnBackdrop = false;
function onBackdrop(e: MouseEvent) {
  if (props.dismissible && downOnBackdrop && e.target === dialog.value) open.value = false;
}

// registered after useHash's onMounted, so hash is already read
onMounted(() => {
  if (props.hash && hash.value === props.hash) open.value = true;
  sync(open.value);
});
// per-instance: closed dialogs stay in the DOM, so a shared id would name one dialog by another's title
const titleId = `${useId()}-title`;
</script>

<template>
  <dialog
    ref="dialog"
    class="bless-modal"
    :class="`bless-modal--${size}`"
    :aria-labelledby="title || $slots.title ? titleId : undefined"
    @close="onClose"
    @cancel.prevent="open = false"
    @pointerdown="downOnBackdrop = $event.target === dialog"
    @click="onBackdrop"
  >
    <div class="bless-modal__panel" tabindex="-1">
      <button
        type="button"
        class="bless-modal__close"
        :aria-label="closeLabel"
        @click="open = false"
      >
        <span aria-hidden="true">×</span>
      </button>
      <header v-if="title || $slots.title" class="bless-modal__header">
        <h2 :id="titleId" class="bless-modal__title">
          <slot name="title">{{ title }}</slot>
        </h2>
      </header>
      <div class="bless-modal__body"><slot /></div>
      <footer v-if="$slots.footer" class="bless-modal__footer"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>

<style>
.bless-modal {
  border-radius: var(--bless-radius);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.bless-modal[open] {
  display: grid;
  place-items: center;
}
.bless-modal::backdrop {
  background: var(--bless-color-backdrop);
}
.bless-modal__panel {
  position: relative;
  outline: 0;
  box-sizing: border-box;
  width: min(100% - 2 * var(--bless-space-4), var(--_w, 640px));
  max-height: calc(100dvh - 2 * var(--bless-space-4));
  overflow: auto;
  background: var(--bless-color-bg);
  box-shadow: var(--bless-shadow-plate);
  animation: bless-modal-in var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-modal--sm {
  --_w: 400px;
}
.bless-modal--lg {
  --_w: 960px;
}
.bless-modal--full .bless-modal__panel {
  width: 100%;
  height: 100%;
  max-height: none;
}
.bless-modal__close {
  position: absolute;
  top: var(--bless-space-2);
  inset-inline-end: var(--bless-space-2);
  z-index: 1;
  width: 40px;
  height: 40px;
  border: 0;
  padding: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-modal__close > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-modal__close:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-modal__close:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-modal__header {
  padding: var(--bless-space-6) var(--bless-space-16) 0 var(--bless-space-6);
}
.bless-modal__title {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
  color: var(--bless-color-text);
  border: 0;
}
.bless-modal__body {
  padding: var(--bless-space-6);
}
.bless-modal__footer {
  padding: var(--bless-space-4) var(--bless-space-6);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  display: flex;
  gap: var(--bless-space-2);
  justify-content: flex-end;
}
@keyframes bless-modal-in {
  from {
    opacity: 0;
    transform: translateY(var(--bless-space-3));
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-modal__panel {
    animation: none;
  }
}
</style>
