---
title: Footnotes
---

<script setup>
import FootnotesBasic from "../demos/FootnotesBasic.vue";
</script>

# Footnotes

<p class="bless-lead">Numbered notes, with marks in the text that link to them and back</p>

Puts side notes and sources at the end of an article, so the text stays easy to read. For the sources of a reply of an assistant, use the [sources](./sources).

<Demo title="Basic">
  <FootnotesBasic />
  <template #code>

<<< ../demos/FootnotesBasic.vue

  </template>
</Demo>

- `BlessFootnotes` shows the list. `notes` is a list of texts, and note 1 is the first.
- `BlessFootnoteRef` is the mark in the text. `n` is the number of its note. The mark links down to the note, and the ↩ link of the note goes back to the mark.
- Give both parts the same `id` (default `fn`). Note 2 then has the id `<id>-2`, and its mark has `<id>-ref-2`. Put one mark for each note.
- If the reader follows a link, the note or the mark gets the accent color.
- The list is a region named by its title. Each mark is named "Note 2" and each back link "Back to the text of note 2" for screen readers. Change the words with `labels` or a [label pack](../guide/translating): `title` and `back` on `BlessFootnotes`, and `note` on `BlessFootnoteRef`.

## Usage

```ts
import { BlessFootnoteRef, BlessFootnotes } from "blessing-ui";
```

## API

<PropsTable name="BlessFootnotes" />

<PropsTable name="BlessFootnoteRef" />
