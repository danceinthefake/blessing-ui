---
title: Pull quote
---

<script setup>
import PullQuoteBasic from "../demos/PullQuoteBasic.vue";
</script>

# Pull quote

<p class="bless-lead">A big quote from the text, with the speaker</p>

Lifts a strong line out of an article, so a reader who scans the page sees it. For quotes from customers, use the [testimonials](./testimonials).

<Demo title="Basic">
  <PullQuoteBasic />
  <template #code>

<<< ../demos/PullQuoteBasic.vue

  </template>
</Demo>

- `text` is the quote, without quote marks. For rich text, use the default slot.
- The quote marks come from CSS, in the style of the language of the page. So an English page gets “ ” and a German page gets „ “.
- `speaker` and `role` show under the quote. `cite` is a link to the source, for the `cite` attribute.
- `align` is `start` (default) or `center`.
- The markup is a native `blockquote` in a `figure`, with the speaker in the `figcaption`.

## Usage

```ts
import { BlessPullQuote } from "blessing-ui";
```

## API

<PropsTable name="BlessPullQuote" />
