---
title: TagCloud
---

<script setup>
import TagCloudBasic from "../demos/TagCloudBasic.vue";
</script>

# TagCloud

<p class="bless-lead">Tags sized by weight</p>

A group of tags where the more important ones are bigger. Use it to show what a collection is about and to let people jump to one topic. For a list that people compare, use a sorted list or a [Chart](./chart).

<Demo title="Basic">
  <TagCloudBasic />
  <template #code>

<<< ../demos/TagCloudBasic.vue

  </template>
</Demo>

- Each tag has a `weight`, for example a count. The text size runs from `min` to `max` rem (default 0.75 to 2) in a straight line between the smallest and the largest weight.
- A tag with `href` is a link, and goes through your router when one is set. A tag without `href` is a button, and `select` fires with the tag.
- `sort` is `none` (your order), `weight` (biggest first), or `label`.
- The size is a visual hint only. The tags are a labelled list (`label`) in the order that you chose. A screen reader hears all tags at the same level.

## Usage

```ts
import { BlessTagCloud } from "blessing-ui";
```

## API

<PropsTable name="BlessTagCloud" />
