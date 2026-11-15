---
title: Changelog
---

<script setup>
import ChangelogBasic from "../demos/ChangelogBasic.vue";
</script>

# Changelog

<p class="bless-lead">Release notes, with the changes in groups</p>

Shows the releases of a product, newest first, with what each release added, changed, and fixed. For events in time with no groups, use the [timeline](./timeline).

<Demo title="Basic">
  <ChangelogBasic />
  <template #code>

<<< ../demos/ChangelogBasic.vue

  </template>
</Demo>

- `releases` is a list of `{ version, date, title, changes }`, newest first. Each change is `{ type, text }`.
- The type is `added`, `changed`, `deprecated`, `removed`, `fixed`, or `security`. The changes of a release show in groups in that order, as in [Keep a Changelog](https://keepachangelog.com). A group with no changes does not show.
- Each group has a word with a colored edge, so the type does not depend on color.
- The date is a `YYYY-MM-DD` text. It shows in the format of `locale` (default `en`), in a `<time>` element with the date for machines.
- Each release is an `<article>` with a heading. `level` sets the heading level (default 3), so the headings fit the outline of your page.
- Change the words of the types with `labels` or a [label pack](../guide/translating): `added`, `changed`, `deprecated`, `removed`, `fixed`, and `security`.

## Usage

```ts
import { BlessChangelog, type BlessChangeType, type BlessRelease } from "blessing-ui";
```

## API

<PropsTable name="BlessChangelog" />
