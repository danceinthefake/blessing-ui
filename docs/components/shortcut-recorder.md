---
title: ShortcutRecorder
---

<script setup>
import ShortcutRecorderBasic from "../demos/ShortcutRecorderBasic.vue";
</script>

# ShortcutRecorder

<p class="bless-lead">Press a key combo to record it</p>

A field where the user presses the shortcut they want instead of typing its name — in a settings page for an editor, a player or the [Command](./command) palette. The value is plain text like `Ctrl+Shift+K`; show it elsewhere with [Kbd](./kbd).

<Demo title="Basic">
  <ShortcutRecorderBasic />
  <template #code>

<<< ../demos/ShortcutRecorderBasic.vue

  </template>
</Demo>

- Click the field or press **Enter** and it waits: held modifiers show as you press them, and the first other key completes the combo. **Esc** cancels, **Backspace** or **Delete** clears. Leaving the field stops recording.
- The combo is read from the physical key, so `Shift+1` is `Shift+1` and not `Shift+!`. Modifiers are always in the order Ctrl, Alt, Shift, Meta. Arrow keys are `↑ ↓ ← →`, and a space is `Space`.
- A bare key such as `G` is refused with a message unless `allowBare` is on; function keys (`F5`) are always fine, and so are combos with Ctrl, Alt or Meta.
- `taken` lists combos that are already used: an array, or `{ "Ctrl+K": "Open search" }` so the message can say by what ("Ctrl+K is already used by Open search"). A taken combo is not set and `conflict(combo, by)` fires. The field's own current value is never a conflict.
- Changes are announced to screen readers: set, cleared, cancelled, refused.
- To act on a shortcut, `matchShortcut("Ctrl+K", event)` in a `keydown` handler; `shortcutFromEvent(event)` gives the combo for any event.

The browser keeps some combos for itself (`Ctrl+W`, `Ctrl+T`, `Ctrl+N`) and a page cannot capture them, so recording one may close the tab. Steer users away from them with `taken`.

## Usage

```ts
import { BlessShortcutRecorder, matchShortcut } from "blessing-ui";
```

## API

<PropsTable name="BlessShortcutRecorder" />
