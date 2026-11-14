# Changelog

## Unreleased

- `BlessPresenceCursors`: the live pointers of other people over an area, each with a name tag. Positions go from 0 to 1 across the area, and `move` sends the local pointer in the same form.
- `BlessTypingIndicator`: who is typing now, as a status line under a chat. One, two, and more names each have a sentence, and the dots stop under reduced motion.
- `BlessConnectionStatus`: online, offline, or reconnecting. It reads the browser's state and takes your socket's state, stays quiet while all is well, and says "Back online" for a moment after a problem.
- `BlessLogViewer`: a live log on virtual rows, with ANSI colors that follow the theme, a filter that keeps line numbers, and follow, which keeps the newest line in view until you scroll up.
- `BlessCronInput`: a five-field cron schedule with a field per part, a mark on a part that is not valid, and the next run times in the local date format. `blessCronNext` is exported.
- `BlessKeyValueEditor`: rows of key and value pairs, such as headers or environment variables, with an empty row always at the end. `toggle` turns a row off without removing it, `secret` hides the values, and a key used twice is marked.
- `BlessQueryBuilder`: filter rules (field, operator, value) in nested "all" and "any" groups. The value is plain data that you turn into a query on the server. The operators follow the type of the field.
- `BlessAudioRecorder`: record from the microphone with the native `MediaRecorder`, with live levels, pause, and a player for the recording. `record` sends the `Blob` when it stops. The browser asks for the microphone only when you press Record. 209 components in all.

## 0.5.0 — 2026-11-15

Four new components, 201 in all, docs in Bahasa Indonesia, an Indonesian label pack, and a bundle size page. No breaking changes.

