---
title: Achievements
---

<script setup>
import AchievementsBasic from "../demos/AchievementsBasic.vue";
</script>

# Achievements

<p class="bless-lead">Badges that a user earns, with the progress to the next ones</p>

Shows the badges of a user in a grid, for a profile or a course. Earned badges are in full color. Badges not yet earned are gray, and some show how far along the user is. For one big number, use the [stat](./stat).

<Demo title="Basic">
  <AchievementsBasic />
  <template #code>

<<< ../demos/AchievementsBasic.vue

  </template>
</Demo>

- `achievements` is a list of badges. Each badge has an `id`, a `title`, an `icon` (an emoji or short text), and an optional `description`.
- If a badge has `earned`, it is earned. The value is the time as text, and it shows as "Earned 14 Nov".
- A badge that is not earned can have `progress` as `[now, goal]`. It shows a native progress bar and the two numbers.
- An earned badge has a solid edge and a shadow. A badge that is not earned has a dashed edge and says "Not earned yet". The state does not rest on the color.
- The line at the top counts the earned badges. Change the words with `labels` or a [label pack](../guide/translating): `title`, `locked`, and the functions `earned` and `count`.

## Usage

```ts
import { BlessAchievements } from "blessing-ui";
```

## API

<PropsTable name="BlessAchievements" />
