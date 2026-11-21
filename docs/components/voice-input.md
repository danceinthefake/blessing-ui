---
title: Voice input
---

# Voice input

<p class="bless-lead">A microphone button that turns speech into text</p>

Lets a person speak instead of type, for example into the [prompt input](./prompt-input) or a field for notes. It uses the Web Speech API of the browser, so it adds no library. To record sound as a file, use the [audio recorder](./audio-recorder).

<Demo title="Basic">
  <VoiceInputBasic />
  <template #code>

<<< ../demos/VoiceInputBasic.vue

  </template>
</Demo>

- `v-model` is the text. Each finished phrase is added at the end, and each one also emits `result`. Put the same `v-model` on a field to type and speak into the same text.
- A click starts the dictation, and a second click stops it. While the browser listens, the button is filled and a ring grows with the loudness of the voice. The words that are not final yet show in gray next to the button.
- `lang` sets the language of the speech, such as `id-ID`. The default is the language of the page. With `continuous` (on by default), the dictation goes on after a pause.
- Chrome, Edge, and Safari have the Web Speech API. In other browsers, the button is disabled, and a note says that speech to text is not available. Chrome sends the sound to a server to read it.
- If the person does not allow the microphone, a note says so and the component emits `error`.
- The button is a toggle with `aria-pressed`. A hidden status line says "Listening…" and "Dictation stopped". Change the words with `labels` or a [label pack](../guide/translating): `start`, `stop`, `listening`, `stopped`, `unsupported`, and `denied`.

## Usage

```ts
import { BlessVoiceInput } from "blessing-ui";
```

## API

<PropsTable name="BlessVoiceInput" />

<script setup>
import VoiceInputBasic from "../demos/VoiceInputBasic.vue";
</script>
