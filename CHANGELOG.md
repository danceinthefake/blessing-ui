# Changelog

## 0.4.0 — unreleased

16 new components, 192 in all. Every new component has a docs page, tests, and a keyboard path for what the pointer does. Every new component passes axe in light and dark, and its demo hydrates after server rendering. No breaking changes.

**Display and feedback**

- `BlessStat`: KPI tile with a value, a change, and an optional trend line. Only bad news takes a color, and the direction is also text
- `BlessBanner`: page-wide announcement bar. `persist` keeps a dismissed banner away on the next visit
- `BlessNotificationInbox`: bell with an unread count and a panel of notices. Your code owns the list
- `BlessPoll`: one question, then the results with your vote marked
- `BlessCopyButton`: copies text and says "Copied" to screen readers. `CodeBlock` shares its `copyText` helper

**Navigation and layout**

- `BlessToc`: table of contents that marks the current heading. It builds on `useScrollSpy`
- `BlessAffix`: sticky wrapper with an `offset` and a `stuck` state

**Forms**

- `BlessCardInput`: card number with groups, the brand name, and a Luhn check. `cardBrand`, `formatCard`, and `luhn` are exported
- `BlessDurationInput`: reads `1:30:00` and `1h 30m` and holds seconds. `parseDuration` and `formatDuration` are exported
- `BlessPhoneInput`: country code select and phone number. The value is E.164 text, such as `+628123456789`
- `BlessTimezonePicker`: IANA time zone search with offsets from `Intl`. It ships no zone list

**Data**

- `BlessJsonViewer`: any value as an open-and-close tree, on top of `BlessTree`
- `BlessTagCloud`: tags sized by weight, as links or buttons
- `BlessFunnel`: stages with the share that is left at each step
- `BlessRadar`: spider chart with one shape per series
- A Sankey demo on the `BlessChart` page. Unovis has the chart, so there is no new component

**Media**

- `BlessWaveform`: audio peaks as bars, with a native range over them to seek. It decodes a `src` in the browser, or takes `peaks` from your server

**Notes**

- The library is now 115.6 KB gz JS and 36.0 KB gz CSS, under the caps of 118 KB and 38 KB.
- Money needs no new component. `BlessInputNumber` formats currency through `format`. `BlessTextarea` already grows with `autogrow`. `BlessBubble` already has reaction chips.

## 0.3.0 — 2026-10-10

12 new components, 176 in all, and a round of hardening across the existing ones. Every new component has a docs page, tests, and a keyboard path for what the pointer does. Every new component passes axe in light and dark. It also passes the end-to-end flows in Chromium, Firefox, and WebKit. No breaking changes.

**New components**

- `BlessSparkline`: tiny inline line, bar or win/loss chart, named with a summary for screen readers
- `BlessConfetti`: canvas burst fired with `fire()`. It is click-through and silent under reduced motion
- `BlessInfiniteCanvas`: pan and zoom surface (drag, Ctrl+wheel, pinch, keys). Children can `inject(blessCanvasKey)`
- `BlessNodeGraph`: draggable nodes and links on the canvas, keyboard linking (L, arrows, Enter), `acyclic`
- `BlessTreemap`: squarified part-to-whole with drill-down and arrow-key navigation
- `BlessCoachmark`: a "new" dot with a bubble, seen once (remembered by `id`)
- `BlessOnboardingChecklist`: first steps with real checkboxes, progress, collapse, dismiss and optional persistence
- `BlessDock`: magnifying icon strip. It is off for touch and reduced motion
- `BlessFormula`: typed calculation parsed without `eval`. It has a live result, exact errors, "did you mean", and variable chips. `evaluateFormula` is exported
- `BlessRangeCalendar`: paint many days by dragging, with keyboard painting
- `BlessAnnotator`: boxes and pins on an image, as fractions of it
- `BlessScheduler`: day or week grid. Drag to create, move, and resize, with overlap lanes

**Existing components**

