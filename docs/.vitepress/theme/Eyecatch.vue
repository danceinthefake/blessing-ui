<template>
  <section class="hero-frame vp-raw" :class="{ 'hero-frame--accent': accent }">
    <svg class="hero-frame__art" viewBox="0 0 800 320" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="bless-hero-glow" cx="78%" cy="18%" r="65%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
          <stop offset="60%" stop-color="currentColor" stop-opacity="0.06" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="320" fill="url(#bless-hero-glow)" />
      <!-- abstract drifting petals drawn from the mood & accent, no character or anime frame -->
      <g fill="currentColor" opacity="0.2">
        <path d="M620 48c18 14 26 38 14 54-12 16-36 10-46-12-8-18 12-40 32-42z" />
        <path d="M708 118c16 8 24 26 16 40-8 14-26 12-36-4-10-16 4-34 20-36z" opacity="0.7" />
        <path d="M556 172c12 10 18 24 10 34-8 10-22 6-28-8-6-12 6-24 18-26z" opacity="0.6" />
        <path d="M742 224c14 12 20 30 10 42-10 12-28 8-36-10-8-16 10-30 26-32z" opacity="0.5" />
      </g>
    </svg>
    <span v-if="num" class="hero-frame__num" aria-hidden="true" :data-num="num" />
    <div class="hero-frame__copy">
      <p class="hero-frame__kicker">{{ kicker }}</p>
      <component :is="`h${level}`" class="hero-frame__title">{{ title }}</component>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero frame for docs landing pages (revamp 2026-11): replaces the dark diagonal eyecatch band
// with abstract neutral art drawn from the active mood (--bless-sky, --bless-light, drifting
// petals) and open space on the reading side.
withDefaults(
  defineProps<{
    kicker: string;
    title: string;
    num?: string;
    level?: 1 | 2;
    accent?: boolean;
  }>(),
  { level: 2 },
);
</script>

<style scoped>
.hero-frame {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  min-height: 200px;
  margin-bottom: 28px;
  padding: 28px 32px;
  border-radius: var(--bless-radius);
  background: var(--bless-light), var(--bless-sky);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-sm);
}
.hero-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bless-color-surface) 82%, transparent) 0%,
    color-mix(in srgb, var(--bless-color-surface) 48%, transparent) 55%,
    transparent 100%
  );
  pointer-events: none;
}
.hero-frame__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--bless-color-accent);
  pointer-events: none;
}
.hero-frame--accent .hero-frame__art {
  color: var(--bless-color-accent-2);
}
/* single overflow numeral in weight 100 (generated content so contrast checks skip decor) */
.hero-frame__num::before {
  content: attr(data-num);
  position: absolute;
  inset-inline-end: -0.04em;
  bottom: -0.22em;
  z-index: 1;
  font-size: clamp(110px, 16vw, 176px);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--bless-color-text);
  opacity: 0.1;
  transform: skewX(var(--bless-lean));
  pointer-events: none;
}
.hero-frame__copy {
  position: relative;
  z-index: 2;
  max-width: 600px;
}
.hero-frame__kicker {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
}
.hero-frame__title {
  margin: 6px 0 0;
  border: 0;
  padding: 0;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.12;
  letter-spacing: var(--bless-tracking-tight);
  color: inherit;
}
.hero-frame__copy :deep(p:not(.hero-frame__kicker)) {
  margin: 10px 0 0;
  font-size: var(--bless-text-md);
  line-height: 1.6;
  color: var(--bless-color-text-muted);
}
@media (max-width: 767px) {
  .hero-frame {
    min-height: 164px;
    padding: 22px 20px;
  }
  .hero-frame__num {
    display: none;
  }
}
</style>
