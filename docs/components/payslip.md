---
title: Payslip
---

<script setup>
import PayslipBasic from "../demos/PayslipBasic.vue";
</script>

# Payslip

<p class="bless-lead">The pay of a period with earnings, deductions, and the net pay</p>

Shows one salary statement in an HR or payroll app. Your payroll system does the math of tax and benefits. The component adds up the lines and shows them.

<Demo title="Basic">
  <PayslipBasic />
  <template #code>

<<< ../demos/PayslipBasic.vue

  </template>
</Demo>

- `employee` has a `name`, and an optional `id` and `role`. `company`, `period`, and `payDate` are text.
- `earnings` and `deductions` are lists of lines, each with a `label` and an `amount`. Each list is a table with a caption and a total.
- The net pay is the earnings less the deductions, in a dark band at the end.
- In print, the frame goes away.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `employee`, `period`, `payDate`, `earnings`, `deductions`, `totalEarnings`, `totalDeductions`, and `net`.

## Usage

```ts
import { BlessPayslip } from "blessing-ui";
```

## API

<PropsTable name="BlessPayslip" />
