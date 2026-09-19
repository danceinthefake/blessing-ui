<script setup lang="ts">
defineOptions({ name: "BlessTimeline" });

export interface BlessTimelineItem {
  title: string;
  time?: string;
  description?: string;
  color?: "text" | "accent" | "danger" | "success" | "warning" | "info";
}

withDefaults(defineProps<{ items: BlessTimelineItem[]; label?: string }>(), { label: "Timeline" });
</script>

<template>
  <ol class="bless-timeline" :aria-label="label">
    <li
      v-for="(it, i) in items"
      :key="i"
      class="bless-timeline__item"
      :class="`bless-timeline__item--${it.color ?? 'text'}`"
    >
      <span class="bless-timeline__dot" aria-hidden="true"
        ><slot name="dot" :item="it" :index="i"
      /></span>
      <div class="bless-timeline__body">
        <slot :item="it" :index="i">
          <time v-if="it.time" class="bless-timeline__time">{{ it.time }}</time>
          <span class="bless-timeline__title">{{ it.title }}</span>
          <p v-if="it.description" class="bless-timeline__desc">{{ it.description }}</p>
        </slot>
      </div>
    </li>
  </ol>
</template>

<style>
.bless-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-timeline__item {
  --_c: var(--bless-color-text-muted);
  position: relative;
  display: flex;
  gap: var(--bless-space-3);
  padding-bottom: var(--bless-space-4);
}
.bless-timeline__item--accent {
  --_c: var(--bless-color-accent);
}
.bless-timeline__item--danger {
  --_c: var(--bless-color-danger);
}
.bless-timeline__item--success {
  --_c: var(--bless-color-success);
}
.bless-timeline__item--warning {
  --_c: var(--bless-color-warning);
}
.bless-timeline__item--info {
  --_c: var(--bless-color-info);
}
/* rail */
.bless-timeline__item:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 14px;
  bottom: 0;
  width: var(--bless-border-width);
  background: var(--bless-color-border);
}
.bless-timeline__dot {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 12px;
  height: 12px;
  margin-top: 3px;
  background: var(--_c);
  transform: skewX(var(--bless-skew));
}
.bless-timeline__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.bless-timeline__time {
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  color: var(--bless-color-text-muted);
}
.bless-timeline__title {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-timeline__desc {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
