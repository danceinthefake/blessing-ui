---
title: Commit list
---

# Commit list

<p class="bless-lead">The commits of a branch by day, with the author, the short hash, and the changes</p>

Shows the history of a branch in a code host or in a deploy tool. For the lines of one change, use the [diff](./diff).

<Demo title="Basic">
  <CommitListBasic />
  <template #code>

<<< ../demos/CommitListBasic.vue

  </template>
</Demo>

- `commits` is the list. Each commit has a `sha`, a `title`, an `author`, and a `time` (milliseconds or an ISO date). It can also have `added` and `removed` line counts and a `url`.
- The commits are grouped by day, newest first. Each day is a region with a name such as "Commits on Nov 17, 2026".
- The counts show as +184 and −12. Screen readers hear "184 lines added, 12 lines removed". On a narrow screen, the counts are hidden.
- The hash shows with seven characters. Its copy button copies the full hash and has the short hash in its name.
- `locale` formats the days and times. `time-zone` sets an IANA time zone. If you render on a server, set it, so the server and the browser show the same day.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessCommitList } from "blessing-ui";
```

## API

<PropsTable name="BlessCommitList" />

<script setup>
import CommitListBasic from "../demos/CommitListBasic.vue";
</script>
