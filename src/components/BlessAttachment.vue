<script setup lang="ts">
import { computed } from "vue";
import BlessProgress from "./BlessProgress.vue";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessAttachment" });

const props = withDefaults(
  defineProps<{
    name: string;
    /** size / type line */
    description?: string;
    /** image preview */
    src?: string;
    /** renders <a> when set */
    href?: string;
    state?: "idle" | "uploading" | "error";
    /** 0–100 while uploading; omit for indeterminate */
    progress?: number;
    size?: "sm" | "md";
    removable?: boolean;
    removeLabel?: string;
  }>(),
  { state: "idle", size: "md", removeLabel: "Remove" },
);
const emit = defineEmits<{ remove: [] }>();
const ext = computed(() => props.name.split(".").pop()?.slice(0, 4).toUpperCase() ?? "");
</script>

<template>
  <div
    class="bless-attachment"
    :class="[
      `bless-attachment--${size}`,
      `bless-attachment--${state}`,
      { 'bless-attachment--link': href },
    ]"
    :aria-busy="state === 'uploading' || undefined"
  >
    <span class="bless-attachment__media">
      <slot name="media">
        <img v-if="src" :src alt="" class="bless-attachment__img" />
        <span v-else class="bless-attachment__ext">{{ ext }}</span>
      </slot>
      <BlessSpinner
        v-if="state === 'uploading' && progress == null"
        size="sm"
        class="bless-attachment__spinner"
        label=""
      />
    </span>
    <span class="bless-attachment__body">
      <!-- the name is the link, stretched over the card; the actions sit above it, not inside -->
      <a v-if="href" :href class="bless-attachment__name bless-attachment__link">{{ name }}</a>
      <span v-else class="bless-attachment__name">{{ name }}</span>
      <span v-if="description || state === 'error'" class="bless-attachment__desc">
        <slot name="description">{{ state === "error" ? "Upload failed" : description }}</slot>
      </span>
      <BlessProgress
        v-if="state === 'uploading' && progress != null"
        :value="progress"
        size="sm"
        class="bless-attachment__progress"
      />
    </span>
    <span v-if="$slots.actions || removable" class="bless-attachment__actions">
      <slot name="actions" />
      <button
        v-if="removable"
        type="button"
        class="bless-attachment__remove"
        :aria-label="`${removeLabel} ${name}`"
        @click="emit('remove')"
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  </div>
</template>

<style>
.bless-attachment {
  border-radius: var(--bless-radius);
  --_m: 48px;
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  max-width: 100%;
  padding: var(--bless-space-2);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  text-decoration: none;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-attachment--sm {
  --_m: 32px;
  padding: var(--bless-space-1);
}
.bless-attachment--link {
  position: relative;
}
.bless-attachment__link {
  color: inherit;
  text-decoration: none;
}
.bless-attachment__link::after {
  content: "";
  position: absolute;
  inset: 0;
}
.bless-attachment--link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-attachment--link:has(.bless-attachment__link:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-attachment__link:focus-visible {
  outline: 0;
}
.bless-attachment__actions {
  position: relative;
  z-index: 1;
}
.bless-attachment--error {
  box-shadow: inset 0 0 0 var(--bless-border-width) var(--bless-color-danger);
}
.bless-attachment__media {
  border-radius: var(--bless-radius-plate);
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--_m);
  height: var(--_m);
  overflow: hidden;
  background: var(--bless-color-bg);
  transform: skewX(var(--bless-skew));
}
.bless-attachment__media > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-attachment__img {
  width: 120%;
  height: 100%;
  object-fit: cover;
}
.bless-attachment__ext {
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  color: var(--bless-color-text-muted);
}
.bless-attachment__spinner {
  position: absolute;
  inset: 0;
  margin: auto;
}
.bless-attachment--uploading .bless-attachment__img,
.bless-attachment--uploading .bless-attachment__ext {
  visibility: hidden; /* the spinner sits on top; faded text would just be illegible text */
}
.bless-attachment__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.bless-attachment__name {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-attachment__desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-attachment--error .bless-attachment__desc {
  color: var(--bless-color-danger-text);
}
.bless-attachment__progress {
  margin-top: 2px;
}
.bless-attachment__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  flex: none;
}
.bless-attachment__remove {
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  line-height: 1;
  cursor: pointer;
}
.bless-attachment__remove:hover {
  color: var(--bless-color-danger-text);
}
.bless-attachment__remove:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