- Docs in Bahasa Indonesia at [ui.blessing.id/id/](https://ui.blessing.id/id/): the home page and every guide and design page, with a language switch. Component and block pages stay English. The page sweep fails if a new guide or design page has no Indonesian version.
- `BlessDescriptions`: label and value pairs for a detail page, as a native `<dl>`. `columns` sets the most columns, and they stack on a phone. `bordered` puts the pairs in one plate.
- `BlessDateTimePicker`: a date and a time in one field, as `YYYY-MM-DDTHH:MM` in local time. `min` and `max` limit the time only on their own day. `labelsId` has its word.
- `BlessEmojiPicker`: search and pick from 353 common emoji in eight groups, recent ones first. The grid is one Tab stop, and the arrow keys move by row and column. `blessEmojis` is exported, and `emojis` takes your own list.
- `BlessMarkdown`: Markdown text with the library's type. You pass `lexer` from [marked](https://marked.js.org/), a new optional peer, so the library never loads it. The component builds each element itself: raw HTML shows as text, and only safe links and images render. GFM tables and task lists work. 201 components in all.
- Docs: a [Bundle size](https://ui.blessing.id/guide/sizes) page shows the gzipped JS and CSS of each component on its own. The consumer check measures them on every push and prints the ten largest. The install guide had old numbers, and they are now correct.
- The `blessing-ui/nuxt` module now provides `NuxtLink` as the link component, so in-app links navigate on the client with no plugin. A plugin of your own that provides `blessLinkKey` still wins.
- `labelsId`: a complete Indonesian label pack. `provideLabels(labelsId)` switches the words of all 45 components that have a `labels` prop. The `BlessLabelsFull` type helps you write a complete pack for another language, because the typecheck names each word that is missing.

## 0.4.1 — 2026-11-14

Accessibility fixes found by axe-core 4.14 and jsdom 31. No API changes, but some screen reader names now read in a different order.

**Fixes**

- `BlessConfirmPopup` now moves focus to Cancel when it opens. Before, focus stayed on the trigger, because the button was still hidden when the popup tried to focus it.
- Accessible names now contain the text that you see, so voice control users can say it (WCAG 2.5.3, "Label in Name"). A `BlessHotspots` pin is "1. Search", not "Search". A `BlessDock` item with a badge is "Mail 3". The `BlessInfiniteCanvas` reset button is "100%, Reset view". A `BlessScheduler` event is "Standup, 9:00 AM–9:30 AM, Monday, October 12", in the same order as on screen. If you replaced `labels.eventName`, keep the title and the time first.
- `BlessEditor` draws its tool symbols, such as "H1", with CSS. They are icons for the names that screen readers already hear, such as "Heading 1".

**Tooling**

- The dev dependencies are on their latest versions, and the e2e checks use axe-core 4.14. TypeScript stays on 6, because vue-tsc does not support TypeScript 7 yet.

## 0.4.0 — 2026-11-14

21 new components, 197 in all, pinned and resizable DataTable columns, and auto-import for Nuxt and Vite. Every new component has a docs page, tests, and a keyboard path for what the pointer does. Every new component passes axe in light and dark, and its demo hydrates after server rendering. No breaking changes.

**Display and feedback**

- `BlessStat`: KPI tile with a value, a change, and an optional trend line. Only bad news takes a color, and the direction is also text
- `BlessBanner`: page-wide announcement bar. `persist` keeps a dismissed banner away on the next visit
- `BlessNotificationInbox`: bell with an unread count and a panel of notices. Your code owns the list
- `BlessPoll`: one question, then the results with your vote marked
- `BlessUptimeBar`: one segment per period, up, degraded, or down, with the uptime percent as its accessible name
- `BlessAvatarGroup`: overlapping avatars with a `+N` plate that names the rest
- `BlessRelativeTime`: "2 hours ago" from `Intl.RelativeTimeFormat` in a `<time>` element. It stays up to date while the page is open
- `BlessCopyButton`: copies text and says "Copied" to screen readers. `CodeBlock` shares its `copyText` helper

**Navigation and layout**

- `BlessToc`: table of contents that marks the current heading. It builds on `useScrollSpy`
- `BlessAffix`: sticky wrapper with an `offset` and a `stuck` state

**Forms**

- `BlessCardInput`: card number with groups, the brand name, and a Luhn check. `cardBrand`, `formatCard`, and `luhn` are exported
- `BlessDurationInput`: reads `1:30:00` and `1h 30m` and holds seconds. `parseDuration` and `formatDuration` are exported
- `BlessPhoneInput`: country code select and phone number. The value is E.164 text, such as `+628123456789`
- `BlessPinPad`: on-screen number pad for a PIN, with masked squares and hardware keys. It emits `complete`
- `BlessTimezonePicker`: IANA time zone search with offsets from `Intl`. It ships no zone list

**Data**

- `BlessJsonViewer`: any value as an open-and-close tree, on top of `BlessTree`
- `BlessTagCloud`: tags sized by weight, as links or buttons
- `BlessFunnel`: stages with the share that is left at each step
- `BlessRadar`: spider chart with one shape per series
- A Sankey demo on the `BlessChart` page. Unovis has the chart, so there is no new component

**Conversation**

- `BlessThread`: nested comments with folding replies. Past `maxDepth`, replies stop indenting

**Media**

- `BlessWaveform`: audio peaks as bars, with a native range over them to seek. It decodes a `src` in the browser, or takes `peaks` from your server

**Existing components**

- `BlessDataTable`: `pin: "start"` or `"end"` on a column keeps it in view while the table scrolls sideways. `resizable` adds a handle to each header for the pointer and the arrow keys. `v-model:widths` holds the widths.

**Auto-import**

- `blessing-ui/nuxt` is a Nuxt module, and `blessing-ui/resolver` is a resolver for unplugin-vue-components. With either one, you can use a component in a template without an `import` line. `@nuxt/kit` is a new optional peer.

**Fixes**

- With a `v-model` on the parent, two events sent the value from before the change. `BlessInputOTP` `complete` did not have the last digit, and `BlessSignaturePad` `end` sent the old image. They now send the new value.
- `BlessDropdownMenu` dropped a `class` or other attribute that you gave it, and Vue showed a warning. It now puts them on the element that holds the trigger. In `BlessDataTable`, the Columns button now sits at the end of the toolbar.

**Notes**

- The library is now 119.8 KB gz JS and 36.5 KB gz CSS, under the caps of 130 KB and 40 KB.
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
