---
title: Email composer
---

# Email composer

<p class="bless-lead">To, Cc, and subject fields with recipient chips, and the message</p>

Writes a new email or a reply. To show an email that came in, use the [email view](./email-view).

<Demo title="Basic">
  <EmailComposerBasic />
  <template #code>

<<< ../demos/EmailComposerBasic.vue

  </template>
</Demo>

- `v-model` is the draft: `to` and `cc` as lists of addresses, `subject`, and `body`.
- The To and Cc fields are [tag inputs](./input-tags). Press Enter or a comma after each address. "Add Cc" shows the Cc field. A draft that comes with Cc addresses, for example a reply to all, shows it too.
- If an address does not look like `name@domain.tld`, an error lists it and the field is marked as not valid. If the To field is empty, Send shows an error. Screen readers hear each error at once.
- A good draft emits `send` with the draft. "Discard" emits `discard`.
- The check of the addresses looks only at their shape. Your mail server must check them again.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `to`, `cc`, `addCc`, `subject`, `body`, `send`, `discard`, `hint`, `noRecipient`, and `bad` (a function).

## Usage

```ts
import { BlessEmailComposer } from "blessing-ui";
```

## API

<PropsTable name="BlessEmailComposer" />

<script setup>
import EmailComposerBasic from "../demos/EmailComposerBasic.vue";
</script>
