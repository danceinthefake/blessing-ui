---
title: Link
---

# Link

<p class="bless-lead">Text link, always underlined; router-aware</p>

<Demo title="Basic">
  <LinkBasic />
  <template #code>

<<< ../demos/LinkBasic.vue

  </template>
</Demo>

- A link in text is always underlined. Color alone does not show a link to a reader who cannot see the color (WCAG 1.4.1).
- `external` opens the page in a new tab. It adds an arrow and the hidden words "opens in a new tab", so a screen reader user knows before the click. `labels.newTab` changes the words.
- If you provide a router link with `blessLinkKey`, an in-app path goes through it. An external link stays a plain `<a>`.
- `muted` is for a footer or a caption. The underline stays.

## Usage

```ts
import { BlessLink } from "blessing-ui";
```

## API

<PropsTable name="BlessLink" />

<script setup>
import LinkBasic from "../demos/LinkBasic.vue";
</script>
