---
title: PullToRefresh
---

<script setup>
import PullToRefreshBasic from "../demos/PullToRefreshBasic.vue";
</script>

# PullToRefresh

<p class="bless-lead">Drag down to reload</p>

Pull down at the top of a list to reload it, the way phone apps do. It only works by touch, so also give a visible refresh button for everyone else.

<Demo title="Basic">
  <PullToRefreshBasic />
  <template #code>

<<< ../demos/PullToRefreshBasic.vue

  </template>
</Demo>

- `@refresh` gets a `done` callback; call it when the reload has finished. "Refreshing" (`refreshingLabel`) is announced meanwhile.
- `threshold` is how far to pull; `scrollTarget` is the container whose top counts, when it isn't the wrapper.

## Usage

```ts
import { BlessPullToRefresh } from "blessing-ui";
```

## API

<PropsTable name="BlessPullToRefresh" />
