---
title: Margin comments
---

<script setup>
import MarginCommentsBasic from "../demos/MarginCommentsBasic.vue";
</script>

# Margin comments

<p class="bless-lead">The parts of a document with their comments in the margin next to them</p>

Lets a team talk about a text next to the part that the talk is about, as in a shared document. For a long talk with replies, use a [thread](./thread).

<Demo title="Basic">
  <MarginCommentsBasic />
  <template #code>

<<< ../demos/MarginCommentsBasic.vue

  </template>
</Demo>

- `blocks` is the text in parts, each with an `id` and a `text`. A part is often a paragraph.
- `comments` is the list of comments. Each comment has an `id`, the `block` that it is about, an `author`, a `text`, and an optional `time`.
- A part with comments gets a bar on its edge. On a narrow screen, the margin goes below its part.
- The Comment button opens a box in the margin and moves the focus into it. Send emits `add` with the block id and the text. Escape closes the box.
- Each margin is a landmark with a name such as "Comments on part 2", so screen readers can jump to it.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessMarginComments } from "blessing-ui";
```

## API

<PropsTable name="BlessMarginComments" />
