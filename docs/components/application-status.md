---
title: Application status
---

<script setup>
import ApplicationStatusBasic from "../demos/ApplicationStatusBasic.vue";
</script>

# Application status

<p class="bless-lead">The reference, the steps of a request with their dates, and what happens next</p>

Tells a person where their request is, such as a permit, a benefit, or a visa, so they do not need to call.

<Demo title="Basic">
  <ApplicationStatusBasic />
  <template #code>

<<< ../demos/ApplicationStatusBasic.vue

  </template>
</Demo>

- `title` names the service, and `reference` is the number that the person can quote.
- `state` is `progress`, `action`, `approved`, or `rejected`. It shows as a mark and words in a status line.
- `steps` is the list of steps, each with a `label`, a `date` when it is done, and an optional `note`. `current` is the index of the step that goes on now.
- Done steps get a check and a solid line. The step now gets a ring and `aria-current`. Steps to come are dashed. Screen readers hear "done", "now", or "to come" after each step.
- If the state is approved or rejected, all steps up to `current` show as done.
- `action` says what the person must do, and `action-href` with `action-label` gives the link to do it.
- `next` says what happens next, in plain words.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessApplicationStatus } from "blessing-ui";
```

## API

<PropsTable name="BlessApplicationStatus" />
