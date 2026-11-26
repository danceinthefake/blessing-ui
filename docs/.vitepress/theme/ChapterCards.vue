<template>
  <div
    ref="el"
    class="cards vp-raw"
    :class="{ 'bless-stagger': !opener && visible, 'cards--wait': live && !opener && !visible }"
  >
    <a v-for="c in items" :key="c.link" :href="withBase(c.link)" class="card">
      <template v-if="c.img">
        <img
          :src="withBase(c.img)"
          alt=""
          loading="lazy"
          class="card__img"
          :class="{ 'light-only': c.imgDark }"
        />
        <img
          v-if="c.imgDark"
          :src="withBase(c.imgDark)"
          alt=""
          loading="lazy"
          class="card__img dark-only"
        />
      </template>
      <span v-if="c.tag" class="card__tag">{{ c.tag }}</span>
      <span class="card__title">{{ c.title }}</span>
      <span v-if="c.text" class="card__text">{{ c.text }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
// A grid of link cards for a landing page. Soft corners and warm sheets with a soft shadow.
// Cards arrive one after another when the grid scrolls into view; cards already in view show at once.
import { onMounted, ref } from "vue";
import { withBase } from "vitepress";
import { useAnimateOnScroll } from "blessing-ui";

defineProps<{
  items: { title: string; text?: string; link: string; tag?: string; img?: string; imgDark?: string }[];
}>();
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el);
const live = ref(false); // the server render shows every card
const opener = ref(false);
onMounted(() => {
  opener.value = el.value!.getBoundingClientRect().top < innerHeight;
  live.value = true;
});
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 14px;
  margin: 24px 0;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  padding: 18px 20px;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
  color: var(--bless-color-text);
  text-decoration: none;
  transition:
    transform var(--bless-duration-base) var(--bless-ease-spring),
    box-shadow var(--bless-duration-base) var(--bless-ease-out);
}
.card:hover,
.card:focus-visible {
  transform: translateY(var(--bless-hover-lift));
  box-shadow: var(--bless-shadow-plate);
}
.card:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.card__img {
  width: calc(100% + 40px);
  max-width: none;
  margin: -18px -20px 8px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}
.card__tag {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
}
.card__title {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.3;
}
.card__text {
  font-size: var(--bless-text-sm);
  line-height: 1.55;
  color: var(--bless-color-text-muted);
}
/* hydrated and out of view: wait off stage. Without JS the cards show at once. */
.cards--wait > * {
  opacity: 0;
}
</style>
