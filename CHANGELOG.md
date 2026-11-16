# Changelog

## Unreleased

Sixty-four new components, 302 in all: more charts, parts for an assistant and its agents, media and reading parts, a shop, social parts, parts for developers and admins, time and habits, events, settings forms, and marketing pages. The library still has no dependencies. No API is removed, but three components have new CSS class names: see "Changed" below.

### Changed

- `BlessRelativeTime` now has the class `.bless-reltime`, not `.bless-time`. The old class was also the class of `BlessTimePicker`, so a page with both components put the border of the time field on each relative time.
- `BlessRangeCalendar` now uses `.bless-rangecal` and `.bless-rangecal__*`, not `.bless-range*`. The old classes were also the classes of the `BlessRange` slider, and the two components changed the look of each other.
- `BlessSplitButton` now uses `.bless-splitbtn` and `.bless-splitbtn__more`, not `.bless-split*`. The old root class also took the layout of `BlessSplitView`.
- If your CSS targets one of the old classes, change it to the new class.

### Fixed

- `BlessTooltip` renders its tip as a `span`, not a `div`. A tooltip in a paragraph made the HTML not valid, and the browser cut the paragraph, so server rendering and hydration did not agree.

### Added

- `BlessCandlestick`: candles for the open, high, low, and close of each period. A rise is hollow and a fall is filled, and a table reads the numbers to screen readers.
- `BlessSunburst`: a tree of parts as rings around the total, with the same nodes as `BlessTreemap`. Children use a lighter shade of their parent, and a table reads each path to screen readers.
- `BlessDumbbell`: two values for each row, such as before and after, as a hollow dot and a filled dot joined by a line. A table reads the change of each row to screen readers.
- `BlessWaffle`: parts of a whole as a grid of 100 squares, one for each percent, with a legend that shows the share and the value of each part.
- `BlessReasoning`: the reasoning of a model in a panel that folds. It is open while the model thinks, closes at the end, and says how long the model thought.
- `BlessSources`: the sources of a reply as a numbered list with the site and a snippet. Each item has an id, so a mark in the reply with the `bless-source-mark` class links to it.
- `BlessMessageFeedback`: good and bad marks, copy, and retry under a reply. A bad mark opens a short form with reasons and a note.
- `BlessContextMeter`: a small ring that shows how full the context window is. A click opens the tokens of each part and the free tokens.
- `BlessTranscript`: lines of text with times that follow the time of the media. A click on a time seeks, and the box keeps the current line in view.
- `BlessChapterList`: the chapters of an episode with the start and length of each. The current chapter is marked with a line that grows as it plays, and a click seeks.
- `BlessWorldClock`: the time now in several time zones, with the day compared with the reader, the UTC offset, and a dark plate for night hours.
- `BlessReadingProgress`: a thin bar that fills as the reader scrolls an article or a box, with the minutes left from the count of words.
- `BlessReactions`: emoji reactions with counts. A click adds or removes the reaction of the reader, and a button opens `BlessEmojiPicker` for a new one.
- `BlessActivityFeed`: events of a team with a person, an action, and a time, newest first in groups by day, with `BlessAvatar` and `BlessRelativeTime`.
- `BlessLeaderboard`: ranked rows with shared places for equal scores, the move since last time, and the row of the reader, which shows even below the limit.
- `BlessSpreadsheet`: a grid of text cells with arrow keys, a selection, edit by typing, and copy and paste as tab text, so data moves to and from a spreadsheet app.
- `BlessPyramid`: back-to-back bars for two groups on each row, on one scale, with a legend and a table for screen readers.
- `BlessRadialBar`: rings in one circle that fill to the share of each goal, with a legend that shows the share, the value, and the max.
- `BlessStreamgraph`: stacked areas around a center line, to show how a mix changes over time, with a legend and a table for screen readers.
- `BlessPareto`: bars from high to low with a line for the running share of the total. A dashed line marks the cut, and the bars after it are lighter.
- `BlessModelPicker`: a select for a model, with a note, marks for speed and cost, and tags, on top of `BlessListbox` in a popover.
- `BlessAgentPlan`: the steps of an agent, each waiting, running, done, failed, or skipped, with an icon for each state, the progress, and the running step read aloud.
- `BlessChatHistory`: past chats in groups by age, with search, rename in place, and delete, for the sidebar of an assistant.
- `BlessVoiceInput`: a microphone button that turns speech into text with the Web Speech API, with a ring that follows the loudness. `BlessAudioRecorder` now shares its level meter with it.
- `BlessOrderSummary`: the lines of an order, then the subtotal, discount, shipping, tax, and total, with `Intl` money in any currency.
- `BlessCouponInput`: a field for a discount code. Your server checks it, then the field changes to a chip with the saving and a remove button, or shows the error.
- `BlessShipmentTracker`: the five steps of a delivery with dates, a line that fills, the latest update of the carrier, all updates in a fold, a problem as an alert, and the tracking number.
- `BlessVariantPicker`: the options of a product, such as size and color, as native radio groups with swatches, and sold-out values crossed out.
- `BlessReviewSummary`: the average stars with one decimal, the count, and a bar for each star level that filters the reviews.
- `BlessProfileCard`: a person with a cover, an avatar, a bio, short counts, and a follow toggle.
- `BlessApiKeyField`: a secret key, hidden to its start and last four letters, with show, copy, and a new key behind a confirm.
- `BlessWebhookLog`: sent events with the status in a word and a dot, the time, the request and reply bodies in a fold, and a retry button on failed rows.
- `BlessBumpChart`: the rank of each series at each step as lines that cross, with the names at the end and a hover that fades the other lines.
- `BlessLollipop`: a thin stick with a dot for each category, with the value after the dot, an optional sort, and one item in its own color.
- `BlessVenn`: two or three circles that overlap, with the count of each part worked out by inclusion and exclusion, and a table that names each part.
- `BlessRoseChart`: a polar area chart: wedges of equal angle whose area follows the value, for cycles such as months or hours.
- `BlessCodeTabs`: one command in tabs for pnpm, npm, yarn, and bun on top of `BlessCodeBlock`. Blocks of one group keep the same tab on the page and on the next visit.
- `BlessSpoiler`: text hidden under a blur, out of reach of screen readers and the keyboard, until a click shows it, in a line or as a block.
- `BlessFootnotes`: numbered notes at the end of an article, with `BlessFootnoteRef` marks in the text that link down to each note and back.
- `BlessGlossary`: a term in a line of text with a dotted line, whose meaning shows in a `BlessTooltip` on hover and focus.
- `BlessRecurrencePicker`: a rule that repeats, with native fields, day buttons, an end, the rule in one sentence, and `toRRule` for the iCalendar form.
- `BlessOpeningHours`: the hours of each day of the week with closed days, two shifts, and shifts past midnight, and an Open now line in the time zone of the place.
- `BlessHabitTracker`: a grid of days for each habit with native check boxes, the streak back from the last day, and a name for each check.
- `BlessQuotaUsage`: the limits of a plan as meters, with the use in words, and a warning near the end and at the limit.
- `BlessSeatPicker`: a map of seats in rows with gaps, zones with prices, free, taken, and chosen seats, a total, and arrow keys over one tab stop.
- `BlessTicket`: an event ticket with the details, a tear line with notches, and a stub with a `BlessQrCode` and the code.
- `BlessRsvp`: going, maybe, and not going as toggle buttons with counts that include the reader, and the faces of some people who go.
- `BlessCountdownBanner`: a `BlessBanner` with the days, hours, minutes, and seconds left to an event, Live now at the start, and the date of the start for screen readers.
- `BlessSlopeChart`: two columns, such as before and after, with a line for each item. A rise is solid and a fall is dashed and gray.
- `BlessBeeswarm`: each value as a dot on one axis, moved aside by a greedy swarm so no dots overlap, with groups and a summary table.
- `BlessMarimekko`: bars whose width is the share of all and whose parts are shares of the column, with a legend and a table.
- `BlessPictogram`: a count as rows of icons where one icon stands for a fixed number, with a part icon for the rest and a key line.
- `BlessConsentBanner`: a cookie consent bar with accept, reject, and a switch for each category, with required categories always on and the choice kept in the browser.
- `BlessNotificationPrefs`: a grid of events by channel with native check boxes, and a box for each column that is on, off, or mixed.
- `BlessAddressFields`: address fields whose order and names follow the country, with country names from `Intl.DisplayNames` and the right `autocomplete` values.
- `BlessPresetRange`: a date range with common presets or your own, next to `BlessCalendar` in range mode, with the range in words.
- `BlessTestimonials`: quotes with a name, a role, an avatar, and stars, in a grid or one at a time with buttons.
- `BlessFaqSearch`: questions and answers in native folds, with a search that keeps the matches, opens them, and marks the words.
- `BlessComparisonTable`: features by plan with checks, dashes, and values, group rows, a highlighted plan, and a header that stays at the top.
- `BlessNewsletterSignup`: an email field and a button with a native check of the address, a loading state, the server error, a thank-you, and a privacy line.
- `BlessPermissionMatrix`: roles by permissions as native check boxes in groups, with a box for each role and a locked role that has every permission.
- `BlessFeatureFlags`: flags with a `BlessSwitch`, the key, a note, the environment, and the share of users that get each flag.
- `BlessIncidentTimeline`: the updates of an incident newest first, with the impact and the state as words, the affected parts, and an edge color that follows the state.
- `BlessSystemStatus`: the parts of a service with a mark and a word for each state, and one status line that takes the worst state.
- `BlessRangeChart`: floating bars from a low to a high value for each row, with an optional mark such as the average.
- `BlessChordDiagram`: groups around a circle with ribbons for the flows both ways between them, laid out after d3-chord, with a table of the full matrix.
- `BlessParallelCoordinates`: each item as a line across several axes, each with its own scale, with a legend and a table.
- `BlessSmallMultiples`: a grid of small line charts on one shared scale with the last value of each. `BlessSparkline` gets `min` and `max` for it.
- `BlessContrastChecker`: two colors in, the WCAG 2.1 contrast ratio and the AA and AAA levels out, with `contrastRatio` and `wcagLevels` as functions.
- `BlessPaletteViewer`: the shades of each palette with the value, copy on click, and the contrast on white and black with an AA mark.
- `BlessIconPicker`: a grid of your icons as path data, with a search on names and keywords, as a native radio group.
- `BlessTypeScale`: a specimen of the font sizes with the measured size and line height, the text tokens of the library by default.
- `BlessStickyBoard`: sticky notes on a board that you add, type in, color, delete, and move by drag or with the arrow keys.
- `BlessTaskList`: tasks with native check boxes, an assignee, a due date that says late, subtasks with a count, and done tasks at the bottom.
- `BlessApprovalFlow`: the steps of a request with approvers and their decisions under an all or any rule, and Approve and Reject for the reader when it is their turn.
- `BlessVersionHistory`: saved versions newest first with the author, the time, a summary, and the change counts, a current tag, and a restore button on older versions. 314 components in all.

