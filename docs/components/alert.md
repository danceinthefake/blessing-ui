---
title: Alert
---

<script setup>
import AlertBasic from "../demos/AlertBasic.vue";
</script>

# Alert

<p class="bless-lead">Inline notice</p>

A message that lives in the page, next to what it's about — a form that failed, a box that's on sale, a caveat above a table. It stays until dismissed or the state changes. For a message that reacts to an action and goes away by itself, use [Toaster](./toaster); for one that must be answered before anything else, [AlertDialog](./alert-dialog).

`live` sets the ARIA role. `status` (default) is polite: read when the screen reader gets to it, right for anything already on the page. `alert` is assertive: announced the moment it appears, interrupting — use it only for an alert you _insert_ after something happens, like the payment failure below, never for one in the initial markup. `none` for purely decorative notices.

`color` sets the edge: `text` (default) for a plain notice, `danger`, `warning`, `success` and `info` for status. `accent` is only for a notice about something already chosen — colour means chosen, so a sale or an announcement stays ink.

`dismissible` adds a close button. Bind `v-model` to bring the alert back later; without it, a dismissed alert stays gone until it is re-created. Either way `dismiss` fires. The alert takes keyboard focus with it when it goes, so handle `@dismiss` and move focus to what comes next — the demo hands it to "show again".

<Demo title="Basic">
  <AlertBasic />
  <template #code>

<<< ../demos/AlertBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessAlert } from "blessing-ui";
```

## API

<PropsTable name="BlessAlert" />
