---
title: RelativeTime
---

# RelativeTime

<p class="bless-lead">Time ago, in your language, kept up to date</p>

A date as "3 hours ago" or "in 2 days", in the language of the reader. Use it in feeds, comments, and lists, where how long ago matters more than the exact date. For a date that people must read exactly, such as a due date in a contract, show the date.

<Demo title="Basic">
  <RelativeTimeBasic />
  <template #code>

<<< ../demos/RelativeTimeBasic.vue

  </template>
</Demo>

- `value` is a `Date`, a timestamp in ms, or a date string. The element is a `<time>` with the exact `datetime`, so machines and screen readers can read the date. The tooltip shows the full date and time in the time zone of the reader.
- The unit follows the distance: seconds, minutes, hours, days, months, years. `numeric="auto"` (default) writes "yesterday" and "now". `numeric="always"` writes "1 day ago". `format` is `long`, `short`, or `narrow`. The name is not `style`, because Vue reserves that one.
- `locale` sets the language. The words come from `Intl.RelativeTimeFormat`, so there is nothing to translate by hand. Without `locale`, the text is English.
- With `live` (default), the text updates while the page is open. It checks every 5 seconds for a fresh time, and less often for older ones. Turn it off with `:live="false"`. The text is not a live region, so a screen reader does not announce each change.
- The server and the browser disagree on the time now and on the time zone. So the server writes a plain date in UTC ("Oct 9, 2026"), and the relative text appears after mount. A fixed `now` is the same on both sides, so the relative text shows at once. Use `now` for tests and for a page that you render ahead of time.
- An invalid `value` renders nothing.

## Usage

```ts
import { BlessRelativeTime } from "blessing-ui";
```

## API

<PropsTable name="BlessRelativeTime" />

<script setup>
import RelativeTimeBasic from "../demos/RelativeTimeBasic.vue";
</script>
