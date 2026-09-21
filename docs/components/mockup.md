---
title: Mockup
---

<script setup>
import MockupBasic from "../demos/MockupBasic.vue";
</script>

# Mockup

<p class="bless-lead">Browser / window / phone frame</p>

Device chrome around a screenshot or a live piece of UI — for docs, a marketing page, a "what you'll get" panel. This site's homepage hero and OG card are a `browser` mockup around a screenshot. `browser` shows three dots and an address bar (`title`), `window` three dots and a title, `phone` a notch and a home bar; `dark` for a dark frame. A bare `<img>` or `<video>` inside fills the screen.

The phone's rounded corners are the device, not the shape system — a phone with cut corners reads as a television. The frame is `aria-hidden` decoration; whatever you put on the screen is the accessible content.

<Demo title="Basic">
  <MockupBasic />
  <template #code>

<<< ../demos/MockupBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessMockup } from "blessing-ui";
```

## API

<PropsTable name="BlessMockup" />
