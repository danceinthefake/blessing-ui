---
layout: page
navbar: false
sidebar: false
aside: false
footer: false
title: OG card
---

<!-- 1200×630 social card, rasterized by docs/scripts/shots.mjs → public/og.png -->
<div class="og">
  <div class="og__ribbon" aria-hidden="true">
    <svg viewBox="0 0 1200 44" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id="og-bloom" cx="9%" cy="0%" r="54%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.82" />
          <stop offset="55%" stop-color="#ffffff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <path
          id="og-pt"
          d="M0,-8 C3.6,-6 6,-1.6 4.4,4.4 C2.6,8 -2.6,8 -4.4,4.4 C-6,-1.6 -3.6,-6 -1.3,-8 L0,-5.8 L1.3,-8 Z"
        />
      </defs>
      <rect width="1200" height="44" fill="url(#og-bloom)" />
      <path d="M-20 40 Q320 14 660 34 T1220 20 L1220 50 L-20 50 Z" fill="#ffffff" opacity="0.16" />
      <g fill="#ffffff">
        <use href="#og-pt" transform="translate(190 16) rotate(32) scale(0.95)" opacity="0.86" />
        <use href="#og-pt" transform="translate(520 24) rotate(-38) scale(0.76)" opacity="0.68" />
        <use href="#og-pt" transform="translate(860 14) rotate(48) scale(1.0)" opacity="0.88" />
        <use href="#og-pt" transform="translate(1090 22) rotate(-26) scale(0.84)" opacity="0.76" />
      </g>
    </svg>
  </div>
  <div class="og__text">
    <div class="og__brand">
      <img :src="withBase('/logo.svg')" alt="" class="og__mark" />
      <span class="og__name">Blessing</span>
      <span class="og__ui"><span>UI</span></span>
    </div>
    <span class="og__chip">Vue 3 component library</span>
    <p class="og__title">Warm paper, quiet ink,<br />told like a story.</p>
    <p class="og__tag">Light and space part things. Three time-of-day moods, six character palettes, zero dependencies.</p>
    <p class="og__meta">{{ count }} components · 0 dependencies · MIT</p>
  </div>
  <BlessMockup type="browser" title="ui.blessing.id" class="og__shot">
    <img :src="withBase('/hero-light.png')" alt="" />
  </BlessMockup>
  <span class="og__wm" aria-hidden="true">Blessing</span>
</div>

<script setup>
import { withBase } from "vitepress";
import { BlessMockup } from "blessing-ui";
import { groups } from "./.vitepress/components";

const count = new Set(groups.flatMap((g) => g.items.flatMap((e) => [e.name, ...(e.also ?? [])]))).size;
</script>

<style>
.og {
  position: relative;
  display: flex;
  align-items: center;
  gap: 48px;
  width: 1200px;
  height: 630px;
  padding: 68px 64px 56px;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--bless-light), var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
}
.og__ribbon {
  position: absolute;
  inset: 0 0 auto 0;
  height: 36px;
  background: var(--bless-sky);
  overflow: hidden;
  pointer-events: none;
}
.og__text {
  position: relative;
  z-index: 2;
  flex: none;
  width: 456px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.og__text p {
  margin: 0;
}
.og__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.og__mark {
  width: 44px;
  height: 44px;
}
.og__name {
  font-size: 36px;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1;
  letter-spacing: var(--bless-tracking-tight);
}
/* ink tag: "Color means chosen" — rectangular tag carries −10° lean at rest */
.og__ui {
  display: inline-block;
  padding: 3px 11px;
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: 16px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.04em;
  transform: skewX(var(--bless-lean));
}
.og__ui > span {
  display: inline-block;
  transform: skewX(calc(-1 * var(--bless-lean)));
}
.og__chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 13px;
  border-radius: var(--bless-radius-pill);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface);
  font-size: 13px;
  font-weight: var(--bless-font-weight-medium);
  color: var(--bless-color-text-muted);
}
.og__title {
  font-family: var(--bless-font-serif);
  font-size: 46px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.og__tag {
  font-size: 18px;
  line-height: 1.55;
  color: var(--bless-color-text-muted);
}
.og__meta {
  margin-top: 8px !important;
  font-family: var(--bless-font-mono);
  font-size: 13px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.06em;
  color: var(--bless-color-text-muted);
}
.og__shot {
  position: relative;
  z-index: 2;
  flex: none;
  width: 720px;
  border-radius: calc(var(--bless-radius) + 2px);
  box-shadow: var(--bless-shadow-plate);
}
.og__shot img {
  display: block;
  width: 100%;
}
.og__wm {
  position: absolute;
  right: -24px;
  bottom: -48px;
  z-index: 1;
  font-family: var(--bless-font-sans);
  font-size: 240px;
  font-weight: 200;
  font-style: italic;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--bless-color-text);
  opacity: 0.055;
  pointer-events: none;
}
</style>
