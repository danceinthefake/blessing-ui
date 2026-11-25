<template>
  <span
    class="bless-badge"
    :class="[`bless-badge--${color}`, `bless-badge--${variant}`, { 'bless-badge--scaled': scaled }]"
  >
    <span class="bless-badge__inner"><slot>NEW!</slot></span>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: "BlessBadge" });

withDefaults(
  defineProps<{
    color?: "badge" | "accent" | "danger" | "warning" | "success" | "info" | "text";
    /** shrink to 0.8 — the source's NEW! next to a nav item; off by default */
    scaled?: boolean;
    /** soft: tinted wash (default, revamp r2); solid: full fill; outline: 1px quiet role tag */
    variant?: "soft" | "solid" | "outline";
  }>(),
  { color: "text", scaled: false, variant: "soft" },
);
</script>

<style>
/* calm pill badge; soft tinted wash by default (revamp 2026-11 r2), never skewed */
.bless-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: var(--bless-radius-pill);
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
  unicode-bidi: plaintext; /* direction from its own text: "NEW!" stays "NEW!" inside RTL copy */
}
.bless-badge--scaled {
  transform: scale(0.86);
}
.bless-badge--solid.bless-badge--accent {
  background: var(--bless-color-accent);
}
.bless-badge--solid.bless-badge--danger {
  background: var(--bless-color-danger);
}
.bless-badge--solid.bless-badge--warning {
  background: var(--bless-color-warning);
  color: var(--bless-color-on-light);
}
.bless-badge--solid.bless-badge--success {
  background: var(--bless-color-success);
  color: var(--bless-color-on-light);
}
.bless-badge--solid.bless-badge--info {
  background: var(--bless-color-info);
}
.bless-badge--solid.bless-badge--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
/* soft: tinted wash matching Unified v3 Lively */
.bless-badge--soft.bless-badge--text {
  background: var(--bless-color-surface-2);
  color: var(--bless-color-text-muted);
}
/* the *-text tokens hold 4.5:1 on bg and surface, not on their own 13% wash: a quarter of the
   ink pulls them to at least 5:1 in every mood and palette */
.bless-badge--soft.bless-badge--accent,
.bless-badge--soft.bless-badge--badge {
  background: color-mix(in srgb, var(--bless-color-accent) 13%, transparent);
  color: color-mix(in srgb, var(--bless-color-text) 25%, var(--bless-color-accent-text));
}
.bless-badge--soft.bless-badge--danger {
  background: color-mix(in srgb, var(--bless-color-danger) 13%, transparent);
  color: color-mix(in srgb, var(--bless-color-text) 25%, var(--bless-color-danger-text));
}
.bless-badge--soft.bless-badge--info {
  background: color-mix(in srgb, var(--bless-color-info) 13%, transparent);
  color: color-mix(in srgb, var(--bless-color-text) 25%, var(--bless-color-info-text));
}
.bless-badge--soft.bless-badge--warning {
  background: color-mix(in srgb, var(--bless-color-warning) 22%, transparent);
  color: var(--bless-color-text);
}
.bless-badge--soft.bless-badge--success {
  background: color-mix(in srgb, var(--bless-color-success) 26%, transparent);
  color: var(--bless-color-text);
}
/* outline: the film site's role tags — border + text in the colour, no fill */
.bless-badge--outline {
  --_c: var(--bless-color-text-muted);
  padding: 3px 9px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: color-mix(in srgb, var(--bless-color-bg) 45%, transparent);
  color: var(--_c);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-badge--outline.bless-badge--accent,
.bless-badge--outline.bless-badge--badge {
  --_c: var(--bless-color-accent-text);
  border-color: color-mix(in srgb, var(--bless-color-accent) 32%, transparent);
}
.bless-badge--outline.bless-badge--danger {
  --_c: var(--bless-color-danger-text);
  border-color: color-mix(in srgb, var(--bless-color-danger) 32%, transparent);
}
.bless-badge--outline.bless-badge--text {
  --_c: var(--bless-color-text);
}
.bless-badge--outline.bless-badge--info {
  --_c: var(--bless-color-info-text);
  border-color: color-mix(in srgb, var(--bless-color-info) 32%, transparent);
}
.bless-badge--outline.bless-badge--warning,
.bless-badge--outline.bless-badge--success {
  --_c: var(--bless-color-text-muted); /* the fills are too pale to be a border */
}
</style>
