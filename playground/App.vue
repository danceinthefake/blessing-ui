<script setup lang="ts">
import { ref } from "vue";
import type { BlessColumn } from "blessing-ui";
const tab = ref("megumi");
const modal = ref(false);
const alertOpen = ref(true);
const prog = ref(35);
function resetSplash() {
  localStorage.removeItem("bless-pg-splash");
  location.reload();
}
const beep = (hz: number) => {
  // tiny generated WAV so the demo has no external audio
  const rate = 8000,
    len = rate * 2,
    buf = new ArrayBuffer(44 + len),
    v = new DataView(buf);
  const str = (o: number, s: string) =>
    [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + len, true);
  str(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  str(36, "data");
  v.setUint32(40, len, true);
  for (let i = 0; i < len; i++)
    v.setUint8(44 + i, 128 + Math.round(60 * Math.sin((2 * Math.PI * hz * i) / rate)));
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
};
const tracks = [
  { src: beep(440), title: "Sample 01 (440Hz)", artist: "Blessing" },
  { src: beep(660), title: "Sample 02 (660Hz)", artist: "Blessing" },
  { src: beep(880), title: "Sample 03 (880Hz)" },
];
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
  BlessAlert,
  BlessAspectRatio,
  BlessAudioPlayer,
  BlessAvatar,
  BlessBackground,
  BlessBadge,
  BlessButton,
  BlessCard,
  BlessDash,
  BlessGallery,
  BlessIcon,
  BlessKbd,
  BlessSpinner,
  BlessEmpty,
  BlessButtonGroup,
  BlessItem,
  BlessList,
  BlessListItem,
  BlessModal,
  BlessProgress,
  BlessSection,
  BlessSkeleton,
  BlessSkew,
  BlessSplash,
  BlessTable,
  BlessTabs,
  BlessText,
  BlessWatermark,
  BlessToaster,
  BlessThemeToggle,
} from "blessing-ui";
</script>

