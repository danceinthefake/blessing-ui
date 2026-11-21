---
title: ReadMore
---

# ReadMore

<p class="bless-lead">Long text cut to some lines, with a button to show all</p>

Keeps a long description, a review, or a biography short until people ask for more. Use it in a card or a list, where many long texts would push the rest down. For a section with a title that opens and closes, use a [collapsible](./collapsible). In a chat, the [bubble](./bubble) has its own `collapsible`.

<Demo title="Basic">
  <ReadMoreBasic />
  <template #code>

<<< ../demos/ReadMoreBasic.vue

  </template>
</Demo>

- Put the text in the default slot. `lines` sets how many lines show while it is closed (default 3). The cut line ends with an ellipsis.
- The button shows only when the text is cut. The component measures the text in the browser and again when its size changes, so a wider screen can remove the button. The server renders no button.
- The button says "Read more" and "Show less", and it has `aria-expanded` and `aria-controls`. `v-model:open` holds the state.
- The whole text is in the page, also while it is cut, so a screen reader and the browser's find can reach all of it.
- The slot is for text: a paragraph, or inline elements. Lists and headings in it are cut by lines in the same way, but they can read strangely.
- Change the words with `labels` or a [label pack](../guide/translating): `more` and `less`.

## Usage

```ts
import { BlessReadMore } from "blessing-ui";
```

## API

<PropsTable name="BlessReadMore" />

<script setup>
import ReadMoreBasic from "../demos/ReadMoreBasic.vue";
</script>
