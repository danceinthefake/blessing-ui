---
title: Tooltip
---

<script setup>
import TooltipBasic from "../demos/TooltipBasic.vue";
</script>

# Tooltip

<p class="bless-lead">Hover/focus tip</p>

A short hint for a control whose purpose is not obvious from its icon. Never put essential information or anything interactive in a tooltip. Touch screens rarely show it. For richer content, [Popover](./popover).

<Demo title="Basic">
  <TooltipBasic />
  <template #code>

<<< ../demos/TooltipBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` at a `<div>`. For this reason, a trigger placed inside a paragraph renders differently on the server and the client. Wrap it in a `<span>` or `<div>` instead.
:::

- It shows on hover and on keyboard focus, and it describes the element inside it (the hint is read after the name). Esc hides it.
- The pointer can move onto the tip without it disappearing. An icon-only button still needs its own name. The tooltip is a description, not the label.

## Usage

```ts
import { BlessTooltip } from "blessing-ui";
```

## API

<PropsTable name="BlessTooltip" />
