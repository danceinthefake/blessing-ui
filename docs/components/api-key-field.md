---
title: API key field
---

# API key field

<p class="bless-lead">A secret key, hidden by default, with show, copy, and make a new key</p>

Shows a secret key on a settings page, so a person can copy it into an app. The key is hidden until the person asks to see it. For a password that a person types, use the [password input](./password-input).

<Demo title="Basic">
  <ApiKeyFieldBasic />
  <template #code>

<<< ../demos/ApiKeyFieldBasic.vue

  </template>
</Demo>

- `value` is the key. While it is hidden, only its start, such as `sk_demo_`, and its last four letters show. Screen readers hear the same short form.
- The eye button shows or hides the full key. It is a toggle with `aria-pressed`.
- "Copy" copies the full key, also while it is hidden, and emits `copy`. A hidden status line says "Copied".
- "Make a new key" opens a [confirm popup](./confirm-popup) that says the old key stops working. Only the confirm emits `regenerate`. Make the new key on your server, then set `value`. `:regenerable="false"` hides this button.
- `name`, `created`, and `last-used` add the name of the key and two dates, as text.
- Change the words with `labels` or a [label pack](../guide/translating): `show`, `hide`, `copy`, `copied`, `regenerate`, `confirm`, `confirmLabel`, `cancel`, and `created` and `lastUsed` (functions of the date).

## Usage

```ts
import { BlessApiKeyField } from "blessing-ui";
```

## API

<PropsTable name="BlessApiKeyField" />

<script setup>
import ApiKeyFieldBasic from "../demos/ApiKeyFieldBasic.vue";
</script>
