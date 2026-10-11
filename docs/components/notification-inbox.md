---
title: NotificationInbox
---

<script setup>
import NotificationInboxBasic from "../demos/NotificationInboxBasic.vue";
</script>

# NotificationInbox

<p class="bless-lead">Bell with a badge and a list of notices</p>

A bell with a count, and a panel of notices that stay until the person reads or dismisses them. Use it for things that happen while someone is away: a reply, a finished build, an invite. For a message that reacts to an action and goes away by itself, use [Toaster](./toaster).

<Demo title="Basic">
  <NotificationInboxBasic />
  <template #code>

<<< ../demos/NotificationInboxBasic.vue

  </template>
</Demo>

- You own the list. `items` are `{ id, title, body?, time?, read?, href? }`, and `time` is text that you formatted ("2 min ago"). The inbox does not store anything. It reports what the person did, and you update the list.
- Events: `read(id)` when an unread notice is opened, `readAll`, `dismiss(id)`, and `select(notice)` for every open. A notice with `href` is a link, and it goes through your router when one is set.
- The badge counts the unread items, up to `max` ("99+"). The bell is named from the count, for example "Notifications, 2 unread". Replace the name with `labels.bell`.
- An unread notice is bold and has an ink square. It also has the word "Unread" for screen readers, so the state is not only a style. The square is ink, not accent, because unread is not a choice.
- **Mark all as read** waits until there is an unread notice. An empty list shows "You are all caught up."
- The panel is a [Popover](./popover): it dismisses with Esc or a click outside, and it puts focus back on the bell. `v-model:open` and `placement` work as on Popover.
- `labels` replaces the English words: `title`, `bell(n)`, `readAll`, `dismiss`, `empty`, `unread`.

## Usage

```ts
import { BlessNotificationInbox } from "blessing-ui";
```

## API

<PropsTable name="BlessNotificationInbox" />
