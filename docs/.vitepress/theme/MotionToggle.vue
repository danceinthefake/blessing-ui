<script setup lang="ts">
// Calm motion for the whole site: data-motion="calm" on <html>, saved in localStorage.
// The head script in config.ts restores it before the first paint.
import { onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { BlessToggle, BlessTooltip } from "blessing-ui";

const { lang } = useData();
const calm = ref(false);
onMounted(() => {
  calm.value = document.documentElement.dataset.motion === "calm";
  watch(calm, (on) => {
    if (on) document.documentElement.dataset.motion = "calm";
    else delete document.documentElement.dataset.motion;
    try {
      if (on) localStorage.setItem("bless-motion", "calm");
      else localStorage.removeItem("bless-motion");
    } catch {}
  });
});
</script>

<template>
  <BlessTooltip
    placement="bottom"
    :text="
      lang === 'id'
        ? 'Gerak tenang: animasi di situs ini memudar saja, tanpa bergeser'
        : 'Calm motion: animations on this site only fade, with no movement'
    "
  >
    <BlessToggle v-model:pressed="calm" size="sm" class="nav-calm">{{
      lang === "id" ? "Tenang" : "Calm"
    }}</BlessToggle>
  </BlessTooltip>
</template>
