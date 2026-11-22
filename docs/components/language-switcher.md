---
title: LanguageSwitcher
---

# LanguageSwitcher

<p class="bless-lead">Pick the language: a select or a list of links</p>

<Demo title="Basic">
  <LanguageSwitcherBasic />
  <template #code>

<<< ../demos/LanguageSwitcherBasic.vue

  </template>
</Demo>

<Demo title="Links">
  <LanguageSwitcherLinks />
  <template #code>

<<< ../demos/LanguageSwitcherLinks.vue

  </template>
</Demo>

- Write each language name in the language itself, for example "Bahasa Indonesia", not "Indonesian". A reader looks for their own language, and may not read the current one.
- Each name has its own `lang`, so a screen reader says it with the right voice.
- With `href`, the switcher is a list of links, for a footer or a site that has one URL per language. The current language has `aria-current`, and each link has `hreflang`. Without `href`, it is a native `<select>`, and `v-model` gives the code.
- The switcher does not change the page language itself. Load the words and set `lang` on `<html>` when `v-model` changes.

## Usage

```ts
import { BlessLanguageSwitcher } from "blessing-ui";
```

## API

<PropsTable name="BlessLanguageSwitcher" />

<script setup>
import LanguageSwitcherBasic from "../demos/LanguageSwitcherBasic.vue";
import LanguageSwitcherLinks from "../demos/LanguageSwitcherLinks.vue";
</script>
