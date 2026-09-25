---
title: Video
---

<script setup>
import VideoBasic from "../demos/VideoBasic.vue";
</script>

# Video

<p class="bless-lead">Responsive embed or native video</p>

An embedded video — a trailer from YouTube or Vimeo (an iframe), or your own file (`native`). `title` names the frame; it's required.

<Demo title="Basic">
  <VideoBasic />
  <template #code>

<<< ../demos/VideoBasic.vue

  </template>
</Demo>

- With `native`, put `<track kind="captions">` (and `<source>`s) in the default slot. Caption spoken content; it's the accessible way in for many people.
- `ratio` keeps the frame's shape before the player loads.

## Usage

```ts
import { BlessVideo } from "blessing-ui";
```

## API

<PropsTable name="BlessVideo" />
