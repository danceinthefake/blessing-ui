---
title: Group card
---

<script setup>
import GroupCardBasic from "../demos/GroupCardBasic.vue";
</script>

# Group card

<p class="bless-lead">A group with a cover, the members, and a join button</p>

Shows one community in a list of groups. For one person, use the [profile card](./profile-card).

<Demo title="Basic">
  <GroupCardBasic />
  <template #code>

<<< ../demos/GroupCardBasic.vue

  </template>
</Demo>

- `name` and `members` are required. With `href`, the name is a link. `cover` and `description` are optional.
- `faces` shows a few members as an [avatar group](./avatar-group).
- The line under the name gives the kind of group, public or private. It also gives the number of members in short form, such as "12.5K members".
- `v-model` is where the reader stands: `none`, `requested`, or `member`.
- For a public group, the button says "Join", and a click makes the reader a member. For a `private` group, it says "Ask to join", and a click sends a request. A second click leaves the group or cancels the request. Watch `v-model` to save the change.
- The button name ends with the name of the group, so a list of cards does not have many buttons with the same name.
- Change the words with `labels` or a [label pack](../guide/translating): `join`, `request`, `requested`, `member`, `public`, `private`, and `members` (a function).

## Usage

```ts
import { BlessGroupCard } from "blessing-ui";
```

## API

<PropsTable name="BlessGroupCard" />
