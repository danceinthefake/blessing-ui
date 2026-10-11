---
title: Form
---

<script setup>
import FormBasic from "../demos/FormBasic.vue";
import FormSchema from "../demos/FormSchema.vue";
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

<Demo title="With a schema">
  <FormSchema />
  <template #code>

<<< ../demos/FormSchema.vue

  </template>
</Demo>

## How the wiring works

- `BlessField` gives the first control inside it three things: the `for` id of the label, `aria-invalid` while it shows an error, and `aria-describedby`. The last one points at the description and the error. The description stays under an error, because it is usually what fixes it. Every Bless control takes them. You pass nothing. The slot props (`id`, `error`, `describedby`) remain for a plain `<input>` or a field with two controls.
- A native validation message appears on the `invalid` event of the browser (a submit) or on blur. Blur counts only after the field has a value or the form is submitted, so tabbing through an empty form stays quiet.
- `error` is for what the browser cannot know: the server said no. It wins over the native message while set. When the user edits, clear it.
- `BlessForm` sets `novalidate`, so the own bubble of the browser never shows. The field speaks instead. Only when everything is valid, `@submit` fires with `(FormData, event)`. On a failed submit, `@invalid` fires with the form element after focus moves to the first invalid control. Reset clears the message of every field, and every `v-model` inside follows the reset values.
- `#default="{ submitted }"` tells you whether a person tried a submit. Use it for a summary line or a disabled button.

## Check with a schema

The browser can check that a value is present, an email, or in a range. It cannot check a rule that spans fields, or a rule from your domain. For those rules, give `schema` a validator that follows [Standard Schema](https://standardschema.dev). Zod, Valibot, and ArkType all follow it, and the library depends on none of them.

```vue
<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  handle: z.string().regex(/^[a-z0-9_]+$/, "Use lowercase letters, digits, and _"),
  age: z.coerce.number().min(13, "You must be 13 or older"),
});
</script>

<template>
  <BlessForm :schema="schema" @submit="(data, event, value) => save(value)">…</BlessForm>
</template>
```

- The schema runs after the browser checks pass, on submit. It gets the form data as an object. A name that repeats, such as checkboxes, becomes an array.
- Form data is text. Use the coercion of your schema for numbers and dates (`z.coerce.number()`). `submit` has a third argument, `value`, which is what the schema returned. Use it instead of the raw data.
- A message appears in the `BlessField` whose control has the same `name` as the first step of the issue path. Give `BlessField` a `name` prop when the field holds several controls. An issue with no path, for example "Passwords do not match", goes to `errors[""]`. Show it from the default slot: `#default="{ errors }"`.
- On a failed check, `invalid` fires and focus moves to the first field with a message. When the person edits a field, its message goes away. Reset clears all of them.
- The slot also has `pending`, which is true while an async schema runs. Use it to disable the button.
- A schema can be async. `submit` waits for it.

## Usage

```ts
import { BlessForm, BlessField } from "blessing-ui";
```

## API

### BlessForm

<PropsTable name="BlessForm" />

### BlessField

<PropsTable name="BlessField" />
