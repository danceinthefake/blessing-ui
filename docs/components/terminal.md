---
title: Terminal
---

<script setup>
import TerminalBasic from "../demos/TerminalBasic.vue";
</script>

# Terminal

<p class="bless-lead">The output of a shell with a prompt, a history of commands, and colors for errors</p>

Shows a console in a cloud panel or a tutorial, or the log of a build. For a long log with levels and a filter, use the [log viewer](./log-viewer).

<Demo title="Basic">
  <TerminalBasic />
  <template #code>

<<< ../demos/TerminalBasic.vue

  </template>
</Demo>

- `lines` is the list of lines. Each line has a `text` and a `kind`: `in` for a command, `err` for an error, or `out` (the default).
- A command shows after the `prompt` (default `$`). An error has a bar and the danger color, and screen readers hear "Error:" before it.
- Enter emits `run` with the command. You run it and add the lines. The terminal does not run anything itself.
- The Up and Down arrow keys walk through the commands in `lines`.
- The screen is a log, so screen readers hear new lines. It scrolls to the end when lines come in.
- A click on the terminal moves the focus to the input, except when you select text.
- `readonly` removes the input, for output only. `title` adds a bar on top.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessTerminal } from "blessing-ui";
```

## API

<PropsTable name="BlessTerminal" />
