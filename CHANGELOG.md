# Changelog

## Unreleased

- **5 new components** (169 in all): `BlessSparkline` (tiny inline line / bar / win-loss), `BlessConfetti` (canvas burst fired with `fire()`, off under reduced motion), `BlessInfiniteCanvas` (pan and zoom surface, with `blessCanvasKey` for children), `BlessNodeGraph` (draggable nodes and links, keyboard linking, `acyclic`) and `BlessTreemap` (squarified part-to-whole with drill-down).
- **Fix:** `BlessTour` could not hydrate in a server-rendered app (its teleport to `body`); it now renders after mount.
- **`labels` prop** on Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList and PickList: translate buttons, hints and screen-reader announcements. Single strings: `clearLabel` (DatePicker), `dotsLabel` (Carousel), `label` (LoadingBar).
- **`BlessSortable` `group`:** lists with the same group name trade items by drag or Alt+←/→ (Esc restores every list); new `transfer` event.
- **Kanban:** a held card near the board's edge scrolls it; new `useAutoScroll` composable.

## 0.2.0 — 2026-10-03

20 new components, 164 in all. Every one has a docs page, tests, a keyboard path for what the pointer does, and passes axe in light and dark and the end-to-end flows in Chromium, Firefox and WebKit.

**Direct manipulation**

- `BlessSortable` (and `useSortable`): drag a grip to reorder a list or grid; Space, arrows, Esc from the keyboard
- `BlessKanban`: columns of cards, drag or keys between columns, per-column limits
- `BlessCropper`: crop and rotate an image, export the cropped pixels with `toBlob`
- `BlessHotspots`: numbered pins on an image or diagram with popovers; editable
- `BlessSwipeDeck`: judge a stack of cards by swiping, keys or buttons, with undo
- `BlessSliderCaptcha`: slide the piece into the gap (a speed bump, not security)
- `BlessRadialMenu`: ring of actions from a right-click, a long touch or the menu key
- `BlessLoupe`: magnifier over an image by hover, touch-drag or arrow keys

**Time and numbers**

- `BlessCountUp`: a number that counts to its value, or rolls as an odometer
- `BlessTimer`: countdown, stopwatch and interval timer
- `BlessGauge`: zoned meter as a half circle or a bar
- `BlessGantt`: task bars on a day axis with progress, dependency arrows and a today line; drag bars to move or resize them
- `BlessHeatmapCalendar`: one square per day, a year of activity at a glance

**Text and input**

- `BlessMention`: `@` and `#` suggestions inside a textarea
- `BlessShortcutRecorder`: press a key combo to record it, with conflict detection (`shortcutFromEvent`, `matchShortcut` exported)
- `BlessDiff`: line diff, inline or side by side, with folding (`diffLines` exported)
- `BlessCodeBlock`: copy button, line marks, file tabs; bring your own highlighter
- `BlessMarquee`: seamless ticker that pauses on hover, focus and a button

**Layout**

- `BlessMasonry`: variable-height cards packed into columns, in reading order
- `BlessSplitView`: master / detail with a draggable divider, one pane at a time when narrow

No breaking changes to existing components.

## 0.1.0 — 2026-09-27

First public release.

- 144 Vue 3 components styled only through `--bless-*` custom properties, with `tokens.css` usable on its own
- Native platform first: `<dialog>`, Popover API, `<details>`, native form controls, `Intl` dates
- Accessible defaults, checked with axe on every docs page in light and dark themes, and end-to-end in Chromium, Firefox and WebKit
- ESM and tree-shakable, with CSS split per component; `vue` is the only required peer (`@tiptap/vue-3` optional, for `BlessEditor`)
- 16 copy-in blocks (sign in, dashboard, inbox, chat, settings and more) in the docs at [ui.blessing.id](https://ui.blessing.id)
