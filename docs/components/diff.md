---
title: Diff
---

<script setup>
import DiffBasic from "../demos/DiffBasic.vue";
</script>

# Diff

<p class="bless-lead">Side-by-side and inline text diff</p>

Show what changed between two versions of a text — a config file, a document revision, an AI suggestion before you accept it. It compares line by line. To show one piece of code, use [CodeBlock](./code-block); to compare two images, [Compare](./compare).

<Demo title="Basic">
  <DiffBasic />
  <template #code>

<<< ../demos/DiffBasic.vue

  </template>
</Demo>

- `a` is the old text and `b` the new. Removed lines are marked `−` and added lines `+`, with a tint as well, so the meaning does not depend on colour. The header counts both, and screen readers hear "1 lines added, 1 removed".
- `mode="inline"` (default) is one column with both line numbers; `"split"` puts the old text on the left and the new on the right, lining up lines that were replaced.
- `context` folds long runs of unchanged lines, keeping that many around each change; the fold is a button ("8 unchanged lines") that opens it. Without `context` everything is shown.
- Lines are compared exactly (whitespace counts), in a monospace column that scrolls sideways instead of wrapping. The comparison is a longest-common-subsequence, fine for files of a few thousand lines; a block of thousands of lines on both sides that share nothing is shown as removed and added rather than aligned.
- `diffLines(a, b)` is exported if you want the rows without the component.

## Usage

```ts
import { BlessDiff } from "blessing-ui";
```

## API

<PropsTable name="BlessDiff" />
