---
title: Deploy list
---

# Deploy list

<p class="bless-lead">The deploys of a project with the state, the commit, the time, and a rollback</p>

Shows what went out to each environment of a web project, and lets the team go back to a good deploy.

<Demo title="Basic">
  <DeployListBasic />
  <template #code>

<<< ../demos/DeployListBasic.vue

  </template>
</Demo>

- `deploys` is the list, newest first. Each deploy has an `id`, a `state`, an `env`, a `commit`, and a `time`. It can also have a `message`, a `branch`, an `author`, a `duration`, a `url`, and `live`.
- The state is `queued`, `building`, `ready`, `failed`, or `canceled`. It shows as a shape and a word. The building shape turns, except when the reader asks for less motion.
- The deploy that serves its environment now has `live`. It gets a bar and a Live tag.
- The commit shows as a short hash of seven characters.
- A ready deploy has an Open link. A ready deploy that is not live has "Roll back to this", which emits `rollback`. A failed or canceled deploy has "Deploy again", which emits `redeploy`.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessDeployList } from "blessing-ui";
```

## API

<PropsTable name="BlessDeployList" />

<script setup>
import DeployListBasic from "../demos/DeployListBasic.vue";
</script>
