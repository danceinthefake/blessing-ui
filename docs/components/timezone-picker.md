---
title: TimezonePicker
---

<script setup>
import TimezonePickerBasic from "../demos/TimezonePickerBasic.vue";
</script>

# TimezonePicker

<p class="bless-lead">IANA time zone search with offsets</p>

A search field for a time zone: a user profile, an event, a meeting. People type a city or an offset, and the list shows the zone name with its offset from UTC. The component ships no zone list. It reads the zones and the offsets from `Intl`, so they follow the rules of the browser.

<Demo title="Basic">
  <TimezonePickerBasic />
  <template #code>

<<< ../demos/TimezonePickerBasic.vue

  </template>
</Demo>

- `v-model` is the IANA name, for example `Asia/Jakarta`. Store this name, not the offset, because the offset changes with summer time.
- The list runs west to east, then by name. An underscore in a name shows as a space. Type `jakarta` or `+5:30` to narrow it.
- `at` is the moment that sets the offsets (default now). Pass a fixed date to show the offsets of an event, or to make the server and the browser agree.
- `detect` chooses the zone of the device after mount when the value is empty. The server cannot know it, so the choice never happens during server rendering. A device zone that is not in the list is ignored.
- `zones` replaces the list, for example with the six zones that your product supports. Where the browser has no `Intl.supportedValuesOf`, the default list is empty. Pass `zones` there.
- It is a [Combobox](./combobox). Other props, such as `size`, `invalid`, and `label`, go to it.

## Usage

```ts
import { BlessTimezonePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessTimezonePicker" />
