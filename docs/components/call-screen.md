---
title: Call screen
---

# Call screen

<p class="bless-lead">Video tiles for each person, with mute, camera, share, and hang up</p>

The screen of a video call. The component draws the layout and the controls. Your app connects the call and gives the video of each person.

<Demo title="Basic">
  <CallScreenBasic />
  <template #code>

<<< ../demos/CallScreenBasic.vue

  </template>
</Demo>

- `people` is a list of people in the call. Each person has an `id` and a `name`. They can also have an `avatar`, `muted`, `cameraOff`, and `speaking`.
- The `video` slot gets each `person`. Put a `video` element with their stream in it. If the camera of a person is off, or the slot is empty, the tile shows the avatar.
- The person who speaks gets a ring and the word "speaking" after the name. A muted person gets a mark and the word "muted".
- The grid has one column for one person, two columns for up to four, and three columns for more.
- The buttons are toggles: `v-model:muted`, `v-model:camera`, and `v-model:sharing`. "Leave the call" emits `leave`. `elapsed` shows the time in the call, as text.
- The screen stays dark in both themes, as video looks best on a dark ground.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `mute`, `camera`, `share`, `leave`, `muted`, `speaking`, and `controls`.

## Usage

```ts
import { BlessCallScreen } from "blessing-ui";
```

## API

<PropsTable name="BlessCallScreen" />

<script setup>
import CallScreenBasic from "../demos/CallScreenBasic.vue";
</script>
