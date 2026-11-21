<template>
  <div ref="root" class="hb" :data-live="live ? '' : undefined">
    <!-- prologue -->
    <section class="hb__hero">
      <span class="hb__mark" aria-hidden="true" />
      <span class="hb__vert" aria-hidden="true">祝福のUI</span>
      <div class="hb__wrap hb__hero-body bless-stagger">
        <p class="hb__kicker">{{ t.kicker }}</p>
        <h1 class="hb__title">{{ t.title[0] }}<br />{{ t.title[1] }}</h1>
        <p class="hb__plate"><span>{{ t.plate }}</span></p>
        <p class="hb__lead">{{ t.lead }}</p>
        <div class="hb__row">
          <BlessButton :href="p('/guide/install')">{{ t.start }}</BlessButton>
          <BlessButton :href="p('/components/button')" variant="outline">{{
            t.browse
          }}</BlessButton>
        </div>
      </div>
    </section>

    <template v-for="(eye, i) in t.eye" :key="i">
      <Eyecatch
        :kicker="`${t.episode} 0${i + 1}`"
        :title="eye"
        :num="`0${i + 1}`"
        :accent="i === 1"
      />

      <!-- chapter 01: flat, with live parts -->
      <section v-if="i === 0" class="hb__chapter hb__chapter--surface">
        <div class="hb__wrap hb__cols" data-reveal>
          <div class="hb__copy">
            <p class="hb__kicker">{{ t.ch }} 01</p>
            <p class="hb__text">{{ t.flatText }}</p>
          </div>
          <div class="hb__stage-light">
            <div class="hb__row">
              <BlessButton>{{ t.save }}</BlessButton>
              <BlessButton variant="outline">{{ t.cancel }}</BlessButton>
              <BlessBadge>NEW!</BlessBadge>
            </div>
            <BlessInput :aria-label="t.field" placeholder="blessing software" />
            <div class="hb__row">
              <BlessTabs v-model="tab" :tabs="t.tabs" :label="t.field" />
              <BlessSwitch v-model="on">{{ t.notify }}</BlessSwitch>
            </div>
          </div>
        </div>
      </section>

      <!-- chapter 02: the motion stage -->
      <section v-else-if="i === 1" class="hb__chapter">
        <div class="hb__wrap hb__cols" data-reveal>
          <div class="hb__copy">
            <p class="hb__kicker">{{ t.ch }} 02</p>
            <p class="hb__text">{{ t.motionText }}</p>
            <BlessTabs
              :model-value="layer"
              :tabs="t.layers"
              :label="t.eye[1]"
              @update:model-value="pick"
            />
            <BlessSwitch v-model="calm">{{ t.calm }}</BlessSwitch>
            <a :href="p('/guide/motion')" class="hb__link">{{ t.motionLink }} →</a>
          </div>
          <div class="hb__stage" :data-motion="calm ? 'calm' : undefined">
            <span class="hb__stage-word" :data-word="layer" aria-hidden="true" />
            <div :key="take" class="hb__card" :class="`hb__card--${layer}`" aria-live="polite">
              <p class="hb__kicker hb__kicker--accent">{{ layer }}</p>
              <p class="hb__card-line">{{ t.lines[layer] }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- chapter 03: the cast in numbers, and the blocks -->
      <section v-else class="hb__chapter hb__chapter--accent">
        <div class="hb__wrap">
          <div class="hb__stats" data-reveal>
            <div v-for="(label, k) in t.stats" :key="label" class="hb__stat">
              <BlessCountUp :value="[count, 0, 6, 2][k]!" class="hb__stat-num" />
              <span>{{ label }}</span>
            </div>
          </div>
          <div class="hb__head">
            <p class="hb__kicker">{{ t.ch }} 03 · {{ t.blocks }}</p>
            <a :href="withBase('/blocks/')" class="hb__link">{{ t.allBlocks }} →</a>
          </div>
          <div class="hb__blocks" data-reveal>
            <a
              v-for="[slug, title] in blocks"
              :key="slug"
              :href="withBase(`/blocks/${slug}`)"
              class="hb__block"
            >
              <img
                class="light-only"
                :src="withBase(`/preview-${slug}.png`)"
                :alt="`${title} block`"
                loading="lazy"
              />
              <img
                class="dark-only"
                :src="withBase(`/preview-${slug}-dark.png`)"
                :alt="`${title} block`"
                loading="lazy"
              />
              <span class="hb__block-title">{{ title }}</span>
            </a>
          </div>
        </div>
      </section>
    </template>

    <!-- epilogue: the next-episode preview -->
    <section class="hb__next">
      <div class="hb__wrap hb__cols" data-reveal>
        <div class="hb__copy">
          <p class="hb__kicker hb__kicker--soft">{{ t.next }}</p>
          <p class="hb__preview" aria-hidden="true">次回予告</p>
          <h2 class="hb__next-title">{{ t.nextTitle }}</h2>
          <p class="hb__text">{{ t.nextText }}</p>
        </div>
        <div class="hb__install">
          <code class="hb__cmd"><span aria-hidden="true">$ </span>pnpm add blessing-ui</code>
          <div class="hb__row">
            <BlessCopyButton value="pnpm add blessing-ui" variant="solid" />
            <BlessButton :href="p('/guide/install')" variant="outline">{{ t.guide }} →</BlessButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// The home page as a brochure: chapters like a light novel, with an anime eyecatch band
// between them. Each chapter arrives with the base layer when it scrolls into view.
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";
import {
  BlessBadge,
  BlessButton,
  BlessCopyButton,
  BlessCountUp,
  BlessInput,
  BlessSwitch,
  BlessTabs,
} from "blessing-ui";
import { groups } from "../components";
import Eyecatch from "./Eyecatch.vue";

const props = defineProps<{ lang?: "en" | "id" }>();
const id = computed(() => props.lang === "id");
const p = (path: string) => withBase((id.value && path.startsWith("/guide") ? "/id" : "") + path);

const count = new Set(groups.flatMap((g) => g.items.flatMap((e) => [e.name, ...(e.also ?? [])])))
  .size;

const en = {
  kicker: "Prologue · Vue 3 component library",
  title: ["A flat interface,", "told like a story."],
  plate: `${count} components. No dependencies. MIT.`,
  lead: "Gray does the work. The accent shows what you chose. Each part arrives the way a scene does in an anime: it rises, it speaks, and sometimes it pops.",
  start: "Get started",
  browse: "Components",
  episode: "Episode",
  eye: ["Flat by design", "Three layers, like the show", "The cast"],
  ch: "Chapter",
  flatText:
    "No bevels, no gloss and no blur. A control leans when you use it, like a character who turns to look at you. These parts are live: point at them, type, and change the palette in the nav.",
  save: "Save",
  cancel: "Cancel",
  field: "Circle name",
  notify: "Notify",
  tabs: [
    { value: "news", label: "News" },
    { value: "onair", label: "On air" },
  ],
  motionText: "Choose a layer. The stage plays it again each time you choose.",
  layers: [
    { value: "base", label: "Base" },
    { value: "voice", label: "Voice" },
    { value: "flair", label: "Flair" },
  ],
  lines: {
    base: "A popover rises out of soft focus and settles.",
    voice: "A dialog wipes up like a game text box.",
    flair: "A chosen toggle pops: squash, then stretch.",
  } as Record<string, string>,
  calm: "Calm motion",
  motionLink: "Read the motion guide",
  stats: ["components", "dependencies", "palettes", "languages, EN and ID"],
  blocks: "Finished screens to copy",
  allBlocks: "All blocks",
  next: "Next episode",
  nextTitle: "“Install it in one line.”",
  nextText: "Import the parts that you use. The rest stays out of your bundle.",
  guide: "Read the guide",
};
const idn: typeof en = {
  ...en,
  kicker: "Prolog · pustaka komponen Vue 3",
  title: ["Antarmuka datar,", "diceritakan seperti kisah."],
  plate: `${count} komponen. Tanpa dependensi. MIT.`,
  lead: "Abu-abu yang bekerja. Warna aksen menandai pilihan Anda. Setiap bagian datang seperti adegan anime: ia naik, ia bicara, dan kadang ia meletup.",
  start: "Mulai",
  browse: "Komponen",
  episode: "Episode",
  eye: ["Datar sejak awal", "Tiga lapis, seperti di serinya", "Para pemeran"],
  ch: "Bab",
  flatText:
    "Tanpa bevel, tanpa kilap, tanpa blur. Kontrol miring saat Anda memakainya, seperti tokoh yang menoleh ke arah Anda. Bagian ini hidup: arahkan penunjuk, ketik, dan ganti palet di navigasi.",
  save: "Simpan",
  cancel: "Batal",
  field: "Nama lingkaran",
  notify: "Notifikasi",
  tabs: [
    { value: "news", label: "Berita" },
    { value: "onair", label: "Tayang" },
  ],
  motionText: "Pilih satu lapis. Panggung memutarnya lagi setiap kali Anda memilih.",
  lines: {
    base: "Popover naik dari fokus lembut, lalu diam.",
    voice: "Dialog terbuka dari bawah seperti kotak teks gim.",
    flair: "Toggle yang dipilih meletup: memipih, lalu memanjang.",
  },
  calm: "Gerak tenang",
  motionLink: "Baca panduan gerak",
  stats: ["komponen", "dependensi", "palet", "bahasa, EN dan ID"],
  blocks: "Layar jadi untuk disalin",
  allBlocks: "Semua blok",
  next: "Episode berikutnya",
  nextTitle: "“Pasang dalam satu baris.”",
  nextText: "Impor bagian yang Anda pakai. Sisanya tidak masuk ke bundle Anda.",
  guide: "Baca panduan",
};
const t = computed(() => (id.value ? idn : en));

const tab = ref("news");
const on = ref(true);
const layer = ref("base");
const take = ref(0); // a new key replays the stage
const calm = ref(false);
function pick(v: string) {
  layer.value = v;
  take.value++;
}
const blocks = [
  ["news", "News"],
  ["dashboard", "Dashboard"],
  ["signin", "Sign in"],
];

// Each [data-reveal] waits off stage until it scrolls into view. Without JS, or with
// reduced motion, nothing waits.
const root = ref<HTMLElement>();
const live = ref(false);
let io: IntersectionObserver | undefined;
onMounted(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window))
    return;
  io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-seen", "");
        io?.unobserve(e.target);
      }),
    { threshold: 0.2 },
  );
  root.value?.querySelectorAll("[data-reveal]").forEach((el) => io!.observe(el));
  live.value = true;
});
onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
.hb {
  --hb-pad: clamp(64px, 9vw, 112px);
  overflow-x: clip;
  color: var(--bless-color-text);
}
.hb__wrap {
  max-width: 1152px;
  margin: 0 auto;
  padding-inline: 24px;
}
.hb__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.hb__cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.hb__kicker {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.hb__kicker--accent {
  color: var(--bless-color-accent-text);
}
.hb__text {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--bless-color-text-muted);
}
.hb__link {
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-accent-text);
  text-decoration: none;
}
.hb__link:hover {
  text-decoration: underline;
}