- `BlessSortable` takes a `group`: lists with the same name trade items by drag or Alt+←/→ (Esc restores every list), with a new `transfer` event. A held grip near the window's top or bottom scrolls the page.
- `BlessKanban`: a held card near the board's edge scrolls it (`useAutoScroll` is exported).
- `BlessCommand`: `recent` puts the items that you chose before at the top while the search is empty (`v-model:history`, `recentLimit`, `persist`). `scopes` lets a leading `@` or `#` narrow the search to one group, with a chip and a hint. Both are off by default.
- **Fix:** `BlessTour` did not hydrate in a server-rendered app (its teleport to `body`). It now renders after mount.

**Wording**

- `labels` on these components, so that buttons, hints, and screen-reader announcements can be written in another language: Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList, PickList, Marquee, Uploader, and Editor (by tool key).
- Single strings: `clearLabel` (DatePicker), `dotsLabel` (Carousel), `label` (LoadingBar), `errorText` (Attachment), `removeLabel` (Combobox, FileInput), `pageLabel` (Pagination), and `goLabel` (Steps). DataView and SwipeDeck empty states take `labels.empty`.

## 0.2.0 — 2026-10-03

20 new components, 164 in all. Every one has a docs page, tests, and a keyboard path for what the pointer does. Every one passes axe in light and dark. Every one also passes the end-to-end flows in Chromium, Firefox, and WebKit.

**Direct manipulation**

- `BlessSortable` (and `useSortable`): drag a grip to reorder a list or grid. From the keyboard, use Space, the arrow keys, and Esc
- `BlessKanban`: columns of cards, drag or keys between columns, per-column limits
- `BlessCropper`: crop and rotate an image, export the cropped pixels with `toBlob`
- `BlessHotspots`: numbered pins on an image or diagram with popovers. You can edit the pins
- `BlessSwipeDeck`: judge a stack of cards by swiping, keys or buttons, with undo
- `BlessSliderCaptcha`: slide the piece into the gap (a speed bump, not security)
- `BlessRadialMenu`: ring of actions from a right-click, a long touch or the menu key
- `BlessLoupe`: magnifier over an image by hover, touch-drag or arrow keys

**Time and numbers**

- `BlessCountUp`: a number that counts to its value, or rolls as an odometer
- `BlessTimer`: countdown, stopwatch and interval timer
- `BlessGauge`: zoned meter as a half circle or a bar
- `BlessGantt`: task bars on a day axis with progress, dependency arrows, and a today line. Drag bars to move or resize them
- `BlessHeatmapCalendar`: one square per day, a year of activity at a glance

**Text and input**

- `BlessMention`: `@` and `#` suggestions inside a textarea
- `BlessShortcutRecorder`: press a key combo to record it, with conflict detection (`shortcutFromEvent`, `matchShortcut` exported)
- `BlessDiff`: line diff, inline or side by side, with folding (`diffLines` exported)
- `BlessCodeBlock`: copy button, line marks, and file tabs. Bring your own highlighter
- `BlessMarquee`: ticker without a visible loop point. It pauses on hover, on focus, and with a button

**Layout**

- `BlessMasonry`: variable-height cards packed into columns, in reading order
- `BlessSplitView`: master and detail views with a draggable divider. On a narrow screen it shows one pane at a time

No breaking changes to existing components.

## 0.1.0 — 2026-09-27

First public release.

- 144 Vue 3 components styled only through `--bless-*` custom properties, with `tokens.css` usable on its own
- Native platform first: `<dialog>`, Popover API, `<details>`, native form controls, `Intl` dates
- Accessible defaults, checked with axe on every docs page in light and dark themes, and end-to-end in Chromium, Firefox and WebKit
- ESM and tree-shakable, with CSS split per component. `vue` is the only required peer (`@tiptap/vue-3` is optional, for `BlessEditor`)
- 16 copy-in blocks (sign in, dashboard, inbox, chat, settings and more) in the docs at [ui.blessing.id](https://ui.blessing.id)
