---
title: Form
---

<script setup>
import FormBasic from "../demos/FormBasic.vue";
</script>

# Form

<p class="bless-lead">Constraint-API form + field wiring</p>

Use the browser's own validation (`required`, `type="email"`, `minlength`, `pattern`) and let `BlessField` show the message. There is no schema, no rules object, nothing to import for the common case.

<Demo title="Basic">
  <FormBasic />
  <template #code>

<<< ../demos/FormBasic.vue

  </template>
</Demo>

## How the wiring works

- `BlessField` gives the first control inside it the `for` id of the label, `aria-invalid` while it shows an error, and `aria-describedby` that points at the description and the error. The description stays under an error, because it is usually what fixes it. Every Bless control takes them. You pass nothing. The slot props (`id`, `error`, `describedby`) remain for a plain `<input>` or a field with two controls.
- A native validation message appears on the `invalid` event of the browser (a submit) or on blur. Blur counts only after the field has a value or the form is submitted, so tabbing through an empty form stays quiet.
- `error` is for what the browser cannot know: the server said no. It wins over the native message while set. Clear it when the user edits.
- `BlessForm` sets `novalidate`, so the own bubble of the browser never shows. The field speaks instead. `@submit` fires with `(FormData, event)` only when everything is valid. `@invalid` fires with the form element on a failed submit, after focus moves to the first invalid control. Reset clears the message of every field, and every `v-model` inside follows the reset values.
- `#default="{ submitted }"` tells you whether a person tried a submit. Use it for a summary line or a disabled button.

## Usage

```ts
import { BlessForm, BlessField } from "blessing-ui";
```

## API

### BlessForm

<PropsTable name="BlessForm" />

### BlessField

<PropsTable name="BlessField" />
