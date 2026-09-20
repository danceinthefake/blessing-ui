<script setup lang="ts">
defineOptions({ name: "BlessMockup" });

withDefaults(
  defineProps<{
    type?: "browser" | "phone" | "window";
    /** address bar text (browser) or title (window) */
    title?: string;
    /** frame colour */
    dark?: boolean;
  }>(),
  { type: "browser", title: "" },
);
</script>

<template>
  <div class="bless-mockup" :class="[`bless-mockup--${type}`, { 'bless-mockup--dark': dark }]">
    <div class="bless-mockup__chrome" aria-hidden="true">
      <template v-if="type !== 'phone'">
        <span class="bless-mockup__dots"><i /><i /><i /></span>
        <span v-if="title" class="bless-mockup__title">{{ title }}</span>
      </template>
      <span v-else class="bless-mockup__notch" />
    </div>
    <div class="bless-mockup__screen"><slot /></div>
    <div v-if="type === 'phone'" class="bless-mockup__home" aria-hidden="true" />
  </div>
</template>

<style>
.bless-mockup {
  --_frame: var(--bless-color-surface);
  --_fg: var(--bless-color-text-muted);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--_frame);
  font-family: var(--bless-font-sans);
}
.bless-mockup--dark {
  --_frame: var(--bless-color-media-bg);
  --_fg: #9aa4ad;
  --_title: #e8e9ea;
  border-color: transparent;
}
.bless-mockup__chrome {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  color: var(--_fg);
}
.bless-mockup__dots {
  display: inline-flex;
  gap: 5px;
}
.bless-mockup__dots i {
  width: 10px;
  height: 10px;
  background: currentColor;
  opacity: 0.5;
  transform: skewX(var(--bless-skew));
}
.bless-mockup__title {
  flex: 1;
  padding: 2px var(--bless-space-3);
  background: color-mix(in srgb, var(--_fg) 12%, transparent);
  color: var(--_title, var(--bless-color-text));
  font-size: var(--bless-text-xs);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-mockup--window .bless-mockup__title {
  background: none;
  text-align: start;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-mockup__screen {
  flex: 1;
  min-height: 120px;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  overflow: auto;
}
.bless-mockup--browser .bless-mockup__screen,
.bless-mockup--window .bless-mockup__screen {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
/* phone: portrait frame, notch, home bar; the one place a radius is allowed — it's a device */
.bless-mockup--phone {
  width: 300px;
  aspect-ratio: 9 / 19;
  padding: 10px;
  border-radius: 28px;
  border-width: 2px;
}
.bless-mockup--phone .bless-mockup__chrome {
  justify-content: center;
  padding: 0 0 6px;
}
.bless-mockup__notch {
  width: 90px;
  height: 8px;
  background: var(--_fg);
  opacity: 0.5;
  border-radius: 4px;
}
.bless-mockup--phone .bless-mockup__screen {
  border-radius: 18px;
}
.bless-mockup__home {
  width: 100px;
  height: 4px;
  margin: 8px auto 0;
  background: var(--_fg);
  opacity: 0.5;
  border-radius: 2px;
}
</style>
