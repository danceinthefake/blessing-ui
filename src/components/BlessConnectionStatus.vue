<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessConnectionStatus" });
const pack = useLabelPack("BlessConnectionStatus");

const props = defineProps<{
  /** your socket's state; the browser's own offline state wins over it */
  state?: "online" | "connecting" | "offline";
  /** show the online state too, not only a problem and the recovery */
  always?: boolean;
  labels?: Partial<{ online: string; back: string; connecting: string; offline: string }>;
}>();

const text = computed(() => ({
  online: "Online",
  back: "Back online",
  connecting: "Reconnecting…",
  offline: "You are offline",
  ...pack(),
  ...props.labels,
}));

// online until the browser says otherwise: the server cannot know, and the first render must agree
const browser = ref(true);
const sync = () => (browser.value = navigator.onLine);
onMounted(() => {
  sync();
  addEventListener("online", sync);
  addEventListener("offline", sync);
});
const now = computed(() => (browser.value ? (props.state ?? "online") : "offline"));

// after a problem, "Back online" shows for a moment, then the line goes quiet again
const back = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
watch(now, (v, old) => {
  clearTimeout(timer);
  back.value = v === "online" && old !== "online";
  if (back.value) timer = setTimeout(() => (back.value = false), 4000);
});
onBeforeUnmount(() => {
  clearTimeout(timer);
  removeEventListener("online", sync);
  removeEventListener("offline", sync);
});

const line = computed(() =>
  now.value !== "online"
    ? text.value[now.value]
    : back.value
      ? text.value.back
      : props.always
        ? text.value.online
        : "",
);
</script>

<template>
  <div class="bless-conn" :class="`bless-conn--${now}`" role="status">
    <template v-if="line">
      <span class="bless-conn__dot" aria-hidden="true" />
      <span>{{ line }}</span>
    </template>
  </div>
</template>

<style>
.bless-conn {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-conn__dot {
  inline-size: 8px;
  block-size: 8px;
  background: var(--bless-color-success);
}
.bless-conn--offline .bless-conn__dot {
  background: var(--bless-color-danger);
}
.bless-conn--connecting .bless-conn__dot {
  background: var(--bless-color-warning);
  animation: bless-conn 1s var(--bless-ease-in-out) infinite alternate;
}
@keyframes bless-conn {
  to {
    opacity: 0.3;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-conn--connecting .bless-conn__dot {
    animation: none;
  }
}
</style>
