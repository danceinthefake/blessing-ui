<template>
  <section
    ref="el"
    class="eye vp-raw"
    :class="{
      'eye--accent': accent,
      'eye--seen': !opener && visible,
      'eye--wait': live && !opener && !visible,
    }"
  >
    <span class="eye__slash" aria-hidden="true" />
    <span v-if="num" class="eye__num" aria-hidden="true" :data-num="num" />
    <div class="eye__text">
      <p class="eye__kicker">{{ kicker }}</p>
      <component :is="`h${level}`" class="eye__title">{{ title }}</component>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
// An anime eyecatch: a title card at a break. A slash of accent wipes across a dark band
// when the band first scrolls into view. The home page puts one between its chapters; a
// landing page opens with one in place of its h1.
import { onMounted, ref } from "vue";
import { useAnimateOnScroll } from "blessing-ui";

withDefaults(
  defineProps<{
    /** the small line over the title, for example "Episode 01" */
    kicker: string;
    title: string;
    /** the large number in the corner */
    num?: string;
    level?: 1 | 2;
    /** accent ground with a dark slash, instead of the reverse */
    accent?: boolean;
  }>(),
  { level: 2 },
);
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el);
const live = ref(false); // the server render shows the slash
// A band in view when the page opens shows at once: an entrance on arrival reads as a flicker.
const opener = ref(false);
onMounted(() => {
  opener.value = el.value!.getBoundingClientRect().top < innerHeight;
  live.value = true;
});
</script>

<style scoped>
.eye {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  min-height: 200px;
  padding: 32px 24px;
  background: var(--bless-color-media-bg);
  color: #fff;
  text-align: center;
}
.eye--accent {
  background: var(--bless-color-accent);
}
.eye__slash {
  position: absolute;
  inset: 30% -10%;
  background: var(--bless-color-accent);
  transform: skewY(-4deg);
}
.eye--accent .eye__slash {
  background: var(--bless-color-media-bg);
}
/* decor as generated content: contrast checks skip it */
.eye__num::before {
  content: attr(data-num);
  position: absolute;
  right: -0.05em;
  top: -0.25em;
  font-size: 180px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  opacity: 0.18;
}
.eye__text {
  position: relative;
  color: var(--bless-color-on-accent);
}
.eye__kicker {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.4em;
  text-transform: uppercase;
}
.eye__title {
  margin: 6px 0 0;
  border: 0;
  padding: 0;
  font-size: clamp(32px, 5vw, 54px);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1.15;
  letter-spacing: 0.06em;
  color: inherit;
}
.eye__text :deep(p:not(.eye__kicker)) {
  max-width: 560px;
  margin: 12px auto 0;
  font-size: 16px;
  line-height: 1.6;
}
/* before the band is in view the slash waits; then it wipes across */
.eye--wait .eye__slash {
  clip-path: inset(0 100% 0 0);
}
/* the text waits too, so it does not show and then play in again */
.eye--wait .eye__text {
  opacity: 0;
}
.eye--seen .eye__slash {
  animation: eye-slash var(--bless-duration-draw) var(--bless-ease-snap) both;
}
@keyframes eye-slash {
  from {
    clip-path: inset(0 100% 0 0);
  }
}
.eye--seen .eye__text {
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap) both;
}
@media (max-width: 767px) {
  .eye__num {
    display: none;
  }
}
</style>
