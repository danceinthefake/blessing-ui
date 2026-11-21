<script setup lang="ts">
// An anime eyecatch: the title card at a break. A slash of accent wipes across a dark band
// when the band first scrolls into view. A band that is in view when the page opens shows at
// once, because an entrance on arrival reads as a flicker.
import { onMounted, ref } from "vue";
import { useAnimateOnScroll } from "../composables/useAnimateOnScroll";

defineOptions({ name: "BlessEyecatch" });

withDefaults(
  defineProps<{
    /** the small line over the title, for example "Episode 01" */
    kicker?: string;
    title: string;
    /** the large number in the corner; decoration only */
    num?: string;
    headingLevel?: 1 | 2 | 3;
    /** an accent ground with a dark slash, instead of the reverse */
    accent?: boolean;
  }>(),
  { headingLevel: 2 },
);
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el);
const live = ref(false); // the server render shows the slash
const opener = ref(false);
onMounted(() => {
  opener.value = el.value!.getBoundingClientRect().top < innerHeight;
  live.value = true;
});
</script>

<template>
  <section
    ref="el"
    class="bless-eyecatch"
    :class="{
      'bless-eyecatch--accent': accent,
      'bless-eyecatch--seen': !opener && visible,
      'bless-eyecatch--wait': live && !opener && !visible,
    }"
  >
    <span class="bless-eyecatch__slash" aria-hidden="true" />
    <span v-if="num" class="bless-eyecatch__num" aria-hidden="true" :data-num="num" />
    <div class="bless-eyecatch__text">
      <p v-if="kicker" class="bless-eyecatch__kicker">{{ kicker }}</p>
      <component :is="`h${headingLevel}`" class="bless-eyecatch__title">{{ title }}</component>
      <slot />
    </div>
  </section>
</template>

<style>
.bless-eyecatch {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  min-height: 200px;
  padding: var(--bless-space-8) var(--bless-space-6);
  background: var(--bless-color-media-bg);
  text-align: center;
}
.bless-eyecatch--accent {
  background: var(--bless-color-accent);
}
.bless-eyecatch__slash {
  position: absolute;
  inset: 30% -10%;
  background: var(--bless-color-accent);
  transform: skewY(-4deg);
}
.bless-eyecatch--accent .bless-eyecatch__slash {
  background: var(--bless-color-media-bg);
}
/* decoration as generated content: contrast checks and screen readers skip it */
.bless-eyecatch__num::before {
  content: attr(data-num);
  position: absolute;
  right: -0.05em;
  top: -0.25em;
  color: var(--bless-color-on-accent);
  font-size: 180px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  opacity: 0.18;
}
.bless-eyecatch__text {
  position: relative;
  color: var(--bless-color-on-accent);
}
.bless-eyecatch__kicker {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.4em;
  text-transform: uppercase;
}
.bless-eyecatch__title {
  margin: var(--bless-space-2) 0 0;
  font-size: clamp(2rem, 5vw, 3.375rem);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1.15;
  letter-spacing: 0.06em;
  color: inherit;
}
.bless-eyecatch__text > p:not(.bless-eyecatch__kicker) {
  max-width: 560px;
  margin: var(--bless-space-3) auto 0;
  font-size: var(--bless-text-md);
  line-height: 1.6;
}
/* before the band is in view, the slash and the text wait; then the slash wipes across */
.bless-eyecatch--wait .bless-eyecatch__slash {
  clip-path: inset(0 100% 0 0);
}
.bless-eyecatch--wait .bless-eyecatch__text {
  opacity: 0;
}
.bless-eyecatch--seen .bless-eyecatch__slash {
  animation: bless-eyecatch-slash var(--bless-duration-draw) var(--bless-ease-snap) both;
}
@keyframes bless-eyecatch-slash {
  from {
    clip-path: inset(0 100% 0 0);
  }
}
.bless-eyecatch--seen .bless-eyecatch__text {
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap) both;
}
@media (max-width: 767px) {
  .bless-eyecatch__num {
    display: none;
  }
}
</style>
