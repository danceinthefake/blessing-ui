<script setup lang="ts">
defineOptions({ name: "BlessBadge" });

withDefaults(
  defineProps<{
    color?: "badge" | "accent" | "danger" | "warning" | "success" | "info" | "text";
    /** shrink to 0.8 — the source's NEW! next to a nav item; off by default */
    scaled?: boolean;
    /** outline: 1px border and text in the colour, no fill — quiet category/role tags */
    variant?: "solid" | "outline";
  }>(),
  { color: "badge", scaled: false, variant: "solid" },
);
</script>

<template>
  <span
    class="bless-badge"
    :class="[`bless-badge--${color}`, `bless-badge--${variant}`, { 'bless-badge--scaled': scaled }]"
  >
    <span class="bless-badge__inner"><slot>NEW!</slot></span>
  </span>
</template>

<style>
/* a cut plate like every other label — the site's NEW! was upright, ours leans with the rest */
.bless-badge {
  display: inline-block;
  padding: 2px 5px;
  border-radius: var(--bless-radius);
  transform: skewX(var(--bless-skew));
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-none);
  letter-spacing: var(--bless-tracking-normal);
  color: var(--bless-color-on-accent);
  background: var(--bless-color-badge);
  vertical-align: middle;
  white-space: nowrap;
}
.bless-badge__inner {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
  unicode-bidi: plaintext; /* direction from its own text: "NEW!" stays "NEW!" inside RTL copy */
}
.bless-badge--scaled {
  transform: skewX(var(--bless-skew)) scale(var(--bless-press-scale));
}
.bless-badge--accent {
  background: var(--bless-color-accent);
}
.bless-badge--danger {
  background: var(--bless-color-danger);
}
.bless-badge--warning {
  background: var(--bless-color-warning);
  color: var(--bless-color-on-light);
}
.bless-badge--success {
  background: var(--bless-color-success);
  color: var(--bless-color-on-light);
}
.bless-badge--info {
  background: var(--bless-color-info);
}
.bless-badge--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
/* outline: the film site's role tags — border + text in the colour, no fill */
.bless-badge--outline {
  --_c: var(--bless-color-text-muted);
  padding: 3px 8px;
  border: var(--bless-border-width) solid var(--_c);
  background: transparent;
  color: var(--_c);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-badge--outline.bless-badge--accent,
.bless-badge--outline.bless-badge--badge {
  --_c: var(--bless-color-accent-text);
}
.bless-badge--outline.bless-badge--danger {
  --_c: var(--bless-color-danger-text);
}
.bless-badge--outline.bless-badge--text {
  --_c: var(--bless-color-text);
}
.bless-badge--outline.bless-badge--info {
  --_c: var(--bless-color-info-text);
}
.bless-badge--outline.bless-badge--warning,
.bless-badge--outline.bless-badge--success {
  --_c: var(--bless-color-text-muted); /* the fills are too pale to be a border */
}
</style>
