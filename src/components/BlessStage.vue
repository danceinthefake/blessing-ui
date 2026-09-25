<script setup lang="ts">
import { nextTick, ref, useId, watch } from "vue";
import { useMedia } from "../composables/useMedia";

defineOptions({ name: "BlessStage" });

withDefaults(
  defineProps<{
    /** the phone menu button's name; aria-expanded says whether it's open */
    menuLabel?: string;
  }>(),
  { menuLabel: "Menu" },
);

/** mobile drawer state; v-model:open optional */
const open = defineModel<boolean>("open", { default: false });
const sp = useMedia();

watch(sp, (isSp) => {
  if (!isSp) open.value = false;
});

const sideId = useId();
const toggle = ref<HTMLElement>();
const side = ref<HTMLElement>();
// the drawer turns inert when it closes: take focus into it on open, back to the button on Esc
watch(open, (o) =>
  nextTick(() => {
    if (o && sp.value) side.value?.querySelector<HTMLElement>("a, button, [tabindex]")?.focus();
  }),
);
function onKey(e: KeyboardEvent) {
  if (e.key !== "Escape" || !open.value) return;
  open.value = false;
  toggle.value?.focus();
}
</script>

<template>
  <div class="bless-stage" :class="{ 'bless-stage--open': open }" @keydown="onKey">
    <div v-if="$slots.background" class="bless-stage__bg" aria-hidden="true">
      <slot name="background" />
    </div>

    <button
      v-if="sp"
      ref="toggle"
      type="button"
      class="bless-stage__toggle"
      :aria-expanded="open"
      :aria-controls="sideId"
      @click="open = !open"
    >
      <span class="bless-stage__toggle-bar" aria-hidden="true" />
      <span class="bless-stage__sr">{{ menuLabel }}</span>
    </button>
    <div v-if="sp && open" class="bless-stage__scrim" @click="open = false" />

    <aside
      :id="sideId"
      ref="side"
      class="bless-stage__side"
      :aria-hidden="sp && !open ? 'true' : undefined"
      :inert="sp && !open"
    >
      <div class="bless-stage__side-inner"><slot name="sidebar" /></div>
    </aside>

    <div class="bless-stage__main">
      <main class="bless-stage__content"><slot /></main>
      <footer v-if="$slots.footer" class="bless-stage__footer"><slot name="footer" /></footer>
    </div>
  </div>
</template>

<style>
.bless-stage {
  position: relative;
  min-height: 100dvh;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  background: var(--bless-color-bg);
}
.bless-stage__bg {
  position: fixed;
  inset: 0;
  z-index: var(--bless-z-bg);
  pointer-events: none;
}
.bless-stage__side {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: var(--bless-z-nav);
  width: var(--bless-sidebar-width);
  padding: var(--bless-space-8) 0 var(--bless-space-8) var(--bless-space-16);
  box-sizing: border-box;
  overflow-y: auto;
}
.bless-stage__side-inner {
  width: var(--bless-sidebar-inner);
  margin: auto;
}
.bless-stage__main {
  margin-left: var(--bless-sidebar-width);
  max-width: var(--bless-content-max);
  box-sizing: border-box;
  padding: var(--bless-space-8);
}
.bless-stage__toggle,
.bless-stage__scrim {
  display: none;
}
.bless-stage__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 800px) {
  .bless-stage__side {
    width: min(80vw, 320px);
    padding: var(--bless-space-16) var(--bless-space-6);
    background: var(--bless-color-bg);
    transform: translateX(-100%);
    transition: transform var(--bless-duration-slow) var(--bless-ease-in-out);
  }
  .bless-stage--open .bless-stage__side {
    transform: none;
  }
  .bless-stage__side-inner {
    width: auto;
  }
  .bless-stage__main {
    margin-left: 0;
    padding: var(--bless-space-16) var(--bless-space-4) var(--bless-space-8);
  }
  .bless-stage__toggle {
    display: grid;
    place-items: center;
    position: fixed;
    top: var(--bless-space-2);
    right: var(--bless-space-2);
    z-index: calc(var(--bless-z-nav) + 1);
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: var(--bless-color-text);
    color: var(--bless-color-on-text);
    cursor: pointer;
    transform: skewX(var(--bless-skew));
  }
  .bless-stage__toggle:focus-visible {
    outline: 2px solid var(--bless-color-accent);
    outline-offset: 2px;
  }
  .bless-stage__toggle-bar,
  .bless-stage__toggle-bar::before,
  .bless-stage__toggle-bar::after {
    display: block;
    width: 18px;
    height: 2px;
    background: currentColor;
    transition:
      transform var(--bless-duration-base) var(--bless-ease-in-out),
      opacity var(--bless-duration-base);
  }
  .bless-stage__toggle-bar {
    position: relative;
    transform: skewX(var(--bless-skew-counter));
  }
  .bless-stage__toggle-bar::before,
  .bless-stage__toggle-bar::after {
    content: "";
    position: absolute;
    left: 0;
  }
  .bless-stage__toggle-bar::before {
    top: -6px;
  }
  .bless-stage__toggle-bar::after {
    top: 6px;
  }
  .bless-stage--open .bless-stage__toggle-bar {
    background: transparent;
  }
  .bless-stage--open .bless-stage__toggle-bar::before {
    transform: translateY(6px) rotate(45deg);
  }
  .bless-stage--open .bless-stage__toggle-bar::after {
    transform: translateY(-6px) rotate(-45deg);
  }
  .bless-stage__scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: calc(var(--bless-z-nav) - 1);
    background: var(--bless-color-backdrop);
  }
}
</style>
