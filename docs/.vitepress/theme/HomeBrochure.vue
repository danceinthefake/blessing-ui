<template>
  <div ref="root" class="hb" :data-live="live ? '' : undefined">
    <!-- hero frame: abstract neutral art drawn from the active mood, words in its open side -->
    <section class="hb__hero-wrap">
      <div class="hb__wrap">
        <div class="hb__hero">
          <svg
            class="hb__art"
            viewBox="0 0 1152 460"
            preserveAspectRatio="xMaxYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="hb-sun" cx="84%" cy="14%" r="60%">
                <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
                <stop offset="55%" stop-color="currentColor" stop-opacity="0.08" />
                <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="hb-ray" x1="1" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#fff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <rect width="1152" height="460" fill="url(#hb-sun)" />
            <polygon points="820,0 1152,0 920,460 560,460" fill="url(#hb-ray)" />
            <!-- drifting abstract petals, no character or anime frame -->
            <g fill="currentColor" opacity="0.24">
              <path d="M845 78c24 18 34 50 18 72-16 20-48 12-60-16-12-24 16-54 42-56z" />
              <path
                d="M978 164c20 10 30 34 20 52-10 18-34 14-48-6-12-20 6-44 28-46z"
                opacity="0.72"
              />
              <path
                d="M752 246c16 14 24 32 14 46-10 14-30 8-38-10-8-16 8-34 24-36z"
                opacity="0.58"
              />
              <path
                d="M1022 308c18 16 26 38 14 54-12 16-36 10-46-12-10-22 12-40 32-42z"
                opacity="0.5"
              />
              <path
                d="M668 112c12 8 18 22 10 32-8 10-22 6-28-6-6-12 6-24 18-26z"
                opacity="0.45"
              />
            </g>
          </svg>
          <span class="hb__mark" aria-hidden="true" />
          <div class="hb__hero-body bless-stagger">
            <p class="hb__kicker">{{ t.kicker }}</p>
            <h1 class="hb__title">{{ t.title[0] }}<br />{{ t.title[1] }}</h1>
            <p class="hb__lead">{{ t.lead }}</p>
            <div class="hb__row">
              <BlessButton :href="p('/guide/install')">
                <template #prefix><BlessIcon name="play" size="sm" /></template>
                {{ t.start }}
              </BlessButton>
              <BlessButton :href="p('/components/')" variant="outline">{{ t.browse }}</BlessButton>
              <span class="hb__meta">{{ t.plate }}</span>
            </div>
          </div>
        </div>

        <div class="hb__voice">
          <BlessNovelBox
            :name="t.voiceName"
            :text="t.voiceLines[line]!"
            interactive
            @next="line = (line + 1) % t.voiceLines.length"
          />
        </div>
      </div>
    </section>

    <!-- chapter 01: warm paper, three moods, live controls -->
    <section class="hb__chapter">
      <div class="hb__wrap hb__cols" data-reveal>
        <div class="hb__copy">
          <p class="hb__kicker">{{ t.ch }} 01 · {{ t.moodTitle }}</p>
          <h2 class="hb__h2">{{ t.flatHeading }}</h2>
          <p class="hb__text">{{ t.flatText }}</p>
          <div class="hb__row">
            <BlessThemeToggle mode="group" />
            <BlessPaletteToggle show-default />
          </div>
        </div>
        <div class="hb__stage-light">
          <div class="hb__row">
            <BlessButton>{{ t.save }}</BlessButton>
            <BlessButton variant="outline">{{ t.cancel }}</BlessButton>
            <BlessBadge>{{ t.newBadge }}</BlessBadge>
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
    <section class="hb__chapter hb__chapter--surface">
      <div class="hb__wrap hb__cols" data-reveal>
        <div class="hb__copy">
          <p class="hb__kicker">{{ t.ch }} 02 · {{ t.motionTitle }}</p>
          <h2 class="hb__h2">{{ t.motionHeading }}</h2>
          <p class="hb__text">{{ t.motionText }}</p>
          <BlessTabs
            :model-value="layer"
            :tabs="t.layers"
            :label="t.motionHeading"
            @update:model-value="pick"
          />
          <BlessSwitch v-model="calm">{{ t.calm }}</BlessSwitch>
          <a :href="p('/guide/motion')" class="hb__link">
            {{ t.motionLink }}
            <BlessIcon name="arrow-right" size="xs" />
          </a>
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
    <section class="hb__chapter">
      <div class="hb__wrap">
        <div class="hb__stats" data-reveal>
          <div v-for="(label, k) in t.stats" :key="label" class="hb__stat">
            <BlessCountUp :value="[count, 0, 6, 3][k]!" class="hb__stat-num" />
            <span class="hb__stat-label">{{ label }}</span>
          </div>
        </div>
        <div class="hb__head">
          <div>
            <p class="hb__kicker">{{ t.ch }} 03 · {{ t.blocks }}</p>
            <h2 class="hb__h2">{{ t.blocksHeading }}</h2>
          </div>
          <a :href="withBase('/blocks/')" class="hb__link">
            {{ t.allBlocks }}
            <BlessIcon name="arrow-right" size="xs" />
          </a>
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

    <!-- epilogue: install -->
    <section class="hb__next-wrap">
      <div class="hb__wrap">
        <div class="hb__next" data-reveal>
          <div class="hb__copy">
            <p class="hb__kicker hb__kicker--soft">{{ t.next }}</p>
            <h2 class="hb__next-title">{{ t.nextTitle }}</h2>
            <p class="hb__text">{{ t.nextText }}</p>
          </div>
          <div class="hb__install">
            <code class="hb__cmd"><span aria-hidden="true">$ </span>pnpm add blessing-ui</code>
            <div class="hb__row">
              <BlessCopyButton value="pnpm add blessing-ui" variant="solid" />
              <BlessButton :href="p('/guide/install')" variant="outline">
                {{ t.guide }}
                <template #suffix><BlessIcon name="arrow-right" size="xs" /></template>
              </BlessButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// The revamped home page (2026-11): opens with a wide hero frame carrying abstract mood art
