---
title: Newsletter signup
---

<script setup>
import NewsletterSignupBasic from "../demos/NewsletterSignupBasic.vue";
</script>

# Newsletter signup

<p class="bless-lead">An email field and a button, with checks and a thank-you</p>

Asks for an email address to join a list, in a footer or at the end of an article. Your server adds the address, and the component shows the result. For a full form, use the [form](./form).

<Demo title="Basic">
  <NewsletterSignupBasic />
  <template #code>

<<< ../demos/NewsletterSignupBasic.vue

  </template>
</Demo>

- `v-model` is the address. The button emits `subscribe` with the address, without spaces at the ends.
- Before it emits, the browser checks the form of the address. A bad address shows a hint under the field.
- Set `status` to `loading` while your server works. The button shows a spinner, and a second send does not go out.
- If the server cannot add the address, set `error` to the reason. If it can, set `status` to `done`. A thank-you takes the place of the form, and screen readers hear it.
- A line under the field says what the reader gets. `privacy-href` adds a link to your privacy policy.
- Change the words with `labels` or a [label pack](../guide/translating): `label`, `button`, `done`, `invalid`, `privacy`, and `policy`.

## Usage

```ts
import { BlessNewsletterSignup } from "blessing-ui";
```

## API

<PropsTable name="BlessNewsletterSignup" />