/* prologue */
.hb__hero {
  position: relative;
  overflow: hidden;
  padding-block: var(--hb-pad);
}
/* decor as generated content: a watermark is not text to read, so contrast checks skip it */
.hb__mark::before {
  content: "Blessing";
  position: absolute;
  top: -0.2em;
  right: -0.05em;
  font-size: var(--bless-text-display);
  font-weight: var(--bless-font-weight-thin);
  letter-spacing: var(--bless-tracking-tight);
  line-height: 1;
  color: var(--bless-color-watermark);
  transform: skewX(var(--bless-lean));
  white-space: nowrap;
  pointer-events: none;
  animation: hb-drift 16s linear infinite alternate;
}
.hb__stage-word::before {
  content: attr(data-word);
}
@keyframes hb-drift {
  to {
    translate: -4vw 0;
  }
}
.hb__vert {
  position: absolute;
  right: 24px;
  top: var(--hb-pad);
  writing-mode: vertical-rl;
  font-size: 22px;
  font-weight: var(--bless-font-weight-light);
  letter-spacing: 0.5em;
  color: var(--bless-color-accent-text);
}
.hb__hero-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.hb__title {
  margin: 0;
  font-size: clamp(44px, 7vw, 96px);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1.02;
  letter-spacing: var(--bless-tracking-tight);
}
/* the voice layer: the accent plate wipes in like a text box */
.hb__plate {
  margin: 0;
  padding: 10px 20px;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-light);
  transform: skewX(var(--bless-lean));
  animation-name: bless-voice !important;
  animation-duration: var(--bless-duration-voice) !important;
  animation-timing-function: var(--bless-ease-snap) !important;
}
.hb__plate > span {
  display: inline-block;
  transform: skewX(calc(-1 * var(--bless-lean)));
}
.hb__lead {
  margin: 0;
  max-width: 560px;
  font-size: 17px;
  line-height: 1.7;
  color: var(--bless-color-text-muted);
}

