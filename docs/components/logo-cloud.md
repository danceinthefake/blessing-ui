---
title: Logo cloud
---

# Logo cloud

<p class="bless-lead">The logos of customers or partners in a calm grid, in one color</p>

Shows on a landing page who uses a product, so new visitors can trust it.

<Demo title="Basic">
  <LogoCloudBasic />
  <template #code>

<<< ../demos/LogoCloudBasic.vue

  </template>
</Demo>

- `logos` is the list. Each logo has a `name`, a `src`, and an optional `href`. The name is the alt text of the image.
- `title` adds a short line on top and names the region for screen readers.
- `mono` (on by default) shows the logos in gray, so no brand color is louder than another. A linked logo gets its colors when the pointer or the focus is on it.
- The grid fits as many logos in a row as the width allows. Each logo keeps its shape in a box 2.5 rem high.

Ask for permission before you show the logo of another company.

## Usage

```ts
import { BlessLogoCloud } from "blessing-ui";
```

## API

<PropsTable name="BlessLogoCloud" />

<script setup>
import LogoCloudBasic from "../demos/LogoCloudBasic.vue";
</script>
