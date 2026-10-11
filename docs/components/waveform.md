---
title: Waveform
---

<script setup>
import WaveformBasic from "../demos/WaveformBasic.vue";
</script>

# Waveform

<p class="bless-lead">Audio peaks that you click or key to seek</p>

The shape of a sound as bars, and a way to move through it. Use it for a voice note, a podcast, or a track list where the position matters. It draws the bars and takes the position. It does not play sound. Pair it with an `<audio>` element or with [AudioPlayer](./audio-player).

<Demo title="Basic">
  <WaveformBasic />
  <template #code>

<<< ../demos/WaveformBasic.vue

  </template>
</Demo>

- `v-model` is the position from 0 to 1. The played bars take the accent color, because color means chosen. The rest stay gray.
- Give `peaks` (0 to 1 for each slice) or give `src`. With `src`, the browser fetches the file and decodes it after mount, and the bars fill in then. The server renders no bars. Compute `peaks` on your server for a long file, because decoding a long file in the browser is slow and uses memory.
- `bars` is the number of bars (default 64). A longer `peaks` list is cut to this number, and each bar shows the loudest value of its slice.
- A native range lies over the bars, so a click, a drag, a touch, and the arrow keys all seek. `label` names it. `valueText` writes the position for a screen reader, for example `1:05` (default: a percent).
- `seek` fires when the person moves the position. It does not fire when you change `v-model` from your code, so a playing clock can drive the bars without a loop. `error` fires when `src` cannot be read.
- `loadPeaks`, `peaksFromChannel`, and `downsample` are exported.

## Usage

```ts
import { BlessWaveform } from "blessing-ui";
```

## API

<PropsTable name="BlessWaveform" />
