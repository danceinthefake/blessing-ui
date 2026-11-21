---
title: LogViewer
---

# LogViewer

<p class="bless-lead">A live log with colors, a filter, and follow</p>

Shows the output of a server, a build, or a job, as it comes in. Only the lines in view are in the page, so a log of many thousand lines stays fast. For code that people read, use a [code block](./code-block). For structured data, use the [JSON viewer](./json-viewer).

<Demo title="Basic">
  <LogViewerBasic />
  <template #code>

<<< ../demos/LogViewerBasic.vue

  </template>
</Demo>

- `lines` is the log, one string per line. Add lines to the end as they come in. Each line is read once, so a log that grows only reads its new lines.
- ANSI colors (red, green, yellow, blue, magenta, cyan, and their bright forms), bold, dim, and underline are kept, and they follow the theme. Other escape codes, such as cursor moves, are dropped.
- Follow keeps the newest line in view. Scroll up to read, and follow turns off. Scroll to the end, or press Follow, and it turns on again. `v-model:follow` holds the state.
- The filter shows the lines that contain its text, with no regard to case. The lines keep their numbers, and the bar says how many lines match.
- Each line is one row 20px high, and a long line scrolls to the side. It does not wrap.
- Set `height` for the line area (default `320px`), and `label` to name the log for screen readers.
- Change the words with `labels` or a [label pack](../guide/translating): `filter`, `follow`, `empty`, and `count(shown, total)`.

## Usage

```ts
import { BlessLogViewer } from "blessing-ui";
```

## API

<PropsTable name="BlessLogViewer" />

<script setup>
import LogViewerBasic from "../demos/LogViewerBasic.vue";
</script>
