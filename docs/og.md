---
layout: page
navbar: false
sidebar: false
aside: false
footer: false
title: OG card
---

<script setup>
import { withBase } from "vitepress";
import { BlessMockup, BlessSkew } from "blessing-ui";
</script>

<!-- 1200×630 social card, rasterised by docs/scripts/shots.mjs → public/og.png -->
<div class="og">
  <div class="og__text">
    <img :src="withBase('/logo.svg')" alt="" class="og__mark" />
    <p class="og__name">Blessing <BlessSkew color="accent" class="og__ui">UI</BlessSkew></p>
    <p class="og__title">Themed Flat Interface</p>
    <p class="og__tag">Flat by design, raised with Vue,<br />blessed for everyone.</p>
    <p class="og__meta">Vue 3 · 145 components · MIT</p>
  </div>
  <BlessMockup type="browser" title="blessing.software" class="og__shot">
    <img :src="withBase('/hero-light.png')" alt="" />
  </BlessMockup>
  <span class="og__wm" aria-hidden="true">Blessing</span>
</div>

<style>
.og {
  position: relative;
  display: flex;
  align-items: center;
  gap: 48px;
  width: 1200px;
  height: 630px;
  padding: 64px;
  overflow: hidden;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
}
.og__text {
  position: relative;
  z-index: 1;
  flex: none;
  width: 440px;
}
.og__text p {
  margin: 0;
}
.og__mark {
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
}
.og__name {
  font-size: 56px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  letter-spacing: -0.02em;
}
.og__ui {
  display: inline-block;
  padding: 0 14px;
  font-size: 22px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.1em;
  vertical-align: 14px;
}
.og__title {
  margin-top: 20px !important;
  font-size: 30px;
  font-weight: var(--bless-font-weight-light);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.og__tag {
  margin-top: 16px !important;
  font-size: 22px;
  line-height: 1.4;
  color: var(--bless-color-text-muted);
}
.og__meta {
  margin-top: 28px !important;
  font-size: 14px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.og__shot {
  position: relative;
  z-index: 1;
  flex: none;
  width: 760px;
  box-shadow: var(--bless-shadow-md);
}
.og__shot img {
  display: block;
  width: 100%;
}
.og__wm {
  position: absolute;
  right: -40px;
  bottom: -70px;
  font-size: 300px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  color: var(--bless-color-watermark);
  transform: skewX(var(--bless-skew));
  pointer-events: none;
}
</style>
