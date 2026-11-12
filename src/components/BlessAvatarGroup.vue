<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessAvatarGroup" });
const pack = useLabelPack("BlessAvatarGroup");

export interface BlessAvatarGroupItem {
  src?: string;
  name?: string;
  alt?: string;
}

const props = withDefaults(
  defineProps<{
    items: BlessAvatarGroupItem[];
    /** how many avatars show; the rest become one "+N" plate */
    max?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    color?: "surface" | "accent" | "text";
    labels?: Partial<{ more: (n: number) => string }>;
  }>(),
  { max: 5, size: "md", color: "surface" },
);

const text = computed(() => ({
  more: (n: number) => `${n} more`,
  ...pack(),
  ...props.labels,
}));
const shown = computed(() => props.items.slice(0, Math.max(0, props.max)));
const hidden = computed(() => props.items.slice(shown.value.length));
</script>

<template>
  <span class="bless-avatar-group" role="group">
    <BlessAvatar
      v-for="(item, i) in shown"
      :key="i"
      :src="item.src"
      :name="item.name"
      :alt="item.alt"
      :size
      :color
    />
    <BlessAvatar
      v-if="hidden.length"
      class="bless-avatar-group__more"
      :name="text.more(hidden.length)"
      :title="
        hidden
          .map((h) => h.alt ?? h.name ?? '')
          .filter(Boolean)
          .join(', ') || undefined
      "
      :size
      color="text"
      >+{{ hidden.length }}</BlessAvatar
    >
  </span>
</template>

<style>
/* fuse when grouped: one plate, no overlap. A shared seam keeps each person countable. */
.bless-avatar-group {
  display: inline-flex;
  gap: var(--bless-border-width);
  background: var(--bless-color-border);
  vertical-align: middle;
}
.bless-avatar-group__more {
  font-size: calc(var(--_s) * 0.32);
}
</style>
