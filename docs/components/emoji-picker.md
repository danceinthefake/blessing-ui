---
title: EmojiPicker
---

<script setup>
import EmojiPickerBasic from "../demos/EmojiPickerBasic.vue";
</script>

# EmojiPicker

<p class="bless-lead">Search and pick an emoji</p>

A panel of emoji for a message, a reaction, or a status. Put it in a [popover](./popover) next to a text field, or show it inline. For reactions on a chat message, the [bubble](./bubble) already has reaction chips.

<Demo title="Basic">
  <EmojiPickerBasic />
  <template #code>

<<< ../demos/EmojiPickerBasic.vue

  </template>
</Demo>

- It ships 353 common emoji with their English names, in eight groups. Flags are left out, because many systems draw them as two letters. To offer other emoji, or names in another language, pass `emojis`: a list of `{ char, name, group, keywords }`. The built-in list is exported as `blessEmojis`, so you can extend it.
- The search matches names and keywords. Enter in the search box picks the first result, and ↓ moves into the grid.
- The grid is one Tab stop. The arrow keys move by row and column, also from one group into the next. Home and End go to the first and last emoji. The group bar is one Tab stop too. Its buttons jump to a group.
- Each emoji is a button named by its name. The line under the grid shows the name of the emoji that has focus, because a tooltip does not show on focus.
- `select` sends the emoji. `v-model:recent` holds the recent emoji, newest first, up to `recentLimit` (default 16, `0` hides the row). `persist` keeps them in `localStorage` under a key that you choose.
- `columns` sets the emoji per row (default 8). Set `--bless-emoji-height` for the height of the grid (default 260px).
- Change the words with `labels` or a [label pack](../guide/translating). The Indonesian pack changes the words, not the emoji names.

## Usage

```ts
import { BlessEmojiPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessEmojiPicker" />
