---
title: SliderCaptcha
---

<script setup>
import SliderCaptchaBasic from "../demos/SliderCaptchaBasic.vue";
</script>

# SliderCaptcha

<p class="bless-lead">Slide the piece into the gap: a human check</p>

A small puzzle before a form is sent: drag the handle until the loose piece fits the gap. It filters casual bots and mistakes, and it is nice to use on a phone. Enable your submit button with `v-model:verified`.

<Demo title="Basic">
  <SliderCaptchaBasic />
  <template #code>

<<< ../demos/SliderCaptchaBasic.vue

  </template>
</Demo>

::: warning Not security
Everything runs in the browser, so a script can skip it. Treat it as a speed bump: always check the real submission on the server (rate limits, a server-side challenge, or a service built for the job). The `verify` event gives you how long the solve took (`ms`) if you want to send that along as a weak signal.
:::

::: warning Not accessible on its own
The puzzle needs sight. Keyboard users can solve it (**← →** move the piece, **Shift** for bigger steps, **Enter** to submit), but a screen-reader user cannot see the gap. Offer another way through — an email link, a text challenge — next to it.
:::

- A miss resets the slider and moves the gap, so there is nothing to learn from a failed try. `tolerance` is how close counts, as a fraction of the track (default `0.03`).
- Pass `src` for a picture to cut the piece from; without it a checker pattern is drawn from the theme colours. The widget fills its container up to 360 px.
- Once solved it stays locked until `reset()` (exposed) is called.

## Usage

```ts
import { BlessSliderCaptcha } from "blessing-ui";
```

## API

<PropsTable name="BlessSliderCaptcha" />
