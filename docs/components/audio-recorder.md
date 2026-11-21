---
title: AudioRecorder
---

# AudioRecorder

<p class="bless-lead">Record from the microphone, with a preview</p>

Records a voice note, a comment, or an answer, in the browser, with the native `MediaRecorder`. People hear the recording before your app uploads it. To play a file, use the [audio player](./audio-player). To show the shape of a sound, use the [waveform](./waveform).

<Demo title="Basic">
  <AudioRecorderBasic />
  <template #code>

<<< ../demos/AudioRecorderBasic.vue

  </template>
</Demo>

- Record asks for the microphone. The browser asks for permission only then, not when the page opens.
- While it records, bars show the loudness, and the clock counts. Pause stops the clock and the recording, and Resume continues the same recording.
- Stop releases the microphone, sends the recording as a `Blob` with `record`, and shows a player for it. Record again starts a new one.
- `maxDuration` stops the recording after that many seconds. `mimeType` asks for a type, for example `audio/webm` or `audio/mp4`, if the browser supports it. Otherwise the browser chooses.
- When there is no microphone or no permission, a line says so, and `error` sends the reason. Record stays, so people can try again after they allow it.
- A status line says "Recording", "Paused", and the length when it stops, so a screen reader follows the state. The bars are hidden from screen readers.
- The microphone needs a secure page (HTTPS or `localhost`).
- Change the words with `labels` or a [label pack](../guide/translating): the buttons and the status words.

## Usage

```ts
import { BlessAudioRecorder } from "blessing-ui";
```

## API

<PropsTable name="BlessAudioRecorder" />

<script setup>
import AudioRecorderBasic from "../demos/AudioRecorderBasic.vue";
</script>