// (sky gradient, light leak, and petals) and a live BlessNovelBox, then warm paper and sheet
// sections with no eyecatch bands or tracked uppercase labels.
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";
import {
  BlessBadge,
  BlessButton,
  BlessCopyButton,
  BlessCountUp,
  BlessIcon,
  BlessInput,
  BlessNovelBox,
  BlessPaletteToggle,
  BlessSwitch,
  BlessTabs,
  BlessThemeToggle,
} from "blessing-ui";
import { groups } from "../components";

const props = defineProps<{ lang?: "en" | "id" }>();
const id = computed(() => props.lang === "id");
const p = (path: string) => withBase((id.value && path.startsWith("/guide") ? "/id" : "") + path);

const count = new Set(groups.flatMap((g) => g.items.flatMap((e) => [e.name, ...(e.also ?? [])])))
  .size;

const en = {
  kicker: "Vue 3 component library",
  title: ["Warm paper, quiet ink,", "told like a story."],
  plate: `${count} components · 0 dependencies · MIT`,
  lead: "Light and space part things. The accent shows what you chose. Controls lean when you engage with them, and three moods carry the time of day.",
  start: "Get started",
  browse: "Browse components",
  voiceName: "Megumi",
  voiceLines: [
    "Try switching between Daylight, Golden hour, and Night below, or change the petal palette in the top bar.",
    "At rest, every control stands calm and upright in warm ink. Hover, focus, or choose it to see it respond.",
    "Every component is tree-shakeable, keyboard-accessible, and built with zero runtime dependencies.",
  ],
  ch: "Chapter",
  moodTitle: "Paper, ink, and moods",
  flatHeading: "Calm at rest, expressive on attention",
  flatText:
    "Warm paper replaces flat grey, corners are soft, and soft ink-tinted shadows lift floating surfaces. A control leans −10° when you point at it, and fills with the accent only when you choose it.",
  save: "Save",
  cancel: "Cancel",
  newBadge: "New",
  field: "Circle name",
  notify: "Notify",
  tabs: [
    { value: "news", label: "News" },
    { value: "onair", label: "On air" },
  ],
  motionTitle: "Three layers",
  motionHeading: "Motion that knows when to stay quiet",
  motionText: "Choose a layer. The stage plays it again each time you choose.",
  layers: [
    { value: "base", label: "Base" },
    { value: "voice", label: "Voice" },
    { value: "flair", label: "Flair" },
  ],
  lines: {
    base: "A popover rises out of soft focus and settles.",
    voice: "A dialog wipes up like a visual-novel text box.",
    flair: "A chosen toggle pops: squash, then stretch.",
  } as Record<string, string>,
  calm: "Calm motion",
  motionLink: "Read the motion guide",
  stats: ["components", "runtime dependencies", "accent palettes", "time-of-day moods"],
  blocks: "Finished screens",
  blocksHeading: "Copy a whole screen into your app",
  allBlocks: "All blocks",
  next: "Install in one line",
  nextTitle: "Ready when you are.",
  nextText: "Import only the parts you use. The rest stays out of your bundle.",
  guide: "Read the guide",
};
const idn: typeof en = {
  ...en,
  kicker: "Pustaka komponen Vue 3",
  title: ["Kertas hangat, tinta tenang,", "diceritakan seperti kisah."],
  plate: `${count} komponen · 0 dependensi · MIT`,
  lead: "Cahaya dan ruang memisahkan segalanya. Warna aksen menandai pilihan Anda. Kontrol miring saat diperhatikan, dan tiga suasana membawa waktu dalam sehari.",
  start: "Mulai",
  browse: "Lihat komponen",
  voiceName: "Megumi",
  voiceLines: [
    "Coba ganti antara Terang, Senja, dan Gelap di bawah, atau ganti palet kelopak di bilah atas.",
    "Saat diam, setiap kontrol berdiri tenang dan tegak dalam tinta hangat. Arahkan, fokus, atau pilih untuk melihatnya merespons.",
    "Setiap komponen mendukung tree-shaking, aksesibilitas papan ketik, dan tanpa dependensi runtime.",
  ],
  ch: "Bab",
  moodTitle: "Kertas, tinta, dan suasana",
  flatHeading: "Tenang saat diam, hidup saat diperhatikan",
  flatText:
    "Kertas hangat menggantikan abu-abu datar, sudutnya lembut, dan bayangan lembut bernuansa tinta mengangkat permukaan melayang. Kontrol miring −10° saat disentuh, dan terisi aksen hanya saat Anda memilihnya.",
  save: "Simpan",
  cancel: "Batal",
  newBadge: "Baru",
  field: "Nama lingkaran",
  notify: "Notifikasi",
  tabs: [
    { value: "news", label: "Berita" },
    { value: "onair", label: "Tayang" },
  ],
  motionTitle: "Tiga lapis",
  motionHeading: "Gerak yang tahu kapan harus tenang",
  motionText: "Pilih satu lapis. Panggung memutarnya lagi setiap kali Anda memilih.",
  lines: {
    base: "Popover naik dari fokus lembut, lalu diam.",
    voice: "Dialog terbuka dari bawah seperti kotak teks novel visual.",
    flair: "Toggle yang dipilih meletup: memipih, lalu memanjang.",
  },
  calm: "Gerak tenang",
  motionLink: "Baca panduan gerak",
  stats: ["komponen", "dependensi runtime", "palet aksen", "suasana waktu"],
  blocks: "Layar jadi",
  blocksHeading: "Salin satu layar utuh ke aplikasi Anda",
  allBlocks: "Semua blok",
  next: "Pasang dalam satu baris",
  nextTitle: "Siap saat Anda mulai.",
  nextText: "Impor hanya bagian yang Anda pakai. Sisanya tidak masuk ke bundle Anda.",
  guide: "Baca panduan",
};
const t = computed(() => (id.value ? idn : en));

