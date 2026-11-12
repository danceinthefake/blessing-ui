---
title: AvatarGroup
---

<script setup>
import AvatarGroupBasic from "../demos/AvatarGroupBasic.vue";
</script>

# AvatarGroup

<p class="bless-lead">Fused row of avatars with a +N plate</p>

A row of [avatars](./avatar) for the people on a task, a document, or a call. The avatars fuse into one plate. They do not overlap, because the group is one shape (see [fuse when grouped](../design/)).

<Demo title="Basic">
  <AvatarGroupBasic />
  <template #code>

<<< ../demos/AvatarGroupBasic.vue

  </template>
</Demo>

- `items` is a list of `{ src, name, alt }`. Each item is one `BlessAvatar`, with the same image and initials rules.
- `max` (default 5) sets how many avatars show. The rest go into one "+N" plate. The tooltip of that plate names the hidden people. A screen reader reads the plate as "2 more". Change the words with `labels.more` or a [label pack](../guide/translating).
- `size` and `color` apply to every avatar. The "+N" plate is always `text`, so it does not look like a person.
- The root is `role="group"`. Give it an `aria-label` that says what the people have in common, for example "Assignees".

## Usage

```ts
import { BlessAvatarGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessAvatarGroup" />
