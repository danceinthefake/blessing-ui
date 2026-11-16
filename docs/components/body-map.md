---
title: Body map
---

<script setup>
import BodyMapBasic from "../demos/BodyMapBasic.vue";
</script>

# Body map

<p class="bless-lead">A body outline where a person points to the place of pain</p>

Asks where it hurts in a symptom form or before a visit to a doctor. The person taps the parts of the body. The component does not give medical advice.

<Demo title="Basic">
  <BodyMapBasic />
  <template #code>

<<< ../demos/BodyMapBasic.vue

  </template>
</Demo>

- `v-model` is the list of chosen parts, such as `["neck", "rightArm"]`. There are 13 parts, from the `head` to the `leftFoot`.
- The outline is a front view, as a doctor sees the person. The right arm of the person is on the left of the picture.
- Each part is a check box that the keyboard can reach. Tab moves between the parts, and Space or Enter toggles one. Screen readers hear the name of the part and whether it is checked.
- A chosen part is filled and has a thick dashed edge. A line under the picture names the chosen parts.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `none`, `chosen` (a function), and the name of each part.

## Usage

```ts
import { BlessBodyMap } from "blessing-ui";
```

## API

<PropsTable name="BlessBodyMap" />
