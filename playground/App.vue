<script setup lang="ts">
import { ref } from "vue";
import type { BlessColumn } from "blessing-ui";
const tab = ref("megumi");
const modal = ref(false);
type Onair = { station: string; day: string; time: string; note: string };
const onair = {
  columns: [
    { key: "station", label: "放送局", header: true },
    { key: "day", label: "曜日" },
    { key: "time", label: "時間", align: "right" as const },
    { key: "note", label: "備考" },
  ] as BlessColumn<Onair>[],
  rows: [
    { station: "TOKYO MX", day: "木", time: "24:00", note: "先行" },
    { station: "とちぎテレビ", day: "木", time: "24:00", note: "" },
    { station: "BS11", day: "金", time: "23:30", note: "全国" },
    { station: "AbemaTV", day: "木", time: "24:00", note: "配信" },
  ] satisfies Onair[],
};
const shots = ["ff0054", "fd709f", "ff3434", "ffa800", "c0e722", "a759ff", "82909a", "3d3e3f"].map(
  (c, i) => ({
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#${c}"/><text x="50%" y="50%" font-size="160" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${i + 1}</text></svg>`)}`,
    alt: `shot ${i + 1}`,
    caption: `第${i + 1}話 場面写真`,
  }),
);
const chara = ref(false);
const heroines = [
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "英梨々" },
  { value: "utaha", label: "詩羽" },
  { value: "michiru", label: "美智留", disabled: true },
  { value: "izumi", label: "出海" },
];
import {
  BlessBackground,
  BlessBadge,
  BlessButton,
  BlessCard,
  BlessDash,
  BlessGallery,
  BlessIcon,
  BlessList,
  BlessListItem,
  BlessModal,
  BlessSection,
  BlessSkew,
  BlessTable,
  BlessTabs,
  BlessText,
  BlessWatermark,
} from "blessing-ui";
</script>

<template>
  <main class="pg">
    <h1>Blessing UI</h1>
    <p><a href="/stage.html">BlessStage + BlessSidebarNav demo →</a></p>

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

    <section>
      <h2>BlessBackground</h2>
      <div class="row">
        <div class="boxed" style="position: relative; width: 260px; height: 120px">
          <BlessBackground /><BlessText as="p" style="position: relative"
            >pattern fallback</BlessText
          >
        </div>
        <div class="boxed" style="position: relative; width: 260px; height: 120px">
          <BlessBackground :offset="-40" :opacity="0.4" /><BlessText
            as="p"
            style="position: relative"
            >offset -40, opacity .4</BlessText
          >
        </div>
      </div>
    </section>

    <section>
      <h2>BlessCard</h2>
      <div class="row" style="align-items: flex-start; padding-top: var(--bless-space-3)">
        <BlessCard label="Blu-ray" style="width: 260px">
          <template #media
            ><div style="height: 120px; background: var(--bless-color-surface-2)"
          /></template>
          <BlessText as="p" weight="bold">Blu-ray Disc BOX</BlessText>
          <BlessText as="p" size="sm" muted>2019.09.25 発売</BlessText>
          <template #footer><BlessButton size="sm" color="accent">詳細</BlessButton></template>
        </BlessCard>
        <BlessCard label="Link" label-color="accent" href="#" style="width: 260px">
          <BlessText as="p">whole card is an anchor</BlessText>
        </BlessCard>
        <BlessCard surface="surface" :bordered="false" style="width: 260px">
          <BlessText as="p">surface, no border, no label</BlessText>
        </BlessCard>
      </div>
    </section>

    <section>
      <h2>BlessList</h2>
      <BlessList style="max-width: 640px">
        <BlessListItem meta="2019.04.04" badge href="#"
          >Blu-ray Disc BOX 発売決定！TVシリーズ第一期・第二期全25話収録</BlessListItem
        >
        <BlessListItem meta="2019.03.20" href="#"
          >「冴えない彼女の育てかた Fine」公開日決定</BlessListItem
        >
        <BlessListItem meta="2019.02.01" badge="EVENT"
          >スペシャルイベント開催<template #suffix
            ><BlessButton size="sm" variant="outline">詳細</BlessButton></template
          ></BlessListItem
        >
        <BlessListItem>no meta, plain row</BlessListItem>
      </BlessList>
    </section>

    <section>
      <h2>BlessTabs</h2>
      <BlessTabs v-model="tab" :tabs="heroines" label="Heroines" style="max-width: 640px">
        <template #default="{ tab: t }">
          <BlessText as="p" weight="bold">{{ t.label }}</BlessText>
          <BlessText as="p" size="sm" muted>arrow keys / Home / End · current: {{ tab }}</BlessText>
        </template>
      </BlessTabs>
      <BlessTabs
        :tabs="heroines.slice(0, 3)"
        color="text"
        activation="manual"
        style="max-width: 640px; margin-top: var(--bless-space-6)"
      >
        <template #default="{ tab: t }"
          ><BlessText as="p">manual activation, text color — {{ t.label }}</BlessText></template
        >
      </BlessTabs>
    </section>

    <section>
      <h2>BlessModal</h2>
      <div class="row">
        <BlessButton color="accent" @click="modal = true">open modal</BlessButton>
        <BlessButton href="#chara-megumi">hash-routed (#chara-megumi)</BlessButton>
      </div>
      <BlessModal v-model="modal" title="Blu-ray Disc BOX">
        <BlessText as="p"
          >native &lt;dialog&gt;: focus trap, Esc, backdrop click, top layer.</BlessText
        >
        <template #footer>
          <BlessButton variant="outline" @click="modal = false">閉じる</BlessButton>
          <BlessButton color="accent" @click="modal = false">購入</BlessButton>
        </template>
      </BlessModal>
      <BlessModal v-model="chara" hash="chara-megumi" size="lg" title="加藤恵">
        <BlessText as="p"
          >opened via URL hash — reload keeps it open, close clears hash. current:
          {{ chara }}</BlessText
        >
      </BlessModal>
    </section>

    <section>
      <h2>BlessGallery</h2>
      <BlessGallery :items="shots" columns="120px" style="max-width: 640px" />
    </section>

    <section>
      <h2>BlessTable</h2>
      <BlessTable
        v-bind="onair"
        row-key="station"
        caption="On Air"
        striped
        style="max-width: 640px"
      >
        <template #cell-note="{ value }"
          ><BlessBadge v-if="value" color="text" :scaled="false">{{ value }}</BlessBadge></template
        >
      </BlessTable>
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
