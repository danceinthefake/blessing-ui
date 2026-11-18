<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
import BlessLightbox, { type BlessLightboxItem } from "./BlessLightbox.vue";

defineOptions({ name: "BlessGallery" });

export type BlessGalleryItem = BlessLightboxItem;

const props = withDefaults(
  defineProps<{
    items: BlessGalleryItem[];
    /** thumbnail grid column min width */
    columns?: string;
    loop?: boolean;
    labels?: Partial<{ prev: string; next: string }>;
  }>(),
  { columns: "160px", loop: true },
);
const pack = useLabelPack("BlessGallery");
const text = computed(() => ({
  prev: "Previous",
  next: "Next",
  ...pack(),
  ...props.labels,
}));

/** index of open item, -1 = closed */
const index = defineModel<number>({ default: -1 });
const labels = computed(() => ({ prev: text.value.prev, next: text.value.next }));

// thumbs need names even when an image has no alt text
const nameOf = (item: BlessGalleryItem, i: number) =>
  item.alt || item.caption || `Image ${i + 1} of ${props.items.length}`;
</script>

<template>
  <div class="bless-gallery">
    <ul role="list" class="bless-stagger bless-gallery__grid" :style="{ '--_col': columns }">
      <li v-for="(item, i) in items" :key="item.src" class="bless-gallery__cell">
        <button
          type="button"
          class="bless-gallery__thumb"
          :aria-label="nameOf(item, i)"
          @click="index = i"
        >
          <slot name="thumb" :item :index="i">
            <img :src="item.thumb ?? item.src" :alt="item.alt ?? ''" loading="lazy" />
          </slot>
        </button>
      </li>
    </ul>

    <BlessLightbox v-model="index" :items :loop :labels />
  </div>
</template>

<style>
.bless-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--_col), 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-gallery__thumb {
  border-radius: var(--bless-radius);
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: var(--bless-color-surface);
  line-height: 0;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-gallery__thumb:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-gallery__thumb:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-gallery__thumb img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
</style>
