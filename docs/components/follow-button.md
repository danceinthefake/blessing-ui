---
title: Follow button
---

<script setup>
import FollowButtonBasic from "../demos/FollowButtonBasic.vue";
</script>

# Follow button

<p class="bless-lead">Follow and unfollow, with the count of followers</p>

Lets a reader follow a person, a page, or a show. Put it on a [profile card](./profile-card) or a [group card](./group-card).

<Demo title="Basic">
  <FollowButtonBasic />
  <template #code>

<<< ../demos/FollowButtonBasic.vue

  </template>
</Demo>

- `v-model` is true when the reader follows.
- `name` is the person or page. Screen readers hear it after the words, such as "Follow: Ana Putri". The button is a toggle, so they also hear if it is pressed.
- Not following is a filled button with "+ Follow". Following is an outline with "✓ Following". The shape and the words change, not only the color.
- `followers` is the count without the reader. While the reader follows, the count is one more. It shows in short form, such as "12.5K", in the `locale`.
- After a click, a hidden status line says that the reader follows the person or no longer follows them.
- Change the words with `labels` or a [label pack](../guide/translating): `follow`, `following`, and the functions `followers`, `followed`, and `unfollowed`.

## Usage

```ts
import { BlessFollowButton } from "blessing-ui";
```

## API

<PropsTable name="BlessFollowButton" />
