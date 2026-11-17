---
title: Team grid
---

<script setup>
import TeamGridBasic from "../demos/TeamGridBasic.vue";
</script>

# Team grid

<p class="bless-lead">The people of a team with a photo, the name, the role, and links</p>

Shows the people behind a company on an About page.

<Demo title="Basic">
  <TeamGridBasic />
  <template #code>

<<< ../demos/TeamGridBasic.vue

  </template>
</Demo>

- `people` is the list. Each person has a `name`, a `role`, and optional `photo`, `bio`, and `links`.
- A person without a photo gets an [avatar](./avatar) with initials in the same square.
- The photo has empty alt text, because the name follows it. Each name is a heading of level 3.
- Each link has a `label` and an `href`. Screen readers hear the name with it, as in "Email of Ana Putri", so links with the same label differ.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessTeamGrid } from "blessing-ui";
```

## API

<PropsTable name="BlessTeamGrid" />
