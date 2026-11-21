---
title: Paywall
---

# Paywall

<p class="bless-lead">The end of a free preview, with the plans and a sign-in link</p>

Stops a reader at the end of the free part of an article, and offers a subscription. For a full page of plans, use the [pricing table](./pricing-table).

<Demo title="Basic">
  <PaywallBasic />
  <template #code>

<<< ../demos/PaywallBasic.vue

  </template>
</Demo>

- Put the free part of the text in the default slot. Its end fades into the box below.
- `plans` is a list of plans. Each plan has an `id`, a `name`, and a `price` as text, and an optional `note`.
- The plans are native radio buttons. `pick` sets the plan that is picked at first. "Subscribe" emits `subscribe` with the id of the plan.
- `signInHref` adds a link for readers who already pay.
- The box is a section named by its title.
- Show only the free part on the page. Do not send the rest of the article to the browser and hide it, because anyone can read hidden text.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `body`, `subscribe`, `signIn`, and `plans`.

## Usage

```ts
import { BlessPaywall } from "blessing-ui";
```

## API

<PropsTable name="BlessPaywall" />

<script setup>
import PaywallBasic from "../demos/PaywallBasic.vue";
</script>
