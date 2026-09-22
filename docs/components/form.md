---
title: Form
---

<script setup>
import FormBasic from "../demos/FormBasic.vue";
</script>

# Form

<p class="bless-lead">Constraint-API form + field wiring</p>

Use the browser's own validation — `required`, `type="email"`, `minlength`, `pattern` — and let `BlessField` show the message. There is no schema, no rules object, nothing to import for the common case.

<Demo title="Basic">
  <FormBasic />
  <template #code>

<<< ../demos/FormBasic.vue

  </template>
</Demo>

## How the wiring works

- `BlessField` gives the first control inside it the label's `for` id, `aria-invalid` while it shows an error, and `aria-describedby` pointing at the description or the error — whichever is showing. Every Bless control takes them; nothing to pass. The slot props (`id`, `error`, `describedby`) remain for a plain `<input>` or a field with two controls.
- A native validation message appears on the browser's `invalid` event (a submit) or on blur — but blur only once the field has a value or the form has been submitted, so tabbing through an empty form stays quiet.
- `error` is for what the browser can't know: the server said no. It wins over the native message while set; clear it when the user edits.
- `BlessForm` sets `novalidate` so the browser's own bubble never shows; the field speaks instead. `@submit` fires with `(FormData, event)` only when everything is valid; `@invalid` fires with the form element on a failed submit, after focus has moved to the first invalid control. Reset clears every field's message.
- `#default="{ submitted }"` tells you whether a submit has been tried — for a summary line or a disabled button.

## Usage

```ts
import { BlessForm, BlessField } from "blessing-ui";
```

## API

### BlessForm

<PropsTable name="BlessForm" />

### BlessField

<PropsTable name="BlessField" />