const line = ref(0);
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
  --hb-pad: clamp(48px, 7vw, 84px);
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
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}
.hb__kicker {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
}
.hb__kicker--accent {
  color: var(--bless-color-accent-text);
}
.hb__h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.18;
  letter-spacing: var(--bless-tracking-tight);
}
.hb__text {
  margin: 0;
  font-size: var(--bless-text-md);
  line-height: 1.65;
  color: var(--bless-color-text-muted);
}
.hb__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-accent-text);
  text-decoration: none;
}
.hb__link:hover {
  text-decoration: underline;
}

/* hero frame with abstract neutral art */
.hb__hero-wrap {
  padding-top: clamp(20px, 3vw, 36px);
  padding-bottom: clamp(24px, 4vw, 48px);
}
.hb__hero {
  position: relative;
  overflow: hidden;
  padding: clamp(32px, 6vw, 68px) clamp(24px, 5vw, 56px);
  border-radius: calc(var(--bless-radius) + 4px);
  background: var(--bless-light), var(--bless-sky);
  box-shadow: var(--bless-shadow-plate);
}
.hb__hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bless-color-surface) 84%, transparent) 0%,
    color-mix(in srgb, var(--bless-color-surface) 52%, transparent) 55%,
    transparent 100%
  );
  pointer-events: none;
}
.hb__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--bless-color-accent);
  pointer-events: none;
}
/* single overflow word per screen in weight 100 */
.hb__mark::before {
  content: "Blessing";
  position: absolute;
  right: -0.04em;
  bottom: -0.22em;
  z-index: 1;
  font-size: var(--bless-text-display);
  font-weight: var(--bless-font-weight-thin);
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--bless-color-text);
  opacity: 0.1;
  transform: skewX(var(--bless-lean));
  white-space: nowrap;
  pointer-events: none;
}
.hb__hero-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  max-width: 620px;
}
.hb__title {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 60px);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.08;
  letter-spacing: -0.03em;
}
.hb__lead {
  margin: 0;
  max-width: 540px;
  font-size: var(--bless-text-md);
  line-height: 1.65;
  color: var(--bless-color-text-muted);
}
.hb__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.hb__voice {
  margin-top: 28px;
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
  gap: 14px;
}
.hb__stage-light {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
}
.hb__stage {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  min-height: 280px;
  padding: 32px;
  border-radius: var(--bless-radius);
  background: var(--bless-light), var(--bless-color-bg);
  box-shadow: var(--bless-shadow-sm);
}
.hb__stage-word::before {
  content: attr(data-word);
}
.hb__stage-word {
  position: absolute;
  left: 20px;
  bottom: -10px;
  font-size: 96px;
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
  color: var(--bless-color-watermark);
  transform: skewX(var(--bless-lean));
  pointer-events: none;
}
.hb__card {
  position: relative;
  max-width: 400px;
  padding: 22px 26px;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-plate);
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
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-normal);
  line-height: 1.5;
}

