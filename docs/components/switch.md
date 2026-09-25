---
title: Switch
---

<script setup>
import SwitchBasic from "../demos/SwitchBasic.vue";
</script>

# Switch

<p class="bless-lead">role=switch toggle</p>

A setting that takes effect the moment it's flipped — notifications on, dark mode. When the choice only applies after a Save button, use a [Checkbox](./checkbox): a switch promises it's already done.

<Demo title="Basic">
  <SwitchBasic />
  <template #code>

<<< ../demos/SwitchBasic.vue

  </template>
</Demo>

- A native checkbox with `role="switch"`, so it's read as on / off and Space flips it.
- The slot is its label; `labelPosition="start"` puts the label first. In a [Field](./form) it gets the field's description and error.
- In right-to-left pages the thumb travels the other way.

## Usage

```ts
import { BlessSwitch } from "blessing-ui";
```

## API

<PropsTable name="BlessSwitch" />
