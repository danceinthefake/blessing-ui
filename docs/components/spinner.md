---
title: Spinner
---

<script setup>
import SpinnerBasic from "../demos/SpinnerBasic.vue";
</script>

# Spinner

<p class="bless-lead">Loading indicator (role=status)</p>

"Busy" with no shape to promise and no percentage to show: beside a label, in a table cell, inside a button (`BlessButton loading` does it). An outline square with one open edge, turning: the plate, spinning. `color="current"` (default) takes the text color it sits beside: busy is not a choice, so it stays ink. `accent` is for a spinner on something the person just chose. Under `prefers-reduced-motion` it turns at half speed rather than stopping, because a stopped loader reads as done.

It announces itself as a `status` named `label` ("Loading" by default: say _what_ is loading when you can). If a parent already says that it is busy (a button with `aria-busy`, a region with its own status), pass `label=""`. The spinner is then decorative, so nothing is announced twice. The own components of the library do this.

Content that is not there yet, with a known shape: [Skeleton](./skeleton). A region that must stay visible but untouchable: [BlockUI](./block-ui). A page-level line: [LoadingBar](./loading-bar). A number: [CircularProgress](./circular-progress).

<Demo title="Basic">
  <SpinnerBasic />
  <template #code>

<<< ../demos/SpinnerBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessSpinner } from "blessing-ui";
```

## API

<PropsTable name="BlessSpinner" />
