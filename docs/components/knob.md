---
title: Knob
---

<script setup>
import KnobBasic from "../demos/KnobBasic.vue";
</script>

# Knob

<p class="bless-lead">Rotary dial on a native range input</p>

For compact settings in a dense panel — a mixer, an editor's inspector — where a row of knobs fits in the width one slider takes. Anywhere else use [Slider](./slider): the whole range is visible and it is more precise with a mouse.

<Demo title="Basic">
  <KnobBasic />
  <template #code>

<<< ../demos/KnobBasic.vue

  </template>
</Demo>

- Drag round the dial, or click a point on it. Turning past either end holds at that end instead of wrapping to the other.
- The keyboard is the native range underneath: arrows step, Page Up/Down jump, Home/End go to the ends.
- `format` sets the value both shown in the dial and read out (`35%`, `-20 dB`). `sweep` is the arc in degrees, gap at the bottom.
- `label` shows under the dial. Inside a [Field](./form) the field's label names it instead.

## Usage

```ts
import { BlessKnob } from "blessing-ui";
```

## API

<PropsTable name="BlessKnob" />
