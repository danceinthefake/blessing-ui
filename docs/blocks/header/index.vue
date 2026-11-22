<template>
  <header class="site-header">
    <a href="#" class="site-header__brand">Blessing</a>
    <BlessNavigationMenu :items="links" class="site-header__nav" />
    <div class="site-header__actions">
      <BlessThemeToggle />
      <BlessButton href="#signin" variant="outline" size="sm" class="site-header__wide">
        Sign in
      </BlessButton>
      <BlessButton
        variant="ghost"
        size="sm"
        class="site-header__menu"
        aria-haspopup="dialog"
        @click="open = true"
        >Menu</BlessButton
      >
    </div>
    <BlessSheet v-model="open" title="Menu">
      <nav aria-label="Main">
        <ul role="list" class="site-header__list">
          <li v-for="l in links" :key="l.label">
            <template v-if="l.items">
              <span class="site-header__group">{{ l.label }}</span>
              <ul role="list" class="site-header__list site-header__sub">
                <li v-for="i in l.items" :key="i.label">
                  <a :href="i.href" @click="open = false">{{ i.label }}</a>
                </li>
              </ul>
            </template>
            <a
              v-else
              :href="l.href"
              :aria-current="l.active ? 'page' : undefined"
              @click="open = false"
              >{{ l.label }}</a
            >
          </li>
        </ul>
      </nav>
      <BlessButton href="#signin" variant="outline" block @click="open = false"
        >Sign in</BlessButton
      >
    </BlessSheet>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessButton,
  BlessNavigationMenu,
  BlessSheet,
  BlessThemeToggle,
  type BlessNavMenuItem,
} from "blessing-ui";

const open = ref(false);
const links: BlessNavMenuItem[] = [
  { label: "Home", href: "#", active: true },
  {
    label: "Product",
    items: [
      { label: "Features", href: "#features", description: "What it does, screen by screen." },
      { label: "Pricing", href: "#pricing", description: "Three plans, billed monthly or yearly." },
      { label: "Changelog", href: "#changelog", description: "What changed in each release." },
    ],
  },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
];
</script>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  gap: var(--bless-space-6);
  padding: var(--bless-space-3) var(--bless-space-6);
  border-bottom: 1px solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.site-header__brand {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text);
  text-decoration: none;
}
.site-header__actions {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin-inline-start: auto;
}
.site-header__menu {
  display: none;
}
.site-header__list {
  margin: 0 0 var(--bless-space-6);
  padding: 0;
  list-style: none;
}
.site-header__list a,
.site-header__group {
  display: block;
  padding: var(--bless-space-2) 0;
  color: var(--bless-color-text);
  text-decoration: none;
}
.site-header__list a[aria-current="page"] {
  font-weight: var(--bless-font-weight-bold);
}
.site-header__group {
  color: var(--bless-color-text-muted);
}
.site-header__list .site-header__sub {
  margin: 0;
  padding-inline-start: var(--bless-space-4);
}
@media (max-width: 720px) {
  .site-header {
    padding-inline: var(--bless-space-4);
  }
  .site-header__nav,
  .site-header__wide {
    display: none;
  }
  .site-header__menu {
    display: inline-flex;
  }
}
</style>
