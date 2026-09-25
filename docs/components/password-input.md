---
title: PasswordInput
---

<script setup>
import PasswordInputBasic from "../demos/PasswordInputBasic.vue";
</script>

# PasswordInput

<p class="bless-lead">Password with reveal toggle and meter</p>

A password field with a reveal button. Add `meter` where someone is **making** a password (sign-up, change password): the field then asks password managers for a new one.

<Demo title="Basic">
  <PasswordInputBasic />
  <template #code>

<<< ../demos/PasswordInputBasic.vue

  </template>
</Demo>

- `autocomplete` is `current-password`, or `new-password` with `meter`; pass your own to override.
- The reveal button keeps one name (`showLabel`) and says whether it's on by its pressed state.
- Label it with a [Field](./form) like any input.

## Usage

```ts
import { BlessPasswordInput } from "blessing-ui";
```

## API

<PropsTable name="BlessPasswordInput" />
