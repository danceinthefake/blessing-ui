---
title: Permission matrix
---

# Permission matrix

<p class="bless-lead">Roles by permissions as check boxes, in groups</p>

Sets what each role in a team can do. A box at the top of each role turns all of its permissions on or off. For channels of notices, use the [notification preferences](./notification-prefs).

<Demo title="Basic">
  <PermissionMatrixBasic />
  <template #code>

<<< ../demos/PermissionMatrixBasic.vue

  </template>
</Demo>

- `roles` is a list of columns. Each role has a `key`, a `label`, and an optional `locked`. A locked role, such as the owner, has every permission, cannot change, and has a gray column.
- `permissions` is a list of rows. Each permission has a `key`, a `label`, and an optional `group`. A new group name starts a heading row.
- `v-model` holds the permissions of each role, such as `{ editor: ["upload", "edit"] }`.
- The box at the top of a role shows on, off, or a dash for some.
- The grid is a table of native check boxes. Each box has a name in words, such as "Editor can publish episodes". Write each permission label so that it reads well after "can".
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `permission`, `locked`, and the functions `all` and `cell`.

## Usage

```ts
import { BlessPermissionMatrix } from "blessing-ui";
```

## API

<PropsTable name="BlessPermissionMatrix" />

<script setup>
import PermissionMatrixBasic from "../demos/PermissionMatrixBasic.vue";
</script>
