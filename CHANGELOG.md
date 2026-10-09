# Changelog

## 0.3.0 — 2026-10-10

12 new components, 176 in all, and a round of hardening across the existing ones. Every new component has a docs page, tests, a keyboard path for what the pointer does, and passes axe in light and dark and the end-to-end flows in Chromium, Firefox and WebKit. No breaking changes.

**New components**

- `BlessSparkline`: tiny inline line, bar or win/loss chart, named with a summary for screen readers
- `BlessConfetti`: canvas burst fired with `fire()`; click-through, and silent under reduced motion
- `BlessInfiniteCanvas`: pan and zoom surface (drag, Ctrl+wheel, pinch, keys); children can `inject(blessCanvasKey)`
- `BlessNodeGraph`: draggable nodes and links on the canvas, keyboard linking (L, arrows, Enter), `acyclic`
- `BlessTreemap`: squarified part-to-whole with drill-down and arrow-key navigation
- `BlessCoachmark`: a "new" dot with a bubble, seen once (remembered by `id`)
- `BlessOnboardingChecklist`: first steps with real checkboxes, progress, collapse, dismiss and optional persistence
- `BlessDock`: magnifying icon strip; off for touch and reduced motion
- `BlessFormula`: typed calculation parsed without `eval`, live result, exact errors, "did you mean", variable chips; `evaluateFormula` is exported
- `BlessRangeCalendar`: paint many days by dragging, with keyboard painting
- `BlessAnnotator`: boxes and pins on an image, as fractions of it
- `BlessScheduler`: day or week grid; drag to create, move and resize, with overlap lanes

**Existing components**

- `BlessSortable` takes a `group`: lists with the same name trade items by drag or Alt+←/→ (Esc restores every list), with a new `transfer` event. A held grip near the window's top or bottom scrolls the page.
- `BlessKanban`: a held card near the board's edge scrolls it (`useAutoScroll` is exported).
- `BlessCommand`: `recent` puts items chosen before at the top while the search is empty (`v-model:history`, `recentLimit`, `persist`), and `scopes` lets a leading `@` or `#` narrow the search to one group, with a chip and a hint. Both are off unless asked for.
- **Fix:** `BlessTour` could not hydrate in a server-rendered app (its teleport to `body`); it now renders after mount.

**Wording**

- `labels` on Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList, PickList, Marquee, Uploader and Editor (by tool key), so buttons, hints and screen-reader announcements can be written in another language.
- Single strings: `clearLabel` (DatePicker), `dotsLabel` (Carousel), `label` (LoadingBar), `errorText` (Attachment), `removeLabel` (Combobox, FileInput), `pageLabel` (Pagination), `goLabel` (Steps); DataView and SwipeDeck empty states take `labels.empty`.

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
