---
title: Contact form
---

<script setup>
import ContactFormBasic from "../demos/ContactFormBasic.vue";
</script>

# Contact form

<p class="bless-lead">A contact form with the name, the email, the topic, the message, and a clear result</p>

Lets visitors of a company site write to the team without an email program.

<Demo title="Basic">
  <ContactFormBasic />
  <template #code>

<<< ../demos/ContactFormBasic.vue

  </template>
</Demo>

- The form has a name, an email address, and a message. `topics` adds a menu of topics.
- Send checks the fields. Each error shows under its field and is linked to it, and the focus moves to the first wrong field.
- If all is correct, the form emits `submit` with the name, the email, the topic, and the message. You send them to your server.
- `state` gives the result back: `sending` changes the button text, `sent` replaces the form with a thank-you line, and `error` shows an alert above the button. In the example, a message with "fail" in it fails.
- A field that people do not see catches simple spam bots. If a bot fills it, the form sends nothing. Check messages on your server too.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessContactForm } from "blessing-ui";
```

## API

<PropsTable name="BlessContactForm" />
