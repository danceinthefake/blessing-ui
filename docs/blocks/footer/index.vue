<template>
  <footer class="site-footer">
    <div class="site-footer__top">
      <div class="site-footer__about">
        <a href="#" class="site-footer__brand">Blessing</a>
        <BlessText as="p" size="sm" muted
          >Quiet parts for loud stories. One letter a month.</BlessText
        >
        <BlessNewsletterSignup
          v-model="email"
          :status
          :error
          privacy-href="#privacy"
          @subscribe="subscribe"
        />
      </div>
      <nav aria-label="Footer" class="site-footer__cols">
        <div v-for="c in columns" :key="c.title">
          <BlessText as="h2" size="sm" weight="bold">{{ c.title }}</BlessText>
          <ul role="list" class="site-footer__list">
            <li v-for="l in c.links" :key="l.label">
              <a :href="l.href">{{ l.label }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <BlessSeparator />
    <div class="site-footer__bottom">
      <BlessText size="xs" muted>© {{ year }} Blessing Studio</BlessText>
      <ul role="list" class="site-footer__legal">
        <li v-for="l in legal" :key="l.label">
          <a :href="l.href">{{ l.label }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessNewsletterSignup, BlessSeparator, BlessText } from "blessing-ui";
import { mockFooterApi as api } from "./api";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#docs" },
      { label: "Blog", href: "#blog" },
      { label: "Help center", href: "#help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
];
const legal = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Cookies", href: "#cookies" },
];
const year = new Date().getFullYear();

const email = ref("");
const status = ref<"idle" | "loading" | "done">("idle");
const error = ref<string>();
async function subscribe(address: string) {
  status.value = "loading";
  error.value = undefined;
  try {
    await api.subscribe(address);
    status.value = "done";
  } catch (e) {
    error.value = (e as Error).message;
    status.value = "idle";
  }
}
</script>

<style scoped>
.site-footer {
  padding: var(--bless-space-8) var(--bless-space-6) var(--bless-space-6);
  border-top: 1px solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.site-footer__top {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: var(--bless-space-8);
  margin-bottom: var(--bless-space-8);
}
.site-footer__brand {
  display: inline-block;
  margin-bottom: var(--bless-space-2);
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text);
  text-decoration: none;
}
.site-footer__cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--bless-space-6);
}
.site-footer__list,
.site-footer__legal {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.site-footer__list li {
  padding: var(--bless-space-1) 0;
}
.site-footer__list a,
.site-footer__legal a {
  color: var(--bless-color-text-muted);
}
.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--bless-space-3);
  padding-top: var(--bless-space-4);
}
.site-footer__legal {
  display: flex;
  gap: var(--bless-space-4);
  font-size: var(--bless-text-xs);
}
@media (max-width: 720px) {
  .site-footer {
    padding-inline: var(--bless-space-4);
  }
  .site-footer__top {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 420px) {
  .site-footer__cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
