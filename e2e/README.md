# e2e

Build the docs site and start a preview first: `pnpm docs:build && pnpm exec vitepress preview docs --port 4173`. Then run these scripts.

- `node e2e/sweep.mjs [chromium,firefox,webkit]` opens every page in each browser and operates the first demo button. It fails on page errors and console errors. Hydration mismatches show up here.
- `node e2e/motion.mjs` sets `prefers-reduced-motion: reduce` and removes the blanket reset of VitePress. No component demo can keep a CSS animation running, except the slowed turn of the spinners.
- `node e2e/axe.mjs` runs axe-core over every component demo. It fails on serious and critical violations, except `color-contrast`. The script reports `color-contrast` only, because white text on the accent color has a 3.6:1 ratio by palette design. This ratio is AA for UI and large text.
- `node e2e/interact.mjs [chromium|firefox|webkit]` operates keyboard and pointer flows on DataTable, Command, Combobox, DropdownMenu (submenu), Calendar, Layout (phone viewport), and Tour.
- `node e2e/consumer/check.mjs` packs the library, installs it into a strict consumer project, and type-checks it. It also measures the size of a single import. When the size is over the limit, the script fails.

`pnpm e2e` runs sweep, axe, and interact on Chromium and Firefox. WebKit needs the Ubuntu-built dependencies of Playwright. CI runs all three browsers.

## Visual diff

Command: `node e2e/visual.mjs <baseUrl> <headUrl> [outDir]`.

The script renders every component demo (light and dark) on two builds of the docs with the same browser. It lists the demos that look different, with a base picture, a head picture, and a diff picture.

The repository keeps no baseline images, because fonts differ from machine to machine. To run the script on your machine, do these steps:

1. Create a second worktree, for example `git worktree add ../base HEAD~1`.
2. Build the docs in that worktree.
3. Run `vitepress preview` for each build on its own port.
4. Run the script with the two URLs.

If a demo renders differently each time, the script lists it as unstable. The script does not compare it.

CI runs the script against the previous commit and publishes a report as the `visual-diff` artifact. The report never fails the run. To make a change fail the run, add `--fail-on-change`.
