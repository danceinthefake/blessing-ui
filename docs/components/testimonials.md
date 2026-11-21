---
title: Testimonials
---

# Testimonials

<p class="bless-lead">Quotes with a name, a role, an avatar, and stars</p>

Shows what people say about a product or a show, on a landing page. All quotes can show in a grid, or one at a time with buttons. For reviews with a summary of the stars, use the [review summary](./review-summary).

<Demo title="Basic">
  <TestimonialsBasic />
  <template #code>

<<< ../demos/TestimonialsBasic.vue

  </template>
</Demo>

- `items` is a list of quotes. Each quote has a `quote` and a `name`, and an optional `role`, `avatar`, and `rating` from 1 to 5.
- `layout` is `grid` (default) or `single`. In `single`, the previous and next buttons go around the list, and a line says which quote shows. Nothing moves by itself.
- Each quote is a `figure` with a `blockquote` and its author. Screen readers hear the stars as words, such as "4 out of 5 stars".
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `prev`, `next`, and the functions `position` and `rating`.

## Usage

```ts
import { BlessTestimonials } from "blessing-ui";
```

## API

<PropsTable name="BlessTestimonials" />

<script setup>
import TestimonialsBasic from "../demos/TestimonialsBasic.vue";
</script>
