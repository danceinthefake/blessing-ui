---
title: AudioPlayer
---

<script setup>
import AudioPlayerBasic from "../demos/AudioPlayerBasic.vue";
</script>

# AudioPlayer

<p class="bless-lead">Track list player</p>

Playing a few tracks in the page — a soundtrack sampler, a voice sample, a podcast episode. It wraps the native `<audio>`, so the browser handles formats and the lock-screen controls.

<Demo title="Basic">
  <AudioPlayerBasic />
  <template #code>

<<< ../demos/AudioPlayerBasic.vue

  </template>
</Demo>

- The play button keeps one name (`playLabel`) and says whether it's playing by its pressed state. The bar is a native range (`seekLabel`): arrows seek, and it reads "1:23 of 3:45".
- With several tracks, the list picks one and playback moves on to the next when one ends.

## Usage

```ts
import { BlessAudioPlayer } from "blessing-ui";
```

## API

<PropsTable name="BlessAudioPlayer" />
