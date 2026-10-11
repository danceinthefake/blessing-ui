---
title: Banner
---

<script setup>
import BannerBasic from "../demos/BannerBasic.vue";
</script>

# Banner

<p class="bless-lead">Page-wide announcement bar</p>

A bar for one message to the whole page: a new version, planned maintenance, a cookie notice. For a message about one part of the page, use [Alert](./alert). For a message that goes away by itself, use [Toaster](./toaster).

<Demo title="Basic">
  <BannerBasic />
  <template #code>

<<< ../demos/BannerBasic.vue

  </template>
</Demo>

- It is ink by default. `danger`, `info` and `warning` fill the bar for status. There is no accent color, because color means chosen.
- `dismissible` (default) adds a close button. `v-model` holds the open state and `dismiss` fires on close.
- `persist` is a `localStorage` key. When a visitor dismisses the banner, it stays gone on the next visit. With `persist`, the banner shows after mount, because the server cannot know what the visitor dismissed.
- The `#action` slot holds a button or a link at the end of the bar.
- It is a labelled region (`label`, "Announcement" by default). It is not a live region, so it does not interrupt a screen reader.

## Usage

```ts
import { BlessBanner } from "blessing-ui";
```

## API

<PropsTable name="BlessBanner" />