.hb__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 52px;
}
.hb__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 22px;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
}
.hb__stat-num {
  font-size: clamp(36px, 4.5vw, 52px);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-tight);
  line-height: 1.1;
}
.hb__stat-label {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.hb__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 20px;
}
.hb__blocks {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.hb__block {
  display: block;
  overflow: hidden;
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: var(--bless-lean-transition);
}
.hb__block:hover,
.hb__block:focus-visible {
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
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}

/* epilogue */
.hb__next-wrap {
  padding-bottom: clamp(40px, 6vw, 72px);
}
.hb__next {
  /* night mood panel: the library parts inside read these tokens */
  --bless-color-text: #eee8e4;
  --bless-color-on-text: #1c1a22;
  --bless-color-text-muted: #a79ca6;
  --bless-color-border: #3a3542;
  --bless-color-surface: #25222c;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 56px);
  align-items: center;
  padding: clamp(28px, 5vw, 52px);
  border-radius: calc(var(--bless-radius) + 4px);
  background:
    radial-gradient(120% 80% at 100% 0%, #2a3a66 0%, transparent 55%),
    radial-gradient(70% 50% at 0% 0%, #3a2a44 0%, transparent 60%),
    var(--bless-color-media-bg);
  box-shadow: var(--bless-shadow-plate);
  color: var(--bless-color-text);
}
:global(.VPHome:has(.hb)) {
  margin-bottom: 0;
}
.hb__next .hb__text {
  color: #c9c0ca;
}
.hb__kicker--soft {
  color: var(--bless-color-accent-soft);
}
.hb__next-title {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-tight);
  line-height: 1.12;
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
  padding: 16px 20px;
  border-radius: var(--bless-radius);
  background: #25222c;
  color: #eee8e4;
  font-size: var(--bless-text-md);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08);
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

@media (max-width: 767px) {
  .hb__cols,
  .hb__blocks,
  .hb__next {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hb__mark {
    display: none;
  }
}
</style>