<template>
  <BlessSplash once="bless-pg-splash" :duration="1500">
    <BlessText
      as="p"
      size="display"
      weight="thin"
      leading="none"
      style="transform: skewX(var(--bless-skew))"
      >Blessing</BlessText
    >
  </BlessSplash>
  <BlessToaster />
  <main class="pg">
    <h1>Blessing UI</h1>
    <div class="row" style="align-items: center">
      <p>
        <a href="/stage.html">stage →</a> · <a href="/forms.html">forms →</a> ·
        <a href="/floating.html">floating →</a>
      </p>
      <BlessThemeToggle />
    </div>

    <section>
      <h2>Skew</h2>
      <BlessSkew color="text" class="pad">Label</BlessSkew>
      <BlessSkew color="accent" class="pad">Accent</BlessSkew>
      <BlessSkew color="danger" class="pad">Danger</BlessSkew>
      <BlessSkew color="surface" class="pad">Surface</BlessSkew>
      <BlessSkew as="h3" class="pad">as h3</BlessSkew>
    </section>

    <section>
      <h2>Button</h2>
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
      <h2>Badge + Dash</h2>
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
      <h2>Icon</h2>
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
      <h2>Text</h2>
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
      <h2>Watermark + Section</h2>
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
      <h2>Background</h2>
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
      <h2>Card</h2>
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
      <h2>List</h2>
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
      <h2>Tabs</h2>
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
      <h2>Modal</h2>
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
      <h2>Gallery</h2>
      <BlessGallery :items="shots" columns="120px" style="max-width: 640px" />
    </section>

    <section>
      <h2>Table</h2>
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

    <section>
      <h2>AudioPlayer</h2>
      <BlessAudioPlayer :tracks style="max-width: 480px" />
    </section>

    <section>
      <h2>Splash</h2>
      <BlessText as="p" size="sm" muted
        >shown once on first load (key <code>bless-pg-splash</code>).
        <a href="#" @click.prevent="resetSplash">reset &amp; reload</a></BlessText
      >
    </section>

    <section>
      <h2>Progress</h2>
      <div class="col" style="max-width: 480px">
        <BlessProgress :value="prog" label="Upload" show-value />
        <BlessProgress :value="80" color="success" size="sm" />
        <BlessProgress :value="20" color="danger" size="lg" />
        <BlessProgress label="Indeterminate" />
        <div class="row">
          <BlessButton size="sm" @click="prog = Math.min(100, prog + 15)">+15</BlessButton
          ><BlessButton size="sm" variant="outline" @click="prog = 0">reset</BlessButton>
        </div>
      </div>
    </section>

    <section>
      <h2>Skeleton</h2>
      <div class="row" style="align-items: center">
        <BlessSkeleton circle width="56px" height="56px" />
        <div style="flex: 1; max-width: 320px"><BlessSkeleton :lines="3" height="12px" /></div>
        <BlessSkeleton width="120px" height="40px" />
      </div>
    </section>

    <section>
      <h2>Avatar</h2>
      <div class="row" style="align-items: center">
        <BlessAvatar
          v-for="s in ['xs', 'sm', 'md', 'lg', 'xl'] as const"
          :key="s"
          :size="s"
          name="Megumi Kato"
        />
        <BlessAvatar name="Eriri Spencer" color="accent" />
        <BlessAvatar name="Utaha" color="text" square size="lg" />
        <BlessAvatar :src="shots[0].src" name="shot" square size="lg" />
        <BlessAvatar src="/nope.png" name="Fallback Test" />
      </div>
    </section>

    <section>
      <h2>AspectRatio</h2>
      <div class="row">
        <BlessAspectRatio :ratio="16 / 9" style="width: 240px"
          ><img :src="shots[1].src" alt=""
        /></BlessAspectRatio>
        <BlessAspectRatio :ratio="1" style="width: 135px"
          ><img :src="shots[2].src" alt=""
        /></BlessAspectRatio>
        <BlessAspectRatio ratio="4 / 5" style="width: 108px"
          ><img :src="shots[3].src" alt=""
        /></BlessAspectRatio>
      </div>
    </section>

    <section>
      <h2>Alert</h2>
      <div class="col" style="max-width: 560px">
        <BlessAlert v-model="alertOpen" title="Blu-ray BOX" color="accent" dismissible
          >2019.09.25 発売。<template #icon>★</template></BlessAlert
        >
        <BlessAlert title="Heads up" color="warning">Tickets sell out fast.</BlessAlert>
        <BlessAlert color="danger" live="alert">Payment failed. Try again.</BlessAlert>
        <BlessAlert color="success">Saved.</BlessAlert>
        <BlessAlert color="info" title="Info" dismissible
          >Info with dismiss, no v-model.</BlessAlert
        >
        <BlessButton v-if="!alertOpen" size="sm" @click="alertOpen = true">show again</BlessButton>
      </div>
    </section>

    <section>
      <h2>Kbd</h2>
      <div class="row" style="align-items: center">
        <BlessKbd :keys="['⌘', 'K']" /> <BlessKbd :keys="['Ctrl', 'Shift', 'P']" />
        <BlessKbd>Esc</BlessKbd>
        <span>press <BlessKbd :keys="['←']" /> / <BlessKbd :keys="['→']" /> in the gallery</span>
      </div>
    </section>

    <section>
      <h2>Spinner</h2>
      <div class="row" style="align-items: center">
        <BlessSpinner size="sm" /> <BlessSpinner /> <BlessSpinner size="lg" />
        <BlessSpinner color="accent" />
        <BlessButton loading color="accent">saving</BlessButton>
      </div>
    </section>

    <section>
      <h2>ButtonGroup</h2>
      <div class="row">
        <BlessButtonGroup label="Pager">
          <BlessButton variant="outline">←</BlessButton>
          <BlessButton variant="outline">1</BlessButton>
          <BlessButton variant="outline">2</BlessButton>
          <BlessButton variant="outline">→</BlessButton>
        </BlessButtonGroup>
        <BlessButtonGroup label="Actions">
          <BlessButton color="accent">Save</BlessButton>
          <BlessButton color="accent">▾</BlessButton>
        </BlessButtonGroup>
        <BlessButtonGroup orientation="vertical" label="Stack">
          <BlessButton size="sm">Top</BlessButton>
          <BlessButton size="sm">Mid</BlessButton>
          <BlessButton size="sm">End</BlessButton>
        </BlessButtonGroup>
      </div>
    </section>

    <section>
      <h2>Item</h2>
      <div class="col" style="max-width: 480px">
        <BlessItem title="第1話 — 冴えないヒロインの育てかた" description="24:00 · 2019.04.04">
          <template #media>▶</template>
          <template #actions><BlessButton size="sm" variant="outline">Play</BlessButton></template>
        </BlessItem>
        <BlessItem variant="outline" title="Blu-ray BOX" description="Pre-order open" href="#">
          <template #media>📀</template>
          <template #actions>→</template>
        </BlessItem>
        <BlessItem variant="surface" size="sm" title="Staff" description="Original: 丸戸史明" />
      </div>
    </section>

    <section>
      <h2>Empty</h2>
      <div class="col" style="max-width: 480px">
        <BlessEmpty title="No episodes yet" description="New episodes appear here after broadcast.">
          <template #icon>∅</template>
          <BlessButton color="accent" size="sm">Browse</BlessButton>
          <BlessButton variant="ghost" size="sm">Refresh</BlessButton>
        </BlessEmpty>
        <BlessEmpty variant="plain" title="Nothing found" />
      </div>
    </section>
  </main>
</template>

<style>
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