## 0.6.0 — 2026-11-15

Thirty-seven new components, 238 in all: charts in plain SVG, parts for a chat with an assistant, realtime and media parts, booking, and content pages. The library still has no dependencies. The Indonesian label pack covers all 76 components with a `labels` prop. No API is removed, but some CSS class names changed: see "Changed" below.

### Changed

- `BlessGallery` shows its images in the new `BlessLightbox`, so the viewer gets swipe and zoom. The classes of the viewer changed: `.bless-gallery__modal`, `__image`, `__nav`, `__count`, and `__caption` are now `.bless-lightbox`, `.bless-lightbox__image`, `__nav`, `__count`, and `__caption`. Change your CSS if it styles them.
- `BlessColorPicker` shows its presets with the new `BlessColorSwatches`: a radio group, so the arrow keys move between the colors. The class `.bless-color__swatch` is now `.bless-swatches__swatch`, and a preset has `checked`, not `aria-pressed`.
- `BlessPopover` puts a `class` and other attributes on its panel. Before, it dropped them with a warning, because it has two root elements.

### Fixed

- `BlessCropper` loads its image after mount. Before, a server render (Nuxt, VitePress) threw "Image is not defined".
- `BlessTreeSelect` marks the chosen rows in `multiple` mode, and the `BlessCascadeSelect` panel has its intended padding. Both lost the class on their popover.

