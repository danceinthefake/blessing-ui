---
title: Email view
---

# Email view

<p class="bless-lead">An email with the sender, the recipients, the body, and attachments</p>

Shows one email in a mail app or a help desk. To write an email, use the [email composer](./email-composer).

<Demo title="Basic">
  <EmailViewBasic />
  <template #code>

<<< ../demos/EmailViewBasic.vue

  </template>
</Demo>

- `subject`, `from`, `to`, and `date` are required. A sender or recipient has a `name` and an `email`. The sender can also have an `avatar`. `cc` adds more recipients.
- The recipients show by name. The ▾ button shows the full addresses. It is a toggle with `aria-expanded`.
- `body` is plain text. A blank line starts a new paragraph. For rich mail, put your own content in the default slot. Clean any HTML from a mail server before you show it.
- `attachments` is a list of files. Each file has a `name`, an optional `description` such as the size, and an optional `href`. They show as [attachments](./attachment).
- Put buttons such as Reply in the `actions` slot.
- Change the words with `labels` or a [label pack](../guide/translating): `to`, `cc`, `details`, and `attachments` (a function).

## Usage

```ts
import { BlessEmailView } from "blessing-ui";
```

## API

<PropsTable name="BlessEmailView" />

<script setup>
import EmailViewBasic from "../demos/EmailViewBasic.vue";
</script>
