---
title: Mention
---

<script setup>
import MentionBasic from "../demos/MentionBasic.vue";
</script>

# Mention

<p class="bless-lead">@ / # suggestions inside a textarea</p>

A [Textarea](./textarea) that offers people, tags or anything else when you type `@` or `#`. The result is plain text — `@mika` — so you store and parse it however you like. For picking from a list without free text, use [Combobox](./combobox).

<Demo title="Basic">
  <MentionBasic />
  <template #code>

<<< ../demos/MentionBasic.vue

  </template>
</Demo>

- A trigger opens the list only at the start of a word, so `mail@host` stays plain. Typing after it filters by label or value; no match closes the list.
- **↑ ↓** choose (they wrap), **Enter** or **Tab** inserts `@value` and a space, **Esc** closes. Clicking an option works too, and the caret lands after the insert.
- Pass `options` as one list for every trigger (`triggers` says which characters, default `@`), or as `{ "@": people, "#": tags }` to give each its own list.
- The list sits under the textarea, not at the caret, so it never covers the line you are writing.
- Every other prop and attribute (`rows`, `description`, `error`, `maxlength`…) goes to the Textarea.
- `select` gives you `(option, trigger)` when something is inserted.

## Usage

```ts
import { BlessMention } from "blessing-ui";
```

## API

<PropsTable name="BlessMention" />
