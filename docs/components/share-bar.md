---
title: Share bar
---

<script setup>
import ShareBarBasic from "../demos/ShareBarBasic.vue";
</script>

# Share bar

<p class="bless-lead">Share a page through the Web Share API, with copy link as a fallback</p>

Lets a reader share an article, an episode, or a product. On phones and some desktop browsers, it opens the share sheet of the system.

<Demo title="Basic">
  <ShareBarBasic />
  <template #code>

<<< ../demos/ShareBarBasic.vue

  </template>
</Demo>

- `url` is the page to share, and `title` is its title.
- If the browser has the Web Share API, a "Share…" button opens the share sheet of the system. The button shows after the page loads, because only the browser knows.
- "Copy link" copies the address. A hidden status line then says "Link copied", and the button says it too.
- `targets` is a list of your own share links, each with a `label` and an `href`. The bar has no built-in services, so you choose which ones to show and you write their links.
- Each share emits `shared` with how: `system`, `copy`, or the label of the target.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `share`, `copy`, and `copied`.

## Usage

```ts
import { BlessShareBar } from "blessing-ui";
```

## API

<PropsTable name="BlessShareBar" />
