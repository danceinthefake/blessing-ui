# e2e

Run against a built docs site (`pnpm docs:build && pnpm exec vitepress preview docs --port 4173`):

- `node e2e/sweep.mjs [chromium,firefox,webkit]` — opens every page in each browser, exercises the first demo button, fails on page/console errors (hydration mismatches show up here).
- `node e2e/axe.mjs` — axe-core over every component demo, fails on serious/critical except `color-contrast`, which is reported (white-on-accent is 3.6:1 by palette design — AA for UI/large text).

- `node e2e/interact.mjs [chromium|firefox|webkit]` — keyboard/pointer flows on DataTable, Command, Combobox, DropdownMenu (submenu), Calendar, Layout (phone viewport), Tour.
- `node e2e/consumer/check.mjs` — packs the library, installs it into a strict consumer, type-checks, size-gates a single import.

`pnpm e2e` runs sweep + axe + interact on Chromium + Firefox. WebKit needs Playwright's Ubuntu-built deps; CI runs all three.
