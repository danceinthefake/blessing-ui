<script setup lang="ts">
import {
  BlessBadge,
  BlessButton,
  BlessDash,
  BlessIcon,
  BlessSection,
  BlessSkew,
  BlessText,
  BlessWatermark,
} from "blessing-ui";
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

    <section>
      <h2>BlessIcon</h2>
      <div class="row">
        <BlessIcon v-for="s in ['xs', 'sm', 'md', 'lg', 'xl'] as const" :key="s" :size="s"
          ><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg
        ></BlessIcon>
        <BlessIcon size="40px" label="external"
          ><svg viewBox="0 0 24 24">
            <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H7v10h10v-4h2v6H5z" /></svg
        ></BlessIcon>
        <BlessButton color="accent"
          ><template #prefix
            ><BlessIcon size="sm"
              ><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></BlessIcon></template
          >play</BlessButton
        >
      </div>
    </section>

    <section>
      <h2>BlessText</h2>
      <BlessText as="p" size="xl" weight="thin">xl thin — 冴えない彼女の育てかた</BlessText>
      <BlessText as="p" size="lg">lg — TVアニメ公式サイト</BlessText>
      <BlessText as="p">md — body 本文テキスト</BlessText>
      <BlessText as="p" size="sm" muted>sm muted — 2019.09.25</BlessText>
      <BlessText as="p" size="xs" weight="bold" tracking="wider" uppercase
        >xs bold wider upper — label</BlessText
      >
      <BlessText as="p" size="2xs" muted>2xs caption — ©丸戸史明・深崎暮人</BlessText>
    </section>

    <section>
      <h2>BlessWatermark + BlessSection</h2>
      <BlessSection title="News" class="boxed">
        <BlessText as="p"
          >2019.04.04<BlessDash /><BlessBadge /> Blu-ray Disc BOX 発売決定</BlessText
        >
        <BlessText as="p" muted size="sm">watermark defaults to title, top-right</BlessText>
      </BlessSection>
      <BlessSection
        title="スタッフ・キャスト"
        watermark="Staff & Cast"
        watermark-position="bottom-left"
        :heading-level="3"
        class="boxed"
      >
        <BlessText as="p"><BlessSkew color="text" class="pad">原作</BlessSkew> 丸戸史明</BlessText>
      </BlessSection>
      <div class="boxed" style="position: relative; height: 120px; overflow: hidden">
        <BlessWatermark text="Music" position="top-left" />
        <BlessText as="p" style="position: relative"
          >standalone BlessWatermark in any positioned parent</BlessText
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
.boxed {
  border: var(--bless-border-width) solid var(--bless-color-border);
  padding-inline: var(--bless-space-6);
  margin-bottom: var(--bless-space-4);
}
.pad {
  padding: var(--bless-space-2) var(--bless-space-4);
  margin-right: var(--bless-space-2);
}
</style>
