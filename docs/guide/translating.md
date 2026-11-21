---
title: Translating the library
---

# Translating the library

Some components say words for you: a "Copy" button, a "Show more" link, a screen-reader message such as "Copied to clipboard". You can replace all of them in one place. Give the library a label pack, and every component below it uses the pack.

```ts
import { provideLabels } from "blessing-ui";

// in your root component's setup
provideLabels({
  BlessCopyButton: { copy: "Copiar", copied: "Copiado" },
  BlessPoll: { vote: "Votar", votes: (n) => `${n} votos` },
});
```

You can also provide it for the whole app: `app.provide(blessLabelsKey, pack)`.

<Demo title="Switch the language">
  <LabelsSwitch />
  <template #code>

<<< ../demos/LabelsSwitch.vue

  </template>
</Demo>

## Bahasa Indonesia

The library ships one complete pack: `labelsId`, in Indonesian. It has every word of every component that has a `labels` prop.

```ts
import { labelsId, provideLabels } from "blessing-ui";

provideLabels(labelsId);
```

To change a few words, spread it and replace them: `{ ...labelsId, BlessPoll: { ...labelsId.BlessPoll, vote: "Coblos" } }`.

To write your own complete pack for another language, give it the type `BlessLabelsFull`. Then the typecheck tells you each word that is missing, also when a new version of the library adds one.

## How it works

A pack maps a component name to the `labels` object of that component. The API table of each component shows which words it has. A message with numbers or names is a function of them, so plurals can follow the rules of your language.

For each word, the component picks the first source that has it:

1. The `labels` prop on that one component.
2. The pack.
3. The English default.

You can mix them. Use the pack for the whole app and a `labels` prop for one place that needs different words.

## Change the language at run time

Pass a ref or a getter, and the words change when it changes. The demo above does this with a `computed`. Your i18n library can build the pack from its message files. The library does not load languages itself. Apart from `labelsId`, it ships no translations.

## What a pack does not cover

A pack covers components that have a `labels` prop. These words stay separate:

- Props that name a single thing, such as `label`, `placeholder`, and `emptyText`. You pass them on each component.
- `BlessPasswordMeter`, whose `labels` is a list of strength words in order.
- Dates, numbers, and time zones. They use `Intl` with the `locale` prop, or the language of the browser.

Direction is separate too. Set `dir` and `lang` on `<html>`, as the [right-to-left guide](./rtl) shows.

<script setup>
import LabelsSwitch from "../demos/LabelsSwitch.vue";
</script>
