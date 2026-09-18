<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { useFloating, type Placement } from "../composables/useFloating";
import BlessMenuList from "./BlessMenuList.vue";
import { menubarKey, type BlessMenuItem } from "./menu";

defineOptions({ name: "BlessDropdownMenu" });

const props = withDefaults(
  defineProps<{
    items: BlessMenuItem[];
    placement?: Placement;
    checked?: Record<string, boolean>;
    radios?: Record<string, string>;
    /** context-menu mode: open at pointer on right click */
    context?: boolean;
    /** anchor renders as block (wraps an area rather than a button) */
    block?: boolean;
  }>(),
  { placement: "bottom-start" },
);
const emit = defineEmits<{
  select: [item: BlessMenuItem];
  "update:checked": [v: Record<string, boolean>];
  "update:radios": [v: Record<string, string>];
}>();
const open = defineModel<boolean>("open", { default: false });

const id = useId();
const anchor = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const list = ref<InstanceType<typeof BlessMenuList>>();
const virtual = ref<{ x: number; y: number } | null>(null);
const anchorEl = ref<HTMLElement>();
const { x, y } = useFloating(anchorEl, panel, open, { placement: props.placement, offset: 4 });
const bar = inject(menubarKey, null);

function sync(o: boolean) {
  const el = panel.value;
  if (!el || typeof el.showPopover !== "function") return;
  if (o && !el.matches(":popover-open")) el.showPopover();
  else if (!o && el.matches(":popover-open")) el.hidePopover();
}
watch(open, (o) => {
  anchorEl.value = virtual.value
    ? ({
        getBoundingClientRect: () => new DOMRect(virtual.value!.x, virtual.value!.y, 0, 0),
      } as HTMLElement)
    : anchor.value;
  nextTick(() => {
    sync(o);
    if (o) {
      list.value?.focusFirst();
      if (bar) bar.active.value = id;
    } else {
      virtual.value = null;
      if (bar && bar.active.value === id) bar.active.value = null;
    }
  });
});

function onTrigger(e: MouseEvent) {
  if (props.context) return;
  open.value = !open.value;
}
function onContext(e: MouseEvent) {
  if (!props.context) return;
  e.preventDefault();
  virtual.value = { x: e.clientX, y: e.clientY };
  open.value = false;
  // popover=auto light-dismisses on the same gesture's pointerup; open after it
  const show = () => {
    clearTimeout(t);
    removeEventListener("pointerup", show);
    open.value = true;
  };
  addEventListener("pointerup", show, { once: true });
  const t = setTimeout(show, 150);
}
function onTriggerKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    open.value = true;
    nextTick(() => (e.key === "ArrowUp" ? list.value?.focusLast() : list.value?.focusFirst()));
  }
  if (bar && (e.key === "ArrowLeft" || e.key === "ArrowRight"))
    bar.focusNext(id, e.key === "ArrowRight" ? 1 : -1);
}
function onListKey(e: KeyboardEvent) {
  if (
    bar &&
    (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
    !(e.target as HTMLElement).closest(".bless-menu--sub") &&
    !(e.target as HTMLElement).dataset.sub
  ) {
    e.preventDefault();
    bar.focusNext(id, e.key === "ArrowRight" ? 1 : -1);
  }
}

function onSelect(item: BlessMenuItem) {
  if (item.type === "checkbox")
    emit("update:checked", { ...props.checked, [item.value]: !props.checked?.[item.value] });
  else if (item.type === "radio")
    emit("update:radios", { ...props.radios, [item.group]: item.value });
  emit("select", item);
}
function close() {
  open.value = false;
  (anchor.value?.firstElementChild as HTMLElement | null)?.focus?.();
}

bar?.register(
  id,
  () => (open.value = true),
  () => (open.value = false),
);
onBeforeUnmount(() => bar?.unregister(id));
</script>

<template>
  <span
    ref="anchor"
    class="bless-dropdown__anchor"
    :class="{ 'bless-dropdown__anchor--block': block }"
    :aria-haspopup="'menu'"
    :aria-expanded="open"
    :aria-controls="id"
    @click="onTrigger"
    @contextmenu="onContext"
    @keydown="onTriggerKey"
    @mouseenter="bar && bar.active.value && bar.active.value !== id && (open = true)"
  >
    <slot name="trigger" :open />
  </span>
  <div
    ref="panel"
    :id
    popover="auto"
    class="bless-dropdown"
    :style="{ left: `${x}px`, top: `${y}px` }"
    @toggle="open = ($event as ToggleEvent).newState === 'open'"
    @keydown="onListKey"
  >
    <BlessMenuList ref="list" :items :checked :radios @select="onSelect" @close="close" />
  </div>
</template>

<style>
.bless-dropdown__anchor {
  display: inline-flex;
}
.bless-dropdown__anchor--block {
  display: block;
}
.bless-dropdown {
  position: fixed;
  inset: unset;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}
.bless-dropdown:popover-open {
  animation: bless-pop-in var(--bless-duration-base) var(--bless-ease-out);
}
</style>
