<script setup lang="ts">
// A grid of link cards for a landing page. The cards arrive one after another (the
// library's bless-stagger) when the grid first scrolls into view.
import { onMounted, ref } from "vue";
import { withBase } from "vitepress";
import { useAnimateOnScroll } from "blessing-ui";

defineProps<{
  items: { title: string; text?: string; link: string; tag?: string; img?: string }[];
}>();
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el);
const live = ref(false); // the server render shows every card
onMounted(() => (live.value = true));
</script>

<template>
  <div
    ref="el"
    class="cards vp-raw"
    :class="{ 'bless-stagger': visible, 'cards--wait': live && !visible }"
  >
    <a v-for="c in items" :key="c.link" :href="withBase(c.link)" class="card">
      <img v-if="c.img" :src="withBase(c.img)" alt="" loading="lazy" class="card__img" />
      <span v-if="c.tag" class="card__tag">{{ c.tag }}</span>
      <span class="card__title">{{ c.title }}</span>
      <span v-if="c.text" class="card__text">{{ c.text }}</span>
    </a>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 12px;
  margin: 24px 0;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  background: var(--bless-color-surface);
  border-top: 3px solid var(--bless-color-accent);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: var(--bless-lean-transition);
}
.card:hover,
.card:focus-visible {
  transform: skewX(var(--bless-lean));
}
.card__img {
  width: calc(100% + 40px);
  max-width: none;
  margin: -18px -20px 6px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}
.card__tag {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.card__title {
  font-size: 18px;
  font-weight: var(--bless-font-weight-light);
}
.card__text {
  font-size: 14px;
  line-height: 1.55;
  color: var(--bless-color-text-muted);
}
/* hydrated and out of view: wait off stage. Without JS the cards show at once. */
.cards--wait > * {
  opacity: 0;
}
</style>
