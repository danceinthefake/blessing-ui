---
title: PasswordMeter
---

<script setup>
import PasswordMeterBasic from "../demos/PasswordMeterBasic.vue";
</script>

# PasswordMeter

<p class="bless-lead">Strength meter from rules</p>

Strength feedback for a password being made. [PasswordInput](./password-input) with `meter` already includes it. Use it on its own under a field of your own.

<Demo title="Basic">
  <PasswordMeterBasic />
  <template #code>

<<< ../demos/PasswordMeterBasic.vue

  </template>
</Demo>

- It counts rules passed, not real strength: a long passphrase of plain words can score "Weak" and be strong. Pass your own `rules` to match your server's policy, and let the server decide.
- The default symbol rule counts anything that is not a letter or digit in any script, so a Japanese password is not mistaken for symbols.
- `showRules` lists each rule. Screen readers hear "met" / "not met" (`ruleState`) after it.

## Usage

```ts
import { BlessPasswordMeter } from "blessing-ui";
```

## API

<PropsTable name="BlessPasswordMeter" />
