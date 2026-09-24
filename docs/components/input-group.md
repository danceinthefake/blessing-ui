---
title: InputGroup
---

<script setup>
import InputGroupBasic from "../demos/InputGroupBasic.vue";
</script>

# InputGroup

<p class="bless-lead">Shared surface: addons + any control</p>

One control plus fixed pieces that share its plate: `https://` before a domain, `¥` before a price, a unit select, a Go button. They read as one field, focus as one field, and `disabled` covers the lot.

<Demo title="Basic">
  <InputGroupBasic />
  <template #code>

<<< ../demos/InputGroupBasic.vue

  </template>
</Demo>

- Things that belong **inside** the field — a search icon, a `⌘K` hint — are [Input](./input)'s own `#prefix` / `#suffix`. A button that isn't attached to the field is just a [Button](./button) beside it.
- `size` sets the group's height; give the control inside the same `size` so its text matches.
- The group renders a `<fieldset>`, so `disabled` really disables every control inside it, not just the look.

## Usage

```ts
import { BlessInputGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessInputGroup" />
