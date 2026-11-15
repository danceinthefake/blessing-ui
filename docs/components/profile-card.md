---
title: Profile card
---

<script setup>
import ProfileCardBasic from "../demos/ProfileCardBasic.vue";
</script>

# Profile card

<p class="bless-lead">A person with a cover, an avatar, a bio, counts, and a follow button</p>

Shows a person or a show in a card, for example a host, a guest, or an author. For a small preview on hover, use the [hover card](./hover-card).

<Demo title="Basic">
  <ProfileCardBasic />
  <template #code>

<<< ../demos/ProfileCardBasic.vue

  </template>
</Demo>

- `name` is the name, as a heading. With `href`, the name is a link. `handle`, `bio`, and `avatar` are optional. With no avatar, the [avatar](./avatar) shows the initials.
- `cover` is the URL of a picture for the band at the top. With no cover, the band is gray.
- `stats` is a list of counts, each with a `label` and a `value`. Big numbers show in short form, such as 12.5K. `locale` sets the format (default `en`).
- With `followable`, a follow button shows. It is a toggle with `aria-pressed`, and `v-model:following` holds its state.
- The `actions` slot puts more buttons next to the follow button.
- Change the words with `labels` or a [label pack](../guide/translating): `follow` and `following`.

## Usage

```ts
import { BlessProfileCard } from "blessing-ui";
```

## API

<PropsTable name="BlessProfileCard" />
