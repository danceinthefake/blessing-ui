<script setup lang="ts">
// Below the feature cards on the homepage: install + a live strip (proof the hero image can't
// give — it re-tints with the nav's palette/theme), then three block teasers.
import { ref } from "vue";
import { withBase } from "vitepress";
import {
  BlessAvatar,
  BlessBadge,
  BlessButton,
  BlessChip,
  BlessInput,
  BlessSwitch,
  BlessTabs,
  BlessText,
} from "blessing-ui";

const tab = ref("news");
const on = ref(true);
const copied = ref(false);
async function copy() {
  await navigator.clipboard.writeText("pnpm add blessing-ui");
  copied.value = true;
  setTimeout(() => (copied.value = false), 1200);
}
const blocks = [
  ["signin", "Sign in", "the form every app starts with"],
  ["dashboard", "Dashboard", "shell, stats, chart, table"],
  ["news", "News", "an official site's front page"],
];
</script>

<template>
  <section class="hs">
    <div class="hs__install">
      <button type="button" class="hs__cmd" :title="copied ? 'Copied' : 'Copy'" @click="copy">
        <span class="hs__cmd-inner"><span class="hs__prompt">$</span> pnpm add blessing-ui</span>
      </button>
      <BlessText size="xs" muted tracking="wide">
        Vue 3 · 145 components · one peer dependency · MIT
      </BlessText>
    </div>
    <div class="hs__strip">
      <BlessButton color="accent">Sign in</BlessButton>
      <BlessButton variant="outline">Cancel</BlessButton>
      <BlessBadge :scaled="false">NEW!</BlessBadge>
      <BlessChip label="megumi" removable />
      <BlessSwitch v-model="on">Notify</BlessSwitch>
      <BlessAvatar name="Megumi Kato" />
      <BlessInput placeholder="Search" aria-label="Search" class="hs__input" />
      <BlessTabs
        v-model="tab"
        :tabs="[
          { value: 'news', label: 'News' },
          { value: 'onair', label: 'On Air' },
        ]"
        label="Sections"
        class="hs__tabs"
      />
    </div>
    <BlessText as="p" size="xs" muted class="hs__hint"
      >Live — flip the palette or the theme in the nav.</BlessText
    >
  </section>

  <section class="hs">
    <div class="hs__head">
      <div>
        <BlessText as="h2" size="lg" weight="light">Blocks</BlessText>
        <BlessText as="p" size="sm" muted
          >Finished sections you copy into your project — the app screens and the showcase set the
          system was drawn for.</BlessText
        >
      </div>
      <a :href="withBase('/blocks/')" class="hs__more">All blocks →</a>
    </div>
    <div class="hs__blocks">
      <a
        v-for="[slug, title, sub] in blocks"
        :key="slug"
        :href="withBase(`/blocks/${slug}`)"
        class="hs__block"
      >
        <img :src="withBase(`/preview-${slug}.png`)" :alt="`${title} block`" loading="lazy" />
        <span class="hs__block-cap"
          ><span class="hs__block-title">{{ title }}</span
          ><BlessText size="xs" muted>{{ sub }}</BlessText></span
        >
      </a>
    </div>
  </section>
</template>

<style scoped>
.hs {
  max-width: 1152px;
  margin: 0 auto;
  padding: 40px 24px 0;
}
@media (min-width: 960px) {
  .hs {
    padding-inline: 0; /* line up with VPFeatures */
  }
}
.hs__install {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
.hs__cmd {
  padding: 10px 18px;
  border: 0;
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font:
    15px/1 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition: opacity var(--bless-duration-slow);
}
.hs__cmd:hover {
  opacity: var(--bless-hover-opacity);
}
.hs__cmd-inner {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.hs__prompt {
  color: var(--bless-color-text-muted);
}
.hs__strip {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.hs__input {
  width: 180px;
}
.hs__tabs {
  width: 200px;
}
.hs__hint {
  margin-top: 12px;
}
.hs__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.hs__blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 719px) {
  .hs__blocks {
    grid-template-columns: 1fr;
  }
}
.hs__block {
  display: block;
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  text-decoration: none;
  transition: opacity var(--bless-duration-slow);
}
.hs__block:hover {
  opacity: var(--bless-hover-opacity);
}
.hs__block img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
  background: var(--bless-color-surface);
}
.hs__block-cap {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding: 10px 12px;
}
.hs__block-title {
  font-size: 12px;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
.hs__more {
  flex: none;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-accent-text);
  text-decoration: none;
}
</style>
