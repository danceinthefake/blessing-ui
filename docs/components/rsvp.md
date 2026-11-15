---
title: RSVP
---

<script setup>
import RsvpBasic from "../demos/RsvpBasic.vue";
</script>

# RSVP

<p class="bless-lead">Going, maybe, or not going, with counts and faces</p>

Asks a person if they come to an event, and shows how many others come. The faces of some people who go show under the buttons. For a question with your own answers, use the [poll](./poll).

<Demo title="Basic">
  <RsvpBasic />
  <template #code>

<<< ../demos/RsvpBasic.vue

  </template>
</Demo>

- `v-model` is the answer of the reader: `yes`, `maybe`, `no`, or none. A second click on the chosen answer clears it.
- `counts` gives the answers of the other people, without the reader. The answer of the reader adds one to its count. So, if the reader changes the answer, the numbers stay right. Send each change to your server.
- `going` is a list of some of the people who go, each with a `name` and an optional `src`. They show as an [avatar group](./avatar-group). If the reader goes, "you" comes first.
- `label` is the question, such as the name of the event, and it names the group of buttons.
- Each answer is a toggle button with `aria-pressed`, and the chosen one is filled. Change the words with `labels` or a [label pack](../guide/translating): `yes`, `maybe`, `no`, `question`, `you`, and `goingCount` (a function of the count).

## Usage

```ts
import { BlessRsvp } from "blessing-ui";
```

## API

<PropsTable name="BlessRsvp" />
