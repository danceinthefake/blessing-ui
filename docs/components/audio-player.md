---
title: AudioPlayer
---

# AudioPlayer

<p class="bless-lead">Track list player</p>

Playing a few tracks in the page: a soundtrack sampler, a voice sample, a podcast episode. It wraps the native `<audio>`, so the browser handles formats and the lock-screen controls.

<Demo title="Basic">
  <AudioPlayerBasic />
  <template #code>

<<< ../demos/AudioPlayerBasic.vue

  </template>
</Demo>

- The play button keeps one name (`labels.play`) and says whether it is playing by its pressed state. The bar is a native range (`labels.seek`): arrows seek, and it reads "1:23 of 3:45".
- `v-model:time` gives the time in the current track, in seconds. Write it to seek, for example from a `BlessChapterList` or a `BlessTranscript` that emits `seek`.
- `v-model:playing` says whether it plays. Write `true` to start it, for example when someone picks an episode in a `BlessEpisodeList`. A new source keeps on playing if the old one played.
- With several tracks, the list picks one and playback moves on to the next when one ends.

## Usage

```ts
import { BlessAudioPlayer } from "blessing-ui";
```

## API

<PropsTable name="BlessAudioPlayer" />

<script setup>
import AudioPlayerBasic from "../demos/AudioPlayerBasic.vue";
</script>
