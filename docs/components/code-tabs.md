---
title: Code tabs
---

<script setup>
import CodeTabsBasic from "../demos/CodeTabsBasic.vue";
</script>

# Code tabs

<p class="bless-lead">One command in tabs for each package manager</p>

Shows a command for pnpm, npm, yarn, and bun in tabs, with a copy button. If the reader picks a tab once, every block of the same group on the page follows. The choice also stays for the next visit. It is a [code block](./code-block) with the tabs filled in.

<Demo title="Basic">
  <CodeTabsBasic />
  <template #code>

<<< ../demos/CodeTabsBasic.vue

  </template>
</Demo>

- `install` adds packages, such as `install="blessing-ui vue"`. With `dev`, they go in as dev dependencies.
- `run` runs a script of `package.json`, such as `run="dev"`. `exec` runs a package once, with `pnpm dlx`, `npx`, `yarn dlx`, or `bunx`.
- `managers` sets the tabs and their order (default pnpm, npm, yarn, and bun).
- `tabs` puts your own tabs in place of the package managers, each with a `name` and the `code`.
- All the blocks with the same `group` (default `package-manager`) show the same tab. The browser keeps the choice for the next visit. The stored choice comes back after the page loads, and the first tab shows until then.
- The tabs, the keys, and the copy button are the ones of the code block.

## Usage

```ts
import { BlessCodeTabs } from "blessing-ui";
```

## API

<PropsTable name="BlessCodeTabs" />
