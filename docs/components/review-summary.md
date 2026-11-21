---
title: Review summary
---

# Review summary

<p class="bless-lead">The average stars, the count, and a bar for each star level</p>

Sums up the reviews of a product or a show, over the list of reviews. A click on a bar shows only the reviews with that number of stars. For one rating that a person gives, use the [rating](./rating).

<Demo title="Basic">
  <ReviewSummaryBasic />
  <template #code>

<<< ../demos/ReviewSummaryBasic.vue

  </template>
</Demo>

- `counts` is the number of reviews with 5, 4, 3, 2, and 1 star, in that order.
- The summary shows the average with one decimal, five stars filled up to the average, and the number of reviews.
- Each bar shows the share of one star level. With `filterable` (on by default), the bars are toggle buttons. A click sets `v-model:filter` to the level, and a second click clears it. The other bars turn gray.
- `locale` sets the format of the numbers (default `en`).
- The stars are an image with the average in words. Each bar tells screen readers its level and its count, such as "4 stars: 236 reviews". Change the words with `labels` or a [label pack](../guide/translating): `average` (a function of the score), `reviews` (a function of the count), and `level` (a function of the stars and the count).

## Usage

```ts
import { BlessReviewSummary } from "blessing-ui";
```

## API

<PropsTable name="BlessReviewSummary" />

<script setup>
import ReviewSummaryBasic from "../demos/ReviewSummaryBasic.vue";
</script>
