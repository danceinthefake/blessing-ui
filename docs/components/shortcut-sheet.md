---
title: Shortcut sheet
---

<script setup>
import ShortcutSheetBasic from "../demos/ShortcutSheetBasic.vue";
</script>

# Shortcut sheet

<p class="bless-lead">Keyboard shortcuts in groups, with a search</p>

A list of the keyboard shortcuts of an app, in groups, so a person can learn them. Put it in a [modal](./modal) that opens with "?". To let a person set a shortcut, use the [shortcut recorder](./shortcut-recorder).

<Demo title="Basic">
  <ShortcutSheetBasic />
  <template #code>

<<< ../demos/ShortcutSheetBasic.vue

  </template>
</Demo>

- `groups` is a list of `{ title, shortcuts }`. Each shortcut is `{ keys, description }`.
- `keys` is a combo such as `Mod+K`, or a list of combos that do the same thing, with "or" between them. The keys show as [`BlessKbd`](./kbd).
- `Mod` is ⌘ on Apple devices and Ctrl on other devices, and `Alt` is ⌥ on Apple devices. The device is read after the page loads, so the server and the browser agree.
- The search box filters the shortcuts by their words or their keys. A group with no match does not show. `search` (on by default) shows or hides the box.
- The groups go in two columns on a wide screen. Each shortcut is a pair in a description list, so screen readers say the action and then its keys.
- Change the words with `labels` or a [label pack](../guide/translating): `search`, `none`, and `or`.

## Usage

```ts
import { BlessShortcutSheet, type BlessShortcutGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessShortcutSheet" />
