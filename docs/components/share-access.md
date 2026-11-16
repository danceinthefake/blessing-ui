---
title: Share access
---

<script setup>
import ShareAccessBasic from "../demos/ShareAccessBasic.vue";
</script>

# Share access

<p class="bless-lead">The people who can open a file, their access level, and the access for a link</p>

Controls who can see and change a shared file. Put it in a [modal](./modal) behind a Share button. To send a link through the apps of the device, use the [share bar](./share-bar).

<Demo title="Basic">
  <ShareAccessBasic />
  <template #code>

<<< ../demos/ShareAccessBasic.vue

  </template>
</Demo>

- `v-model:people` is the list of people. Each person has an `id`, a `name`, an optional `email`, and a `role`.
- The role is `view`, `comment`, or `edit`. The role `owner` shows as text, and the owner cannot be changed or removed.
- The form on top checks the email address with the browser. Invite emits `invite` with the address and the role. You add the person to the list.
- `v-model:link-access` is `restricted` or a role. If it is `restricted`, only the people on the list can open the file. Otherwise, anyone with the link gets that role. A line under the menus says the result in words.
- If you set `link`, a button copies it, and a status line says so.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessShareAccess } from "blessing-ui";
```

## API

<PropsTable name="BlessShareAccess" />
