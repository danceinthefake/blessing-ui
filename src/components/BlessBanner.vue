<script setup lang="ts">
import { onMounted, ref } from "vue";

defineOptions({ name: "BlessBanner" });

const props = withDefaults(
  defineProps<{
    color?: "text" | "danger" | "info" | "warning";
    dismissible?: boolean;
    /** a `localStorage` key. A dismissed banner stays gone on the next visit. */
    persist?: string;
    closeLabel?: string;
    /** names the region */
    label?: string;
  }>(),
  { color: "text", dismissible: true, closeLabel: "Dismiss", label: "Announcement" },
);

const open = defineModel<boolean>({ default: true });
const emit = defineEmits<{ dismiss: [] }>();
// with `persist`, the banner shows after mount: the server cannot know what the visitor dismissed
const ready = ref(!props.persist);
const store = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};
onMounted(() => {
  if (props.persist && store()?.getItem(props.persist) === "1") open.value = false;
  ready.value = true;
});
function close() {
  open.value = false;
  if (props.persist)
    try {
      store()?.setItem(props.persist, "1");
    } catch {
      /* private mode: it comes back next visit */
    }
  emit("dismiss");
}
</script>

<template>
  <section
    v-if="open && ready"
    class="bless-banner"
    :class="`bless-banner--${color}`"
    :aria-label="label"
  >
    <div class="bless-banner__body"><slot /></div>
    <div v-if="$slots.action" class="bless-banner__action"><slot name="action" /></div>
    <button
      v-if="dismissible"
      type="button"
      class="bless-banner__close"
      :aria-label="closeLabel"
      @click="close"
    >
      <span aria-hidden="true">×</span>
    </button>
  </section>
</template>

<style>
.bless-banner {
  --_bg: var(--bless-color-text);
  --_fg: var(--bless-color-on-text);
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  background: var(--_bg);
  color: var(--_fg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-tight);
}
.bless-banner--danger {
  --_bg: var(--bless-color-danger);
  --_fg: var(--bless-color-on-accent);
}
.bless-banner--info {
  --_bg: var(--bless-color-info);
  --_fg: var(--bless-color-on-accent);
}
.bless-banner--warning {
  --_bg: var(--bless-color-warning);
  --_fg: var(--bless-color-on-light);
}
.bless-banner__body {
  flex: 1;
  min-width: 0;
}
.bless-banner__action {
  flex: none;
}
.bless-banner a {
  color: inherit;
}
.bless-banner__close {
  flex: none;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-banner__close:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-banner__close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
