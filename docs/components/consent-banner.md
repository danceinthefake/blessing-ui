---
title: Consent banner
---

# Consent banner

<p class="bless-lead">A cookie consent bar with accept, reject, and a choice for each category</p>

Asks a visitor which cookies the site can use. The visitor can accept all, keep only the needed ones, or choose each category. For other notices at the top of a page, use the [banner](./banner).

<Demo title="Basic">
  <ConsentBannerBasic />
  <template #code>

<<< ../demos/ConsentBannerBasic.vue

  </template>
</Demo>

- `categories` is a list of categories. Each one has a `key`, a `label`, an optional `description`, and an optional `required`. A required category is always on.
- `v-model` is the choice, such as `{ needed: true, stats: false }`. It is empty until the visitor decides, and the banner shows only then.
- "Accept all" turns every category on. "Only the needed ones" keeps only the required ones. "Choose" opens a switch for each category and a save button. Each choice emits `change`.
- `persist` is a `localStorage` key. The choice stays for the next visit, and the banner does not show again. The banner reads the stored choice after the page loads, so it does not flash.
- `position` is `fixed` (default) at the bottom of the window, or `static` in the flow of the page. `policy-href` adds a link to your privacy policy.
- The banner only asks. Load your statistics or ads scripts only after `change` says yes.
- The banner is a region named by its title. Change the words with `labels` or a [label pack](../guide/translating): `title`, `message`, `accept`, `reject`, `customize`, `save`, `policy`, and `required`.

## Usage

```ts
import { BlessConsentBanner } from "blessing-ui";
```

## API

<PropsTable name="BlessConsentBanner" />

<script setup>
import ConsentBannerBasic from "../demos/ConsentBannerBasic.vue";
</script>
