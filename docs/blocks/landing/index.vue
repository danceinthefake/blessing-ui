<template>
  <div class="landing">
    <section class="landing__hero" aria-labelledby="landing-title">
      <BlessText as="p" size="xs" weight="bold" class="landing__kicker"
        >Blessing Studio · now in beta</BlessText
      >
      <BlessText id="landing-title" as="h1" weight="light" class="landing__title">
        Ship the site of your story in a weekend
      </BlessText>
      <BlessText as="p" muted class="landing__lead">
        Pages, a shop, and a newsletter for your circle, built from parts that already pass the
        accessibility checks. You write the story. We keep the site quiet around it.
      </BlessText>
      <div class="landing__ctas">
        <BlessButton href="#start" size="lg">Start free</BlessButton>
        <BlessButton href="#demo" variant="outline" size="lg">Watch the demo</BlessButton>
      </div>
    </section>

    <BlessLogoCloud :logos title="Used by 1,200 circles and studios" mono />

    <section class="landing__band" aria-labelledby="landing-features">
      <BlessText id="landing-features" as="h2" size="lg" weight="light">What you get</BlessText>
      <BlessFeatureGrid :features :columns="3">
        <template #icon="{ index }">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="landing__icon">
            <path :d="icons[index]" />
          </svg>
        </template>
      </BlessFeatureGrid>
    </section>

    <section class="landing__numbers" aria-label="In numbers">
      <dl>
        <div v-for="n in numbers" :key="n.label">
          <dt>{{ n.label }}</dt>
          <dd><BlessCountUp :value="n.value" :options="n.options" appear locale="en-US" /></dd>
        </div>
      </dl>
    </section>

    <section class="landing__band" aria-labelledby="landing-quotes">
      <BlessText id="landing-quotes" as="h2" size="lg" weight="light">From the circles</BlessText>
      <BlessTestimonials :items="quotes" />
    </section>

    <section class="landing__band landing__faq" aria-labelledby="landing-faq">
      <BlessText id="landing-faq" as="h2" size="lg" weight="light">Questions</BlessText>
      <BlessAccordion>
        <BlessAccordionItem v-for="q in faq" :key="q.q" :title="q.q">
          <BlessText as="p" size="sm">{{ q.a }}</BlessText>
        </BlessAccordionItem>
      </BlessAccordion>
    </section>

    <section id="start" class="landing__close" aria-labelledby="landing-close">
      <BlessText id="landing-close" as="h2" size="xl" weight="light"
        >Your first page is free</BlessText
      >
      <BlessText as="p" muted>No card. Upgrade when the shop opens.</BlessText>
      <BlessButton href="#signup" size="lg">Start free</BlessButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  BlessAccordion,
  BlessAccordionItem,
  BlessButton,
  BlessCountUp,
  BlessFeatureGrid,
  BlessLogoCloud,
  BlessTestimonials,
  BlessText,
} from "blessing-ui";

// a wordmark as an SVG data URL, so the block needs no image files; put your partners' logos here.
// The mid gray reads on light and on dark.
const wordmark = (name: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><text x="50%" y="58%" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#80808a" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>`)}`;
const logos = ["Hanamichi", "Kumo Works", "Sora Press", "Lantern", "Tidepool"].map((name) => ({
  name,
  src: wordmark(name),
  href: "#",
}));
const features = [
  {
    title: "Pages that read well",
    text: "News, characters, and episodes, with type that stays calm on any screen.",
  },
  {
    title: "A shop in the same site",
    text: "Products, variants, and checkout. Payments go to your own account.",
  },
  {
    title: "A newsletter you own",
    text: "Collect addresses with consent, and export them when you want.",
  },
  {
    title: "Dark mode and palettes",
    text: "Every page works in light and dark, and in each palette you pick.",
  },
  {
    title: "Checked for access",
    text: "Keyboard, screen reader, and contrast checks run on every part.",
  },
  {
    title: "Two languages",
    text: "Write each page in English and in Bahasa Indonesia, side by side.",
  },
];
// simple stroke icons, 24×24
const icons = [
  "M4 5h16M4 10h16M4 15h10",
  "M5 8h14l-1 11H6zM9 8V6a3 3 0 0 1 6 0v2",
  "M4 6h16v12H4zM4 6l8 7 8-7",
  "M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z",
  "M5 12l4 4 10-10",
  "M4 5h8M8 3v2M5 13c3-1 5-4 6-8M7 9c1 2 3 3 5 4M13 21l4-10 4 10M14.5 18h5",
];
const numbers = [
  { label: "Circles on Blessing", value: 1200 },
  { label: "Pages published", value: 48000 },
  { label: "Pages that pass the checks", value: 1, options: { style: "percent" } as const },
];
const quotes = [
  {
    quote: "We moved our circle site in one evening. The shop opened the next morning.",
    name: "Rina",
    role: "Circle Hanamichi",
  },
  {
    quote: "Readers on old phones finally see the same page as we do.",
    name: "Dimas",
    role: "Sora Press",
  },
  {
    quote: "Dark mode just works, and so does the Indonesian copy.",
    name: "Aya",
    role: "Kumo Works",
  },
];
const faq = [
  {
    q: "Is it free?",
    a: "Your first page is free for as long as you want. Paid plans add the shop and more pages.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Point your domain at us, and we set up the certificate.",
  },
  {
    q: "Who owns the newsletter list?",
    a: "You do. Export it as CSV at any time, and take it with you.",
  },
  {
    q: "Does it work without JavaScript?",
    a: "Pages render on the server, so the text and the links work before any script loads.",
  },
];
</script>

<style scoped>
.landing {
  display: grid;
  gap: var(--bless-space-12);
  padding: var(--bless-space-8) var(--bless-space-6);
}
.landing__hero {
  display: grid;
  gap: var(--bless-space-4);
  justify-items: start;
  max-width: 44rem;
  padding-block: var(--bless-space-8);
}
.landing__kicker {
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.landing__title {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.1;
}
.landing__lead {
  max-width: 36rem;
}
.landing__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-3);
}
.landing__band {
  display: grid;
  gap: var(--bless-space-6);
}
.landing__icon {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.landing__numbers dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--bless-space-6);
  margin: 0;
  padding-block: var(--bless-space-6);
  border-block: 1px solid var(--bless-color-border);
}
.landing__numbers dt {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.landing__numbers dd {
  margin: var(--bless-space-1) 0 0;
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-light);
}
.landing__faq {
  max-width: 44rem;
}
.landing__close {
  display: grid;
  gap: var(--bless-space-3);
  justify-items: center;
  padding: var(--bless-space-8) var(--bless-space-4);
  text-align: center;
  background: var(--bless-color-surface);
}
@media (max-width: 760px) {
  .landing {
    padding-inline: var(--bless-space-4);
  }
}
</style>
