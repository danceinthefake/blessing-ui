# Blocks — the contract

A block is a page-sized composition of Blessing components that you **copy into your app**, not import. Every block is one folder, layered so the view, the behavior and the data source can be swapped independently:

```
docs/blocks/<slug>/
  index.vue        presentation — binds the use-case to Bless components; no fetch, no rules
  parts/           presentation — sub-components only this block uses (optional)
  use<Name>.ts     application  — state + actions; talks to the port, never to fetch (optional)
  domain.ts        domain       — types and pure functions, no Vue imports (optional)
  api.ts           infrastructure — the port interface + a mock adapter that works offline (optional)
  meta.ts          docs only    — title, group, order, summary, components used; not part of the copy
```

Dependencies point one way: `index.vue → use*.ts → domain.ts`, and `api.ts` implements the port. Nothing imports the view.

Rules:

- Public components and `--bless-*` tokens only. A block can add layout CSS, but it never re-styles a component.
- Must render in every palette and in dark mode. A block is also a test of the system.
- Ships with a mock adapter, so it works the moment you copy it. To go live, replace `api.ts`.
- A _composition_ block (`site/`) is the one exception to the no-cross-import rule: it assembles sibling blocks, so its page says to copy those folders too.
- Small blocks are just `index.vue` + `meta.ts`. Empty layers are never created "for later".
- Into Nuxt: drop the folder into `app/features/<slug>/`, add a three-line page that renders `index.vue`.

`pnpm docs:blocks` generates the pages from the `meta.ts` of each folder. It never overwrites an existing page.
