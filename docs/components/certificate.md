---
title: Certificate
---

<script setup>
import CertificateBasic from "../demos/CertificateBasic.vue";
</script>

# Certificate

<p class="bless-lead">A certificate of completion that prints on one page</p>

Gives a learner proof that they finished a course, on screen and on paper.

<Demo title="Basic">
  <CertificateBasic />
  <template #code>

<<< ../demos/CertificateBasic.vue

  </template>
</Demo>

- `name` is the person who gets the certificate. `course` and `date` say what they finished and when. `issuer` is the school or the company.
- `signer` and `signer-role` add a signature line. `code` and `verify-url` let a reader look up the certificate, so they know that it is real.
- The certificate keeps the shape of an A4 page on its side. All sizes grow with its width, so it looks the same on a phone and on paper.
- On paper, the certificate does not break across pages. To print it alone, hide the rest of your page in a print style sheet, and set `@page { size: A4 landscape }`.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessCertificate } from "blessing-ui";
```

## API

<PropsTable name="BlessCertificate" />
