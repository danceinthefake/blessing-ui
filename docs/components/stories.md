---
title: Stories
---

<script setup>
import StoriesBasic from "../demos/StoriesBasic.vue";
</script>

# Stories

<p class="bless-lead">Rings of people with new stories, and a viewer with a timer for each story</p>

Shows short posts that people share for a day, at the top of a social app. A story is one picture with a caption.

<Demo title="Basic">
  <StoriesBasic />
  <template #code>

<<< ../demos/StoriesBasic.vue

  </template>
</Demo>

- `people` is a list of people. Each person has an `id`, a `name`, an optional `avatar` and `seen`, and a list of `stories`. Each story has an `id`, an `image`, an `alt` text, and an optional `caption` and `time`.
- A person with new stories has a solid ring in the accent color. A person whose stories are seen has a thin dashed ring. Screen readers hear "new" for new stories.
- A ring opens the viewer in a [modal](./modal). Each story shows for `duration` seconds (default 5), with a bar for each story on top. Then the next story shows, and after the last story of a person, the stories of the next person.
- The Pause button stops the timer, so a reader can take the time they need. The ‹ and › buttons and the arrow keys move between the stories.
- Each story that shows emits `seen` with the id of the person and the story. Use it to set `seen` on the person.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `new`, `previous`, `next`, `pause`, `play`, and the functions `open` and `progress`.

## Usage

```ts
import { BlessStories } from "blessing-ui";
```

## API

<PropsTable name="BlessStories" />
