---
title: Leaderboard
---

<script setup>
import LeaderboardBasic from "../demos/LeaderboardBasic.vue";
</script>

# Leaderboard

<p class="bless-lead">Ranked rows with the place, the move, and the score</p>

Shows who is first, and how each place changed since last time. The row of the reader stands out. It also shows if it is below the top places. For a plain table of data, use the [data table](./data-table).

<Demo title="Basic">
  <LeaderboardBasic />
  <template #code>

<<< ../demos/LeaderboardBasic.vue

  </template>
</Demo>

- `rows` is a list of people or teams. Each row has an `id`, a `name`, a `score`, and an optional `avatar`. The component puts the rows in order of score, high first.
- Equal scores share a place, and the next place skips a number: 1, 2, 2, 4.
- `previous` is the place of a row last time. The row shows ▲ and the number of places up, ▼ and the number down, or `–` for no change. A row with no `previous` is new and shows a dot.
- The first three places have a filled box in three shades.
- `me` is the id of the row of the reader. It has the accent background and a "you" tag. With `limit`, only the first places show. If the row of the reader is below the limit, it shows after a gap.
- `format` sets the text of a score.
- The leaderboard is a table, and screen readers hear the column names and the move in words, such as "up 2". `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `rank`, `name`, `score`, `change`, `up` and `down` (functions of the places), `same`, `new`, and `you`.

## Usage

```ts
import { BlessLeaderboard } from "blessing-ui";
```

## API

<PropsTable name="BlessLeaderboard" />
