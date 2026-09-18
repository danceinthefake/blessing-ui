<script setup lang="ts">
import { BlessBadge, BlessButton, BlessDash, BlessSkew } from "blessing-ui";
</script>

<template>
  <main class="pg">
    <h1>Blessing UI</h1>

    <section>
      <h2>BlessSkew</h2>
      <BlessSkew color="text" class="pad">Label</BlessSkew>
      <BlessSkew color="accent" class="pad">Accent</BlessSkew>
      <BlessSkew color="danger" class="pad">Danger</BlessSkew>
      <BlessSkew color="surface" class="pad">Surface</BlessSkew>
      <BlessSkew as="h3" class="pad">as h3</BlessSkew>
    </section>

    <section>
      <h2>BlessButton</h2>
      <div class="row" v-for="variant in ['solid', 'outline', 'ghost'] as const" :key="variant">
        <BlessButton
          v-for="color in ['text', 'accent', 'danger'] as const"
          :key="color"
          :variant
          :color
        >
          {{ variant }} {{ color }}
        </BlessButton>
      </div>
      <div class="row">
        <BlessButton size="sm">small</BlessButton>
        <BlessButton size="md">medium</BlessButton>
        <BlessButton size="lg">large</BlessButton>
      </div>
      <div class="row">
        <BlessButton href="#">link</BlessButton>
        <BlessButton disabled>disabled</BlessButton>
        <BlessButton loading>loading</BlessButton>
        <BlessButton color="accent"><template #prefix>▶</template>play</BlessButton>
      </div>
    </section>

    <section>
      <h2>BlessBadge + BlessDash</h2>
      <div class="row">
        <span>News <b>04.04</b><BlessDash /><BlessBadge /></span>
        <span>Story<BlessDash color="muted" /><BlessBadge color="accent">EP.12</BlessBadge></span>
        <span
          >Shop<BlessDash color="accent" /><BlessBadge color="warning" :scaled="false"
            >SALE</BlessBadge
          ></span
        >
      </div>
      <div class="row">
        <BlessBadge
          v-for="c in ['badge', 'accent', 'danger', 'warning', 'success', 'info', 'text'] as const"
          :key="c"
          :color="c"
          :scaled="false"
          >{{ c }}</BlessBadge
        >
      </div>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  padding: var(--bless-space-8);
  font: var(--bless-font-weight-normal) var(--bless-text-md) / var(--bless-leading-normal)
    var(--bless-font-sans);
  color: var(--bless-color-text);
  background: var(--bless-color-bg);
}
h1 {
  font-weight: var(--bless-font-weight-thin);
  font-size: var(--bless-text-xl);
}
h2 {
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  margin: var(--bless-space-12) 0 var(--bless-space-4);
}
.row {
  display: flex;
  gap: var(--bless-space-2);
  margin-bottom: var(--bless-space-3);
  flex-wrap: wrap;
}
.pad {
  padding: var(--bless-space-2) var(--bless-space-4);
  margin-right: var(--bless-space-2);
}
</style>
