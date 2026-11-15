---
title: Suggestions
---

<script setup>
import SuggestionsBasic from "../demos/SuggestionsBasic.vue";
</script>

# Suggestions

<p class="bless-lead">Ready prompts as a row of chips</p>

Shows a few things that a person can ask, so an empty chat has a start, or a reply has next steps. A click sends the prompt. Put it above or under the [prompt input](./prompt-input).

<Demo title="Basic">
  <SuggestionsBasic />
  <template #code>

<<< ../demos/SuggestionsBasic.vue

  </template>
</Demo>

- `items` is a list of texts, or of `{ label, prompt, icon }`. The chip shows the label. A click emits `select` with the prompt, or with the label when there is no prompt.
- `select` gives the prompt text. Send it, or put it in the prompt input for the person to change first.
- The chips wrap to more rows. `scroll` keeps them in one row that scrolls to the side, for a small screen.
- Each chip is a button in a list, so a keyboard moves through them with Tab. `disabled` turns all of them off, for example while a reply comes in.
- Change the name of the list for screen readers with `labels` or a [label pack](../guide/translating): `label`.

## Usage

```ts
import { BlessSuggestions, type BlessSuggestion } from "blessing-ui";
```

## API

<PropsTable name="BlessSuggestions" />
