---
title: Live blog
---

<script setup>
import LiveBlogBasic from "../demos/LiveBlogBasic.vue";
</script>

# Live blog

<p class="bless-lead">Timed updates that arrive while the reader reads, with a new-updates button</p>

Follows an event as it happens, such as a launch, a match, or a live show. Your app adds the updates. The component shows them.

<Demo title="Basic">
  <LiveBlogBasic />
  <template #code>

<<< ../demos/LiveBlogBasic.vue

  </template>
</Demo>

- `updates` is the list of updates, newest first. Each update has an `id`, a `time` as text, and a `body`. It can also have a `title`, `pinned`, and `key`.
- Pinned updates stay on top. A key moment has a mark, the word "Key moment", and a thick edge.
- New updates do not push the text down while the reader reads. They wait behind a button, such as "Show 2 new updates". A hidden status line says the same. The button shows the updates and moves the focus to the newest one.
- `live` shows a "Live" tag. Outside reduced motion, its dot pulses.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `live`, `pinned`, `key`, and `show` (a function).

## Usage

```ts
import { BlessLiveBlog } from "blessing-ui";
```

## API

<PropsTable name="BlessLiveBlog" />
