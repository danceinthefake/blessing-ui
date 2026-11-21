---
title: Journal entry
---

# Journal entry

<p class="bless-lead">Debit and credit lines that must balance before the entry can be saved</p>

Records one money event in the books of an accounting or ERP app. In double-entry bookkeeping, each event changes two or more accounts, and the debits must equal the credits.

<Demo title="Basic">
  <JournalEntryBasic />
  <template #code>

<<< ../demos/JournalEntryBasic.vue

  </template>
</Demo>

- `accounts` is the chart of accounts. Each account has a `code` and a `name`.
- `v-model` is the list of lines. Each line has an `id`, an `account` code, a `debit` or a `credit`, and an optional `memo`.
- A line is a debit or a credit. If you type an amount in one column, the other column of that line clears.
- The table ends with the total of each side. A status line says "Balanced", or how much more is on one side. Screen readers hear it after each change.
- "Post the entry" emits `post`. It is off until the sides are equal and at least two lines have an account.
- The sums use whole cents, so 0.1 + 0.2 equals 0.3.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `journalTotals` function adds up the lines. It is exported for your own views.

## Usage

```ts
import { BlessJournalEntry } from "blessing-ui";
```

## API

<PropsTable name="BlessJournalEntry" />

<script setup>
import JournalEntryBasic from "../demos/JournalEntryBasic.vue";
</script>
