---
title: Agent plan
---

# Agent plan

<p class="bless-lead">The steps of an agent, each with its state</p>

Shows what an agent plans to do and how far it is. Each step is waiting, running, done, failed, or skipped. For the details of one call to a tool, use the [tool call](./tool-call). For steps of a form, use the [steps](./steps).

<Demo title="Basic">
  <AgentPlanBasic />
  <template #code>

<<< ../demos/AgentPlanBasic.vue

  </template>
</Demo>

- `steps` is a list of steps. Each step has an `id`, a `title`, a `status`, and an optional `detail`. The status is `pending`, `running`, `done`, `failed`, or `skipped`.
- Each state has its own icon: a ring, a spinner, a check, a cross, or a dash. The running step is bold, and a skipped step is struck through, so the color is not the only sign.
- The head shows the `title` of the plan, the count of done steps, and a bar.
- The running step has `aria-current="step"`. If the running step changes, a hidden status line reads it. Screen readers also hear the state after each step.
- Change the words with `labels` or a [label pack](../guide/translating): `pending`, `running`, `done`, `failed`, `skipped`, and `summary` (a function of the done steps and all steps).

## Usage

```ts
import { BlessAgentPlan } from "blessing-ui";
```

## API

<PropsTable name="BlessAgentPlan" />

<script setup>
import AgentPlanBasic from "../demos/AgentPlanBasic.vue";
</script>
