---
title: Mini player
---

<script setup>
import MiniPlayerBasic from "../demos/MiniPlayerBasic.vue";
</script>

# Mini player

<p class="bless-lead">A small player that stays on the screen, with the track and the controls</p>

Keeps the sound going while the listener moves through an app. It shows the state and sends the actions. Your app plays the sound, for example with the [audio player](./audio-player) or an `audio` element.

<Demo title="Basic">
  <MiniPlayerBasic />
  <template #code>

<<< ../demos/MiniPlayerBasic.vue

  </template>
</Demo>

- `title`, `artist`, and `image` describe the track. `duration` is its length in seconds.
- `v-model:playing` is true while it plays. The round button says "Play" or "Pause".
- `v-model:position` is the place in seconds. A thin native slider across the top shows it and moves it. Screen readers hear the time, such as "12:34 of 44:00".
- The ⏮ and ⏭ buttons emit `previous` and `next`. A click on the track emits `open`, for a full player.
- With `docked`, the player sticks to the bottom of the screen.
- On narrow screens, the time hides. The slider still says it.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `play`, `pause`, `previous`, `next`, `open`, `position`, and `time` (a function).

## Usage

```ts
import { BlessMiniPlayer } from "blessing-ui";
```

## API

<PropsTable name="BlessMiniPlayer" />
