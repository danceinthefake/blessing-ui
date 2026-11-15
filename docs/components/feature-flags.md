---
title: Feature flags
---

<script setup>
import FeatureFlagsBasic from "../demos/FeatureFlagsBasic.vue";
</script>

# Feature flags

<p class="bless-lead">Flags with a switch, a note, the rollout share, and the environment</p>

Lets a team turn features on and off for a part of the users, on an admin page. Each flag shows how many users get it while it is on. For one setting with a switch, use the [switch](./switch).

<Demo title="Basic">
  <FeatureFlagsBasic />
  <template #code>

<<< ../demos/FeatureFlagsBasic.vue

  </template>
</Demo>

- `flags` is a list of flags. Each flag has a `key` and a `name`, and an optional `description`, `rollout` share from 0 to 100, and `env`.
- `v-model` holds which flags are on, by key. A switch emits `toggle` with the key and the new state. Send it to your server.
- A bar and a line show who gets an on flag: a share such as "25% of users", or "All users" with no rollout. An off flag says "Off".
- Each switch is a [switch](./switch) named by the name of its flag. The list is a region. Change the words with `labels` or a [label pack](../guide/translating): `title`, `everyone`, `off`, and `rollout` (a function of the share).

## Usage

```ts
import { BlessFeatureFlags } from "blessing-ui";
```

## API

<PropsTable name="BlessFeatureFlags" />
