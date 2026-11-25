<template>
  <section class="hero-frame vp-raw" :class="{ 'hero-frame--accent': accent }">
    <div class="hero-frame__ribbon" aria-hidden="true">
      <svg
        class="hero-frame__art"
        viewBox="0 0 800 84"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="bless-hero-bloom" cx="10%" cy="0%" r="58%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.82" />
            <stop offset="52%" stop-color="#ffffff" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </radialGradient>
          <path
            id="bless-hero-petal"
            d="M0,-8 C3.6,-6 6,-1.6 4.4,4.4 C2.6,8 -2.6,8 -4.4,4.4 C-6,-1.6 -3.6,-6 -1.3,-8 L0,-5.8 L1.3,-8 Z"
          />
        </defs>
        <rect width="800" height="84" fill="url(#bless-hero-bloom)" />
        <path d="M-20 76 Q220 34 450 66 T820 42 L820 92 L-20 92 Z" fill="#ffffff" opacity="0.16" />
        <g fill="#ffffff">
          <use href="#bless-hero-petal" transform="translate(132 26) rotate(32) scale(1.05)" opacity="0.86" />
          <use href="#bless-hero-petal" transform="translate(274 52) rotate(-40) scale(0.78)" opacity="0.62" />
          <use href="#bless-hero-petal" transform="translate(432 22) rotate(54) scale(1.1)" opacity="0.88" />
          <use href="#bless-hero-petal" transform="translate(578 48) rotate(-28) scale(0.84)" opacity="0.7" />
          <use href="#bless-hero-petal" transform="translate(696 20) rotate(44) scale(0.92)" opacity="0.8" />
        </g>
      </svg>
      <span v-if="num" class="hero-frame__tag">VOL {{ num }}</span>
    </div>
    <div class="hero-frame__body">
      <span v-if="num" class="hero-frame__wm" aria-hidden="true" :data-num="num" />
      <div class="hero-frame__copy">
        <span class="hero-frame__chip">{{ kicker }}</span>
        <component :is="`h${level}`" class="hero-frame__title">{{ title }}</component>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Unified v3 (Lively) sky-ribbon hero frame for docs landing pages: neutral mood sky gradient,
// delicate notched sakura petals, outline kicker chip, quiet italic watermark, and serif headline.
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
  margin-bottom: 28px;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-sm);
}
.hero-frame__ribbon {
  position: relative;
  height: 58px;
  background: var(--bless-sky);
  overflow: hidden;
}
.hero-frame__art {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.hero-frame__tag {
  position: absolute;
  inset-inline-end: 18px;
  bottom: 9px;
  font-family: var(--bless-font-mono);
  font-size: 11px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.09em;
  color: rgb(255 255 255 / 0.94);
  text-shadow: 0 1px 8px rgb(12 22 52 / 0.42);
}
.hero-frame__body {
  position: relative;
  padding: 22px 28px 26px;
}
/* quiet ultra-light italic watermark (Saekano ♭ website voice) */
.hero-frame__wm::before {
  content: attr(data-num);
  position: absolute;
  inset-inline-end: 18px;
  top: -8px;
  z-index: 1;
  font-family: var(--bless-font-sans);
  font-size: clamp(76px, 12vw, 120px);
  font-weight: 200;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--bless-color-text);
  opacity: 0.06;
  pointer-events: none;
}
.hero-frame__copy {
  position: relative;
  z-index: 2;
  max-width: 620px;
}
.hero-frame__chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--bless-radius-pill);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: color-mix(in srgb, var(--bless-color-bg) 45%, transparent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-medium);
  color: var(--bless-color-text-muted);
}
.hero-frame__title {
  margin: 10px 0 0;
  border: 0;
  padding: 0;
  font-family: var(--bless-font-serif);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.015em;
  color: inherit;
}
.hero-frame__copy :deep(p:not(.hero-frame__kicker)) {
  margin: 10px 0 0;
  font-size: var(--bless-text-md);
  line-height: 1.6;
  color: var(--bless-color-text-muted);
}
@media (max-width: 767px) {
  .hero-frame__body {
    padding: 18px 20px 22px;
  }
  .hero-frame__wm {
    display: none;
  }
}
</style>
