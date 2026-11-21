---
title: Audit log
---

# Audit log

<p class="bless-lead">Who changed what and when, with the old and the new value</p>

Keeps a record of the changes to the data in an ERP or an admin panel, for checks and for audits. For a feed of activity among people, use the [activity feed](./activity-feed).

<Demo title="Basic">
  <AuditLogBasic />
  <template #code>

<<< ../demos/AuditLogBasic.vue

  </template>
</Demo>

- `entries` is a list, newest first. Each entry has an `id`, `who`, `when` as text, an `action`, and the `target` record. It can also have `changes` and a `source`, such as "API".
- The action is `created`, `updated`, `deleted`, or `viewed`. It shows as a mark and a word.
- Each change has a `field`, and a `from` and a `to` value. The old value is struck through and the new one is bold. Screen readers hear "was" and "now" before them. A missing value reads "empty".
- The changes are a native description list, and the old and new values are `del` and `ins` elements.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, the four actions, `from`, `to`, and `empty`.

## Usage

```ts
import { BlessAuditLog } from "blessing-ui";
```

## API

<PropsTable name="BlessAuditLog" />

<script setup>
import AuditLogBasic from "../demos/AuditLogBasic.vue";
</script>