### Added

- `BlessPresenceCursors`: the live pointers of other people over an area, each with a name tag. Positions go from 0 to 1 across the area, and `move` sends the local pointer in the same form.
- `BlessTypingIndicator`: who is typing now, as a status line under a chat. One, two, and more names each have a sentence, and the dots stop under reduced motion.
- `BlessConnectionStatus`: online, offline, or reconnecting. It reads the browser's state and takes your socket's state, stays quiet while all is well, and says "Back online" for a moment after a problem.
- `BlessLogViewer`: a live log on virtual rows, with ANSI colors that follow the theme, a filter that keeps line numbers, and follow, which keeps the newest line in view until you scroll up.
- `BlessCronInput`: a five-field cron schedule with a field per part, a mark on a part that is not valid, and the next run times in the local date format. `blessCronNext` is exported.
- `BlessKeyValueEditor`: rows of key and value pairs, such as headers or environment variables, with an empty row always at the end. `toggle` turns a row off without removing it, `secret` hides the values, and a key used twice is marked.
- `BlessQueryBuilder`: filter rules (field, operator, value) in nested "all" and "any" groups. The value is plain data that you turn into a query on the server. The operators follow the type of the field.
- `BlessAudioRecorder`: record from the microphone with the native `MediaRecorder`, with live levels, pause, and a player for the recording. `record` sends the `Blob` when it stops. The browser asks for the microphone only when you press Record.
- `BlessCameraCapture`: a camera preview with `getUserMedia`, a switch between cameras, and a photo as a `Blob` with `capture`. The browser asks for the camera only when you press Start, and the camera turns off after the photo.
- `BlessHighlight`: text with the search terms marked by native `<mark>`. Case and accents do not matter, so "cafe" marks "Café", and the text is never HTML.
- `BlessReadMore`: long text cut to some lines, with a button that shows all of it. The button shows only when the text is cut, measured again when the size changes.
- `BlessSankey`: flows between steps as bands in plain SVG, in columns by the longest path, with the chart colors, a hover for each flow, and a table of the flows for screen readers.
- The consumer check caps the whole library at 173 KB gz JS and 48 KB gz CSS (today 157.5 and 43.2). The README had the old total of 64 KB and 27 KB, and it is now correct.
- Accessibility: the `BlessDataTable` resize handle always has a value for screen readers, and the `BlessDock` item and `BlessScheduler` event text now matches their names ("Mail 3", not "Mail3"). axe is clean on every page again.
- `BlessBarChart`: bars for categories in plain SVG, one or more series, side by side or stacked, vertical or horizontal, with round axis steps, a hover for each bar, and a table for screen readers.
- `BlessLineChart`: lines or filled areas for one or more series over a number or a date axis, in plain SVG, with gaps for missing values, a crosshair with the values on hover, and a table for screen readers.
- `BlessDonutChart`: parts of one whole as a ring or a pie in plain SVG, with the total in the center, a legend with each value and share, and a hover for each slice.
- `BlessScatterChart`: points on two number axes in plain SVG, colored by group, with an optional size for a bubble chart, axis names, a hover for each point, and a table for screen readers.
- `BlessBoxPlot`: the spread of values in groups in plain SVG: the box from the quartiles, the median, whiskers to 1.5 × IQR, outliers as dots, and a table for screen readers. You give the raw values.
- `BlessPromptInput`: the text box of a chat with an assistant. It grows with the text, Enter sends (not inside an input method), Shift+Enter adds a line, files go with the message, and the send button becomes a stop button while `busy`.
- `BlessStreamingText`: the reply of an assistant as it comes in, with a caret until `done`, an optional even `pace` between parts, and `aria-busy` so screen readers read the full reply once.
- `BlessToolCall`: one step of an assistant, such as a web search, with its name, a status word and icon (running, done, or failed), and its input and output as text or JSON in a native `<details>`.
- `BlessSuggestions`: ready prompts as a row of chips that wrap or scroll. A click emits `select` with the prompt.
- `BlessEventCalendar`: a month of events in a grid, with whole-day events first, times in the locale format, "+2 more" when a day is full, and buttons for the previous and next month. The events fit `BlessScheduler`.
- `BlessFilterBar`: filters as chips in a row ("Status is Live"), with an editor for each chip, a list of fields to add one, and Clear all. The rules are the same data as in `BlessQueryBuilder`.
- `BlessSelectionToolbar`: a toolbar above the selected text in an area, with actions that get the text and a copy of the range. A click keeps the selection, Tab reaches the toolbar, and Escape closes it.
- `BlessLightbox`: one image from a list in a modal, with arrows, keys, a swipe to the side, and zoom with a drag to move. `BlessGallery` now uses it for its viewer, so the gallery gets swipe and zoom too.
- `BlessHeatmap`: a grid of rows and columns with each cell colored by its value, a legend of the scale, and a real table, so screen readers read each value with its row and column.
- `BlessHistogram`: raw values counted in round bins of equal width, as bars that touch, with the bin edges on the axis and a table of the counts for screen readers.
- `BlessWaterfallChart`: how a start value goes up and down in steps to an end value, with green and red steps, totals from zero, dashed links between bars, and a table for screen readers.
- `BlessBulletChart`: one value against a target and gray bands (poor, fair, good) in one thin bar, with labels that line up across rows, and a meter that says the value, the target, and the band in words.
- `BlessSlotPicker`: the free times of a day as native radio buttons, sorted into morning, afternoon, and evening, with taken slots that cannot be picked and times in the locale format.
- `BlessAvailabilityGrid`: a week of time cells where a drag paints a rectangle free or busy, with a grid that works with the keyboard and says each state in words.
- `BlessBulkActionBar`: a dark bar that slides up when rows are selected, with the count, the actions in a slot, and a clear button. It sticks to the bottom of its box, or of the window with `fixed`, and it speaks a new count.
- `BlessColorSwatches`: a set of ready colors as a group of native radios with names for screen readers and a ring on the picked color. `BlessColorPicker` now uses it for its presets, so the arrow keys move between them.
- `BlessPricingTable`: plans side by side with a monthly or yearly switch, the best saving next to it, prices in the currency and locale format, features with checks, and one featured plan.
- `BlessChangelog`: release notes with a heading per release at a level that fits the page, the date in the locale format, and the changes in the groups of Keep a Changelog.
- `BlessShortcutSheet`: keyboard shortcuts in groups with `BlessKbd` keys, alternatives with "or", `Mod` as ⌘ on Apple devices and Ctrl elsewhere, and a search by words or keys.
- `BlessFileTree`: files and folders from a flat list of paths on top of `BlessTree`, with folders first, an icon for each file type, and the folders of the selected file open. 238 components in all.

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
