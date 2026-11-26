<template>
  <div class="block-frame"><slot /></div>
</template>

<script setup lang="ts">
// The page inside a BlockDemo iframe: full-bleed, no docs chrome, so lib styles and the block's own
// media queries run unopposed. Theme/palette come from the parent; height goes back up.
import { onBeforeUnmount, onMounted } from "vue";

let ro: ResizeObserver | undefined;
function onMsg(e: MessageEvent) {
  if (e.source !== window.parent || !e.data || e.data.type !== "bless-theme") return;
  const root = document.documentElement;
  const theme = e.data.theme || (e.data.dark ? "dark" : "light");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  if (e.data.palette && e.data.palette !== "megumi") root.dataset.palette = e.data.palette;
  else root.removeAttribute("data-palette");
  if (e.data.motion) root.dataset.motion = e.data.motion;
  else root.removeAttribute("data-motion");
}
onMounted(() => {
  addEventListener("message", onMsg);
  ro = new ResizeObserver(() =>
    parent.postMessage({ type: "bless-height", h: document.documentElement.scrollHeight }, "*"),
  );
  ro.observe(document.body);
  parent.postMessage({ type: "bless-ready" }, "*");
});
onBeforeUnmount(() => {
  removeEventListener("message", onMsg);
  ro?.disconnect();
});
</script>

<style>
/* VitePress still mounts its mobile "Return to top" bar on layout: page */
.VPLocalNav {
  display: none;
}
.block-frame {
  min-height: 100vh;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
}
</style>