/* chapters */
.hb__chapter {
  padding-block: var(--hb-pad);
}
.hb__chapter--surface {
  background: var(--bless-color-surface);
}
.hb__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.hb__stage-light {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.hb__stage {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  min-height: 300px;
  padding: 32px;
  background: var(--bless-color-media-bg);
}
.hb__stage-word {
  position: absolute;
  left: 24px;
  bottom: 0;
  font-size: 110px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.08);
}
.hb__card {
  position: relative;
  max-width: 420px;
  padding: 22px 26px;
  background: var(--bless-color-bg);
  box-shadow: 6px 6px 0 var(--bless-color-accent);
}
.hb__card--base {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft) both;
}
.hb__card--voice {
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap) both;
}
.hb__card--flair {
  animation: bless-pop var(--bless-duration-flair) var(--bless-ease-pop) both;
}
.hb__card-line {
  margin: 6px 0 0;
  font-size: 20px;
  font-weight: var(--bless-font-weight-light);
  line-height: 1.5;
}
.hb__chapter--accent {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.hb__chapter--accent .hb__kicker,
.hb__chapter--accent .hb__link {
  color: var(--bless-color-on-accent);
}
.hb__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 64px;
}
.hb__stat {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
  border-top: 1px solid currentColor;
  letter-spacing: 0.08em;
}
.hb__stat-num {
  font-size: 64px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1.1;
}
.hb__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 20px;
}
.hb__blocks {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.hb__block {
  display: block;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: var(--bless-lean-transition);
}
.hb__block:hover {
  transform: skewX(var(--bless-lean));
}
.hb__block img {
  width: 100%;
  vertical-align: top;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}
.hb__block-title {
  display: block;
  padding: 12px 16px;
  font-weight: var(--bless-font-weight-bold);
}

/* epilogue */
.hb__next {
  /* always dark: the library parts inside read these tokens */
  --bless-color-text: #f5f5f6;
  --bless-color-on-text: #1a1b1d;
  --bless-color-text-muted: #c9ccd0;
  --bless-color-border: #5d6a74;
  padding-block: var(--hb-pad);
  background: var(--bless-color-media-bg);
  color: var(--bless-color-text);
}
:global(.VPHome:has(.hb)) {
  margin-bottom: 0;
}
.hb__next .hb__text {
  color: #c9ccd0;
}
.hb__kicker--soft {
  color: var(--bless-color-accent-soft);
}
.hb__preview {
  margin: 0;
  font-size: 22px;
  font-weight: var(--bless-font-weight-light);
  color: #c9ccd0;
}
.hb__next-title {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: clamp(36px, 5vw, 60px);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1.1;
}
.hb__install {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.hb__cmd {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 18px 22px;
  background: #f5f5f6;
  color: #3d3e3f;
  font-size: 16px;
  box-shadow: 8px 8px 0 var(--bless-color-accent);
}

/* scroll reveal: a chapter waits off stage until it is in view, then each child arrives */
.hb[data-live] [data-reveal]:not([data-seen]) > * {
  opacity: 0;
}
.hb [data-reveal][data-seen] > * {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft) backwards;
}
.hb [data-reveal][data-seen] > :nth-child(2) {
  animation-delay: calc(2 * var(--bless-stagger));
}
.hb [data-reveal][data-seen] > :nth-child(n + 3) {
  animation-delay: calc(4 * var(--bless-stagger));
}
.hb__mark:is([data-motion="calm"] *)::before {
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .hb__mark::before {
    animation: none !important;
  }
}

@media (max-width: 767px) {
  .hb__cols,
  .hb__blocks {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hb__vert {
    display: none;
  }
}
</style>
