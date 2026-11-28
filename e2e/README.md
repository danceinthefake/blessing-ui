# e2e

Build the docs site and start a preview first: `pnpm docs:build && pnpm exec vitepress preview docs --port 4173`. Then run these scripts.

- `node e2e/sweep.mjs [chromium,firefox,webkit]` opens every page in each browser and operates the first demo button. It fails on page errors and console errors. Hydration mismatches show up here.
- `node e2e/motion.mjs` sets `prefers-reduced-motion: reduce` and removes the blanket reset of VitePress. No component demo can keep a CSS animation running, except the slowed turn of the spinners.
- `node e2e/axe.mjs` runs axe-core over every component demo. It fails on serious and critical violations, except `color-contrast`. The script reports `color-contrast` only, because white text on the accent color has a 3.6:1 ratio by palette design. This ratio is AA for UI and large text.
- `node e2e/interact.mjs [chromium|firefox|webkit]` operates keyboard and pointer flows on DataTable, Command, Combobox, DropdownMenu (submenu), Calendar, Layout (phone viewport), and Tour.
- `node e2e/blocks.mjs [chromium|firefox|webkit]` opens every block on desktop and phone, light and dark. It fails on page errors, console errors, and a page that scrolls sideways. In Chromium it also runs axe with the rules of `axe.mjs`. Then it operates the main flow of each block that has a data layer, for example a transfer with a PIN in Bank and a quiz in Course.
- `node e2e/consumer/check.mjs` packs the library, installs it into a strict consumer project, and type-checks it. It also measures the size of a single import. When the size is over the limit, the script fails. Pass `--no-sizes` (or run `pnpm e2e:consumer:fast`) to skip the per-component `sizes.mjs` sweep during local fixes.
- `pnpm e2e:changed [ref] [--build]` runs Chromium sweep, axe, interact, and blocks only on the pages reached by changes since `ref` (default `HEAD`), auto-starting a local VitePress preview on `:4173` when one is not already running.

`pnpm e2e` runs sweep, axe, interact, and blocks on Chromium and Firefox. WebKit needs the Ubuntu-built dependencies of Playwright. CI runs sweep and interact in all three browsers, and blocks in Chromium and Firefox.

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
