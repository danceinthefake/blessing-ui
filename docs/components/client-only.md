---
title: ClientOnly
---

<script setup>
import ClientOnlyBasic from "../demos/ClientOnlyBasic.vue";
</script>

# ClientOnly

<p class="bless-lead">Render only in the browser</p>

For the one thing on a server-rendered page that can't be rendered on the server: it reads `window`, `navigator` or `localStorage`, it makes a blob URL, it shows `Date.now()` or a random id — anything that would differ between the server's HTML and the client's first render and trip a hydration mismatch. The slot mounts after hydration; until then `#fallback` shows. Make the fallback the same size as the content (a `BlessSkeleton` with the same box) so nothing jumps.

It costs you the HTML: the content isn't in the page for crawlers or for the first paint. So don't wrap what doesn't need it — no Bless component does, and dark mode and palettes are already applied post-hydration by `useTheme`. In this library only the `BlessAudioPlayer` demo uses it (blob URLs). On a client-only app it just delays the slot by a tick.

Nuxt ships its own `<ClientOnly>` with the same `#fallback`; use that there. This one is for plain Vue SSR and VitePress.

<Demo title="Basic">
  <ClientOnlyBasic />
  <template #code>

<<< ../demos/ClientOnlyBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessClientOnly } from "blessing-ui";
```

## API

<PropsTable name="BlessClientOnly" />
