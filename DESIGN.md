# Blessing UI — design document

Generic Vue 3 UI library. We derived the visual language again from saenai.tv. The reverse-engineered notes are kept outside this repository, and the story is in docs/design/story. The language is gray-scale UI with one accent family (Megumi's pink by default, five more by `data-palette`). It has upright square plates that lean on attention, thin oversized watermark type, and opacity-fade hovers.

Writing standard: all prose follows ASD-STE100. See the "Writing standard" section in [README.md](./README.md).

## 1. Principles

1. **Tokens first.** Every component reads `--bless-*` only. No hard-coded colors, sizes, or durations in components. Theming = override custom props.
2. **Square plates that lean on attention.** One shape: the upright plate with a square outline, for everything from a button to an avatar. It leans −10° (`--bless-lean`) while hovered, focused or pressed. Content counter-skews so text stays upright. Only big display type leans at rest. The circles are the radio, the knob and the gauge, where the circle is the function. Rules: [design language](docs/design/index.md), docs/guide/conventions.
3. **Color means chosen.** Idle things are ink and outline. The accent appears only on what is selected, active, open, pressed or done, plus the focus ring and links. Hover never adds color.
4. **Fluid, one breakpoint.** `clamp()` for type. Single `800px` breakpoint for layout changes.
5. **Quiet motion.** Hover = opacity `.6` over `.3s`, plus the lean. No bounces. Respect `prefers-reduced-motion`.
6. **Light DOM, plain CSS.** Vue SFC with an unscoped `<style>` and BEM-ish classes `bless-<component>__<part>`, so overrides are ordinary CSS. No shadow DOM, no CSS-in-JS.
7. **Accessible by default.** Fix what saenai.tv lacked: visible focus ring, `aria-*` on modal/drawer/tabs, AA contrast on text (accent-soft is decorative only).
8. **No Tailwind dependency.** Consumers can map tokens into Tailwind v4 `@theme`. The library itself stays plain CSS.

## 2. Tokens (done — `tokens.css`)

| Group              | Props                                                                                                                                                                                                                                | Notes                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Color              | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-text,accent-soft,accent-2,danger,danger-text,badge,warning,success,info,info-text,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` | semantic names        |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                                                  | Roboto + Noto Sans JP |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}`                                                                                                                                                                                 | `clamp()` 8→151px     |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                                                  |                       |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}`                                                                                                                                                                                                  | 4px base              |
| Shape              | `--bless-lean`, `--bless-skew`, `--bless-skew-counter`, `--bless-lean-transition`, `--bless-petal` / `--bless-radius{,-plate,-petal,-petal-lg}` (all 0, override points), `--bless-border-width`, `--bless-dash-width`               |                       |
| Elevation          | `--bless-shadow-plate` (hard 1px accent offset), `--bless-shadow-{none,md}`                                                                                                                                                          | no blur anywhere      |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                                                       |                       |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                                                                  |                       |

Dark theme ✅: the library redefines gray, border, rule, backdrop, and shadow tokens. `--bless-font-weight-thin` changes from 100 to 300, because light-on-dark text looks thinner. This applies under `prefers-color-scheme: dark` (unless `data-theme="light"`) and under `:root[data-theme="dark"]`. The fills of the accent keep their color. Each palette's `accent-text` is lifted to 4.5:1 on the dark grays. The library sets `color-scheme`, so native controls follow. `useTheme()` and `BlessThemeToggle` manage the attribute and `localStorage`.

## 3. Component roadmap

Order = build order. Each row: saenai.tv origin → generic component.

### Phase 1 — primitives

- [x] `BlessSkew`: the plate: leans on attention (`skewX(var(--bless-skew))`), counter-skews slot text. Base for label/button/tab. Props: `as`, `color` (`text|accent|danger|surface`).
- [x] `BlessButton`: `BlessSkew` + `<button>`/`<a>`. Props: `variant` (`solid|outline|ghost`), `color`, `size` (`sm|md|lg`), `href`, `disabled`, `loading`. Hover opacity, focus ring.
- [x] `BlessBadge`: `NEW!` label, ink by default. Props: `color`, `variant`, `scaled` (`scale(.8)`).
- [x] `BlessDash`: 10×1px separator pseudo (date ― badge). Inline.
- [x] `BlessIcon`: slot-based SVG wrapper, `size`, `currentColor`.
- [x] `BlessText`: typographic helper. Props: `size` (token key), `weight`, `muted`, `tracking`.

### Phase 2 — layout

- [x] `BlessWatermark`: oversized thin background word that leans at rest (`"News"`). Props: `text`, `position` (`top-right` default). `aria-hidden`.
- [x] `BlessSection`: heading + optional `BlessWatermark` + slot.
- [x] `BlessStage`: page shell: fixed sidebar (22% / 200px inner) + content (`max 1300px`). Collapses to drawer ≤800px. Slots: `sidebar`, `default`, `footer`.
- [x] `BlessSidebarNav`: vertical nav list. Props: `items[{label,to,badge}]`, `active`. Emits `select`.
- [x] `BlessStage` drawer: mobile off-canvas sidebar. Focus moves in, `Esc` closes, closed = `inert`. (A standalone `BlessDrawer` came in Phase 6.)
- [x] `BlessBackground`: tiled texture layer, `z:-1`, `offset` variants.

### Phase 3 — content

- [x] `BlessCard`: flat surface, square, optional label on top.
- [x] `BlessList` / `BlessListItem`: date + dash + badge + title row (news pattern).
- [x] `BlessTabs`: tab labels that lean on attention. `v-model`, roving tabindex, `role=tablist`.
- [x] `BlessModal`: hash-routable (`?modal=id` or `#id`), `Esc`, focus return. Replaces saenai character modal.
- [x] `BlessGallery`: lightbox with prev/next (fancyBox replacement). `BlessModal` + keyboard nav.
- [x] `BlessTable`: station/credits table (onair, staff-cast). Responsive: stacked rows ≤800px.

### Phase 4 — media (optional, defer)

- [x] `BlessAudioPlayer`: sample player (Aniplex sound player analog). Native `<audio>`. Play is ink at rest, accent while playing.
- [x] `BlessSplash`: first-visit intro overlay, `localStorage` flag, reduced-motion skips.

## 3b. Roadmap v2 — shadcn parity

Target: cover [shadcn/ui's component list](https://ui.shadcn.com/docs/components) with the Blessing look. Same rules: native platform first, tokens only, no runtime dependency beyond Vue. Forms leave the non-goals list.

### Already covered (v1 name → shadcn)

`BlessButton`→Button · `BlessBadge`→Badge · `BlessCard`→Card · `BlessTabs`→Tabs · `BlessModal`→Dialog · `BlessTable`→Table · `BlessDash`→Separator (inline) · `BlessStage`→Sidebar + Sheet (mobile) · `BlessSidebarNav`→Navigation Menu (vertical) · `BlessText`→Typography · `BlessGallery`→Carousel (modal form).

### Phase 5 — native-backed primitives (no JS positioning)

- [x] `BlessSeparator`: block `<hr>` / vertical. `BlessDash` stays inline
- [x] `BlessLabel`: `<label>`, required mark, muted hint
- [x] `BlessInput`: `<input>` text/email/number/…. A line you write on, the accent line grows under it while you write, `invalid` state, `#prefix` `#suffix`
- [x] `BlessTextarea`: auto-grow via `field-sizing: content` + rows fallback
- [x] `BlessCheckbox`: native `<input type=checkbox>` with a square box. The box takes the accent when checked. `indeterminate`
- [x] `BlessRadioGroup` / `BlessRadio`: `role=radiogroup`, arrow keys are native
- [x] `BlessSwitch`: `<input type=checkbox role=switch>`
- [x] `BlessSelect`: styled native `<select>` (no custom listbox, see Phase 7 for Combobox)
- [x] `BlessSlider`: `<input type=range>`, accent fill via gradient
- [x] `BlessProgress`: `<progress>` styled. Indeterminate. A finished bar runs past its track (overflow, once)
- [x] `BlessSkeleton`: breathing block (no shimmer), `width`/`height`/`lines`
- [x] `BlessAvatar`: img + fallback initials, `size`, `lean` (leans on attention)
- [x] `BlessAspectRatio`: `aspect-ratio` wrapper
- [x] `BlessAlert`: inline notice, `color`, `#icon` `#title`, dismissible
- [x] `BlessCollapsible`: `<details>`/`<summary>`, `v-model:open`
- [x] `BlessAccordion`: group of `BlessCollapsible`, `type` single/multiple (`name` attr gives native exclusivity)
- [x] `BlessToggle` / `BlessToggleGroup`: pressed button(s), `aria-pressed`, single/multiple
- [x] `BlessBreadcrumb`: `<nav aria-label>` + `<ol>`, drawn separators
- [x] `BlessPagination`: page list + prev/next, `v-model`, `siblings`, ellipsis
- [x] `BlessScrollArea`: thin custom scrollbar via `scrollbar-width` + `scrollbar-color`, fade edges
- [x] `BlessKbd`: keycap
- [x] `BlessForm` / `BlessField`: `<form novalidate>` wrapper, field wiring label→control→error, `aria-describedby`. Validation via native Constraint API (`setCustomValidity`), no schema lib

### Phase 6 — floating (Popover API + one positioning composable)

Decision: use the native **Popover API** (`popover` attribute, top layer, light-dismiss) and `useFloating()` (about 60 lines: anchor rect, flip, shift). If edge cases pile up, revisit `@floating-ui/dom`. Later, add `anchor-name` CSS anchor positioning as a progressive upgrade.

- [x] `useFloating(anchor, floating, { placement, offset })`
- [x] `BlessPopover`: trigger + content, `v-model:open`, placement
- [x] `BlessTooltip`: hover/focus, delay, `role=tooltip`, `aria-describedby`
- [x] `BlessHoverCard`: `BlessPopover` with hover intent
- [x] `BlessDropdownMenu`: `role=menu`, items/checkbox/radio/separator/sub, roving focus, typeahead
- [x] `BlessContextMenu`: `BlessDropdownMenu` on `contextmenu`
- [x] `BlessMenubar`: horizontal bar of `BlessDropdownMenu`s, ←→ across menus
- [x] `BlessSheet`: side panel on `<dialog>` (extract from `BlessStage` drawer), `side` left/right/top/bottom
- [x] `BlessDrawer`: bottom sheet with drag handle (mobile). Alias of `BlessSheet side=bottom` + touch drag
- [x] `BlessAlertDialog`: `BlessModal` preset: `role=alertdialog`, no backdrop dismiss, focus on cancel
- [x] `BlessToaster` / `useToast()`: `role=status` region, stack, auto-dismiss, `action`. Square cards (Sonner equivalent)

### Phase 7 — composite

- [x] `BlessCommand`: command palette: input + filtered list, `⌘K`, groups, `role=listbox`, in `BlessModal`
- [x] `BlessCombobox`: `BlessInput` + `BlessPopover` listbox, `aria-activedescendant`, `multiple`, `creatable`
- [x] `BlessCalendar`: month grid, `role=grid`, keyboard nav, `min`/`max`, range. `Intl.DateTimeFormat`, no date lib
- [x] `BlessDatePicker`: `BlessInput` + `BlessPopover` + `BlessCalendar`. Native `<input type=date>` fallback on touch
- [x] `BlessInputOTP`: n single-char inputs, paste, `autocomplete=one-time-code`
- [x] `BlessDataTable`: `BlessTable` + sorting, selection, pagination, column visibility. Headless `useDataTable()`, no TanStack
- [x] `BlessCarousel`: inline scroll-snap slider, prev/next, dots, autoplay. `BlessGallery` reuses it
- [x] `BlessResizable`: split panes, `role=separator` `aria-valuenow`, keyboard resize
- [x] `BlessNavigationMenu`: horizontal top nav with mega-panels (`BlessPopover`), for non-sidebar layouts

### Phase 8 — theming

- [x] Dark tokens: OS-following + `data-theme` override, `--bless-color-backdrop` / `--bless-color-media-bg` extracted from hard-coded scrims
- [x] `useTheme()`: `light|dark|system`, persisted, `isDark`
- [x] `BlessThemeToggle`: `mode` switch (☀/☾ button) or group (`BlessToggleGroup`)

### Phase 9 — shadcn additions (2026-09 list)

- [x] `BlessSpinner`: outline square with one open edge, ink, `role=status`. `BlessButton loading` renders it
- [x] `BlessEmpty`: icon / title / description / actions, dashed frame or plain
- [x] `BlessButtonGroup`: joined `BlessButton`s, horizontal / vertical, `role=group`
- [x] `BlessInputGroup`: shared surface + underline around any control, `#prefix` `#suffix` addons (text or button)
- [x] `BlessItem`: media + title + description + actions row, `href` → `<a>`, plain / outline / surface

### Phase 10 — conversation

- [x] `BlessMessage`: avatar + header + body + footer, `align`, `compact` for grouped runs
- [x] `BlessBubble`: surface/accent/outline/plain, square (no tail), line-clamp collapsible, reactions
- [x] `BlessMarker`: status / note / separator / border, shimmer
- [x] `BlessAttachment`: ext or image media, uploading (spinner / `BlessProgress`), error, remove
- [x] `BlessMessageScroller`: ResizeObserver follow-at-bottom, `reach-top` + `loadHistory()` offset restore, jump-to-latest
- [x] `BlessQuestionnaire`: steps on `BlessRadioGroup` / `BlessCheckbox` / `BlessTextarea`, required + skip, 1–9 shortcuts, `BlessProgress`

Skipped from shadcn: Direction (RTL is built in instead, see below), and Native Select, Sidebar, and Toast (covered by `BlessSelect`, `BlessStage`, and `BlessToaster`).

### Phase 11 — chart

Decision: **Unovis** (`@unovis/vue`) is the documented pairing that the consumer installs. It is SVG and themed with CSS variables, and it has the same wrapper shape that shadcn uses. The library imports nothing from it.

- [x] `--bless-color-chart-{1..5}`: categorical palette, light and dark variants, all ≥3:1 on bg and surface
- [x] `BlessChart`: `<figure>` frame: title / description / height / legend, maps bless tokens → `--vis-*` (+ `--vis-dark-*`) for palette, axis, tooltip, crosshair

### Phase 12 — gap fill, native-first (from a broader component list)

- [x] `BlessRating`: radios in a fieldset, glyphs lean on attention, ink hover preview, click current to clear
- [x] `BlessFileInput`: `<input type=file>` + drop zone, file list with remove
- [x] `BlessColorPicker`: `<input type=color>` well + preset swatches
- [x] `BlessPasswordMeter`: `<meter>` scored by pluggable rules, rule list
- [x] `BlessSteps`: `<ol>` stepper, `aria-current=step`, done steps clickable
- [x] `BlessTimeline`: `<ol>` with rail, colored dots, item slot
- [x] `BlessIndicator`: count / dot badge on a wrapped element
- [x] `BlessContainer` / `BlessStack`: layout utilities
- [x] `BlessScrollTop`: fixed button after a scroll threshold
- [x] `BlessListbox`: `role=listbox`, single / multiple, arrows / Home / End / typeahead
- [x] `BlessTree`: nested `<details>`, `role=tree`, `v-model:selected`
- [x] `BlessSwap`: checkbox with two faces, fade / rotate / flip

### Phase 13 — gap fill, medium

- [x] `BlessInputMask`: `applyMask` / `unmask` over `BlessInput`, `update:raw`
- [x] `useScrollSpy()`: IntersectionObserver, topmost intersecting id
- [x] `BlessBottomTabs`: `variant` bar (fixed, labels) or dock (floating, icons). `inline` for previews
- [x] `BlessSpeedDial`: FAB, staggered fan-out, four directions, Esc / blur close
- [x] `BlessVirtualScroller`: fixed row height window + overscan, `scrollTo(i)`
- [x] `BlessOrderList`: native HTML drag-and-drop + ↑↓ buttons + Alt+arrows, live region
- [x] `BlessPickList`: two `BlessListbox`es, › » ‹ «
- [x] `BlessMockup`: browser / window / phone (the one rounded frame, because it is a device)
- [x] `BlessTour`: `useFloating` to a selector target, spotlight cut-out via box-shadow, centerd steps

### Phase 14 — last cheap ones

- [x] `BlessKnob`: conic-gradient dial over a hidden native `<input type=range>` (keyboard + a11y stay native), pointer drag → angle → value
- [x] `BlessWatermarkOverlay`: tiled rotated-text SVG `background-image` layer, `aria-hidden`, no pointer events
- [x] `BlessSignaturePad`: canvas + pointer events, DPR-aware, `v-model` data URL, `clear()` / `isEmpty()`

### Phase 15 — engine-backed frames (same pattern as Chart)

- [x] `BlessEditor`: toolbar + content frame around a **Tiptap** editor. `@tiptap/vue-3` optional peer, type-only in the lib
- [x] `BlessQrCode`: SVG from a boolean matrix. **uqr** documented as the encoder, consumer-installed

### Phase 16 — PrimeVue gap fill, cheap

- [x] finish the partials: `BlessChip` (removable), `BlessInputNumber` (± / Intl), `BlessPasswordInput` (reveal + meter), `BlessStepper` (panels over `BlessSteps`), `BlessInputTags`
- [x] `BlessToolbar`, `BlessFloatLabel` (CSS-only via `:has` + `:placeholder-shown`), `BlessFieldset`, `BlessPanel`, `BlessMeterGroup`, `BlessSplitButton`, `BlessBlockUI` (`inert`), `BlessInplace`, `BlessDeferredContent`, `BlessConfirmPopup`, `BlessCompare` (`<input type=range>` + `clip-path`), `BlessDataView`
- [x] `useAnimateOnScroll()`

### Phase 17 — PrimeVue gap fill, medium

- [x] `BlessCascadeSelect`: columns per level in a `BlessPopover`, arrows drill / back, opens on the selected path
- [x] `BlessTreeSelect`: `BlessTree` in a `BlessPopover`, single closes, multiple shows chips, `leafOnly`
- [x] `BlessTreeTable`: flattens by expansion and renders through `BlessTable`. Cell slots pass through
- [x] `BlessOrgChart`: recursive `ul/li` with CSS connectors, square nodes, `v-model:selected`
- [x] `useDialog()` + `BlessDialogHost`: promise-based, component or text body, `close(result)` prop

### Phase 18 — mobile (Quasar's touch set)

- [x] `usePan` / `useSwipe` / `useLongPress` / `useTouchRepeat`: pointer-event composables with capture
- [x] `BlessPullToRefresh`: dampened pull at scrollTop 0, `refresh(done)`
- [x] `BlessSlideItem`: pan reveals `#left` / `#right` actions, fire or `sticky`
- [x] `BlessActionSheet`: action list / grid on `BlessDrawer`
- [x] `BlessTabPanels`: swipeable pager with slide transition, `loop`
- [x] `BlessInfiniteScroll`: sentinel + `load(done)`, re-checks short pages
- [x] `BlessLayout`: header reveal, footer, left / right drawers (beside above `breakpoint`, over below, edge-swipe on touch), safe-area tokens
- [x] `--bless-safe-*` tokens

### Phase 19 — Quasar web gaps

- [x] `BlessCircularProgress` (SVG ring), `BlessRange` (two native range inputs), `BlessTimePicker` (`<input type=time>` + datalist), `BlessImg` (lazy, ratio, LQIP placeholder, error), `BlessVideo`, `BlessLoadingBar` + `useLoadingBar` (trickle, nested start/stop, `track()`), `BlessUploader` (XHR with progress + abort, or `upload` event), `BlessParallax`, `BlessSlideTransition` (JS height hooks), `BlessClientOnly`
- [x] `useResizeObserver`, `useFullscreen`, `useVisibility`, `useScroll`

Skipped from Quasar: Ripple, Morph, and Mutation (directive utilities, no bounces). Also skipped: Meta (use `@unhead`), Cookies, WebStorage, and AddressbarColor (VueUse territory). Spinner variants are skipped too, because one spinner is the brand.

Skipped from PrimeVue: Terminal, Ripple / StyleClass / Fluid / KeyFilter (directive utilities), FocusTrap (native `<dialog>` covers it).

RTL ✅ (2026-09-20): logical properties throughout. The skew is mirrored under `[dir=rtl]`. `logicalKey()` swaps ←/→ in keyboard handlers. Named-physical props stay physical. Guide: docs/guide/rtl.

### Phase 20 — Blocks (copy-in sections) ✅

Not components: finished sections that ship as source for you to copy. Each is a vertical slice in `docs/blocks/<slug>/`. A slice has these files: `index.vue`, optional `parts/`, `use<Name>.ts`, `domain.ts`, an `api.ts` port with offline mock, and a docs-only `meta.ts`. `pnpm docs:blocks` scaffolds pages and the sidebar registry. `BlockDemo` previews at desktop and phone width with per-file code tabs. The contract is in `docs/blocks/README.md`.

- [x] Official-site set (front page): News, On Air, Character (hash-routed modals), Staff & Cast, Release, Story, Full site (composition in `BlessStage`, opens full-page)
- [x] App set: Sign in, Dashboard, Settings, Data page, Page states, Pricing, Inbox, Chat, Onboarding

### Phase 21 — interactive and distinctive (proposed 2026-10-02)

Not copied from the list of another library: gaps in direct manipulation, time and numbers, text input, and spatial layout. The rules are the same as in every phase: native platform first, tokens only, no runtime dependency beyond Vue, a keyboard path for every pointer gesture, `prefers-reduced-motion` respected, and RTL via `logicalKey()`. Effort: S is under a day, M is a day or two, and L is several days. Pick from the top. Tier 1 unlocks the rest.

**Tier 1: foundation (build first)**

- [x] `useSortable` + `BlessSortable` (M) ✅: drag to reorder a list or grid. Keyboard reorder (Space grabs, arrows move, Space drops, Esc cancels) with a live-region announcement. Built on `useGesture`. `BlessOrderList` is button-only today and can adopt it. Unlocks Kanban and the reorderable grid.
- [x] `BlessHeatmapCalendar` (S) ✅: contribution-graph grid, one square per day, keyboard-navigable, tooltip per cell, `Intl` weekday and month labels. Needs no new interaction core.
- [x] `BlessMention` (M) ✅: `@` / `#` trigger inside a textarea, suggestions in a `BlessPopover`, inserts a token. Chat and editor use.

**Tier 2: direct manipulation**

- [x] `BlessKanban` (M) ✅: columns of cards, drag between columns, WIP limits. On `useSortable`.
- [x] `BlessCropper` (L) ✅: crop and rotate an image with a square handle frame. Emits a crop rect or a `Blob`. Pairs with `BlessUploader` and `BlessImg`.
- [x] `BlessHotspots` (M) ✅: pins on an image or diagram with popovers, editable or read-only, positions in percent.
- [x] `BlessSwipeDeck` (M) ✅: stack of cards, swipe or keys to accept, reject or skip, with undo. On `useGesture`.
- [x] `BlessSliderCaptcha` (S) ✅: drag a puzzle piece into the gap. A human-check widget, not security.

**Tier 3: time and numbers**

- [x] `BlessCountUp` / `BlessOdometer` (S) ✅: one component, `odometer` for the reels. Numbers roll to a new value. `Intl.NumberFormat`. Static under reduced motion.
- [x] `BlessTimer` (S) ✅: countdown, stopwatch, interval timer. `performance.now()` drift-free.
- [x] `BlessGauge` (M) ✅: semi-circle and linear gauge with zones. Read-only, `role="meter"`. `BlessKnob` and `BlessCircularProgress` do not cover zoned reads.
- [x] `BlessGantt` (L) ✅: bars on a time axis, progress, today line, keyboard + select. `editable` drag-move and resize (+ Alt+arrows), `after` dependency arrows (2026-10-03).

**Tier 4: text and input**

- [x] `BlessShortcutRecorder` (S) ✅: press a combo to record it, conflict detection. Fits `BlessKbd` and `BlessCommand`.
- [x] `BlessDiff` (M) ✅: side-by-side and inline text diff with line numbers.
- [x] `BlessCodeBlock` (S) ✅: copy button, line highlight, tabs per file. Unstyled, a slot takes the consumer's highlighter.
- [x] `BlessMarquee` (S) ✅: ticker with no visible loop point. Pauses on hover and focus. Static under reduced motion.

**Tier 5: layout and spatial**

- [x] `BlessMasonry` (M) ✅: variable-height cards. CSS `grid-template-rows: masonry` where supported, JS column fallback.
- [x] `BlessSplitView` (S) ✅: master / detail with a draggable divider. On `BlessResizable`.
- [x] `BlessRadialMenu` (M) ✅: press-and-hold radial menu on touch, right-click on desktop. Arrow keys cycle.
- [x] `BlessLoupe` (S) ✅: magnifier over an image on hover or touch.

When a component lands: tick it here, add its docs page and test, a README table row, and bump the count in "Numbers that go stale" below.

### Shape ✅ — square everywhere (2026-09-26; supersedes the 2026-09-21 merge below)

Once plates stood upright at rest, the petal read as a leaf: every part is square now, and the teardrop lives only in the mark. `--bless-petal` / `--bless-radius*` stay at 0 as override points. Kept round: radio, knob, CircularProgress (the circle is their function) and the phone Mockup (the device's corners).

#### Earlier: cut + petal merged (2026-09-21)

Cut and petal are one default, with no toggle. The rule is in docs/guide/conventions. If the source site had it, or it is a box or a label, it is cut. If it is ours and round by nature, it is petal. Round by nature means avatars, switches, chips, chat bubbles, fabs, slider thumbs, and count dots. Petal uses `--bless-radius-petal` (acute corners only, flips under RTL). We removed `data-shape`, `setShape`, `BlessShapeToggle`, and the guide page. `--bless-radius` and `--bless-radius-plate` remain at 0 as override points for consumers. Three facts led here. The film site moved to pills. The flower of the circle is soft with a point. Petal avatars read as ours, where circles read as anyone's.

### Numbers that go stale

"144 components" appears on the homepage, README, story, and package description. When the count changes, update all four (`ls src/components/Bless*.vue | grep -v test | wc -l`).

### Contrast policy (axe, 2026-09-20 triage)

- Text tokens meet 4.5:1 on `bg` and `surface` in both themes: `text`, `text-muted`, `accent-text` (per palette), `danger-text`, and `info-text`. Fills and their text are separate tokens where one color cannot do both (2026-09-25: dark `danger` read 4.18:1 as error text. `info` read 3.8:1 as outline text).
- Elevation is one hard 1px accent plate (`--bless-shadow-plate`). No blurred shadows anywhere (2026-09-20, replaced `--bless-shadow-md`).
- Fills (`accent`, `badge`, `danger`, `info`) are deepened per palette to carry white at 4.5:1 (2026-09-26). Components never set small copy in a fill color. `warning`/`success` are fills only (their text is `on-light`/`text`).
- Decorative type (`BlessWatermark`) is excluded from the audit. Disabled controls are exempt by spec.
- `e2e/axe.mjs` sweeps every page in both themes and fails on serious/critical. The count is 0.

### Phase 22 — hardening after 0.2.0 (2026-10-08)

- ✅ `e2e/motion.mjs`: with `prefers-reduced-motion: reduce`, no demo keeps a CSS animation running. The script strips the blanket reset of VitePress, because that reset hides gaps. The slowed turn of the two spinners is allowed as essential motion.
- ✅ `src/ssr.test.ts`: the test renders every docs demo on the server and hydrates it (with teleported markup injected where a framework does it). A crash or a hydration warning fails the test. It found that the `to="body"` teleport of `BlessTour` did not hydrate. The component now waits for mount.
- ✅ Bundle budget: the consumer check caps the whole library at 118 KB gz JS / 38 KB gz CSS (today 106.6 / 34.4). We raised the cap on purpose after the third catalog round. Each component adds about 1.6 KB gz.
- ✅ `labels` on every component that speaks English: Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList, and PickList. Single strings use `clearLabel`, `dotsLabel`, or `label`.
- ✅ `BlessCommand` `recent` / `scopes` (2026-10-09): chosen items come back first while the search is empty (`v-model:history`, `persist`). A leading `@` or `#` narrows the search to a group with a chip, and Backspace leaves the group. DataView and SwipeDeck also take `labels.empty`. Known limit, written in `src/ssr.test.ts`: the unit SSR test compiles demos for the browser. It cannot see a parent and child hydration disagreement that only a real `ssrRender` build shows. `e2e/sweep.mjs` on the production build covers it.
- ✅ Remaining English strings made replaceable (Marquee, Uploader, Editor, Attachment, Combobox, FileInput, Pagination, Steps, Tour step name, SliderCaptcha) and Sortable page auto-scroll (2026-10-09). OrderList uses native drag-and-drop, which the browser scrolls itself.
- ✅ `BlessSortable group`: lists trade items by drag or Alt+←/→. Esc restores every list. `transfer` event.
- ✅ Kanban auto-scroll: a held card near the board's edge or the window's top/bottom keeps scrolling (`useAutoScroll`).
- ✅ Third catalog round (2026-10-09, 164 → 169): `BlessSparkline`, `BlessConfetti`, `BlessInfiniteCanvas`, `BlessNodeGraph` (on the canvas), and `BlessTreemap`. Each has docs, a demo, tests, and an interaction flow. Then the rest of the list, 169 → 176 (2026-10-09): `BlessCoachmark`, `BlessOnboardingChecklist`, `BlessDock`, `BlessFormula`, `BlessRangeCalendar`, `BlessAnnotator`, and `BlessScheduler`. Not built, on purpose: PivotBar and SpotlightSearch. MeterGroup is already a share-of-total bar with a legend. Command already has groups, keywords, and shortcuts, and recents and scoping extend it.
- ✅ Visual diff (2026-10-09): `e2e/visual.mjs` renders every component demo, light and dark, on two builds and reports the ones that differ. CI compares against the previous commit as a non-blocking `visual` job with a downloadable `visual-diff` artifact. The job stores no baselines, because they drift per machine. Verification: we changed one color token in a copy of the build, and the job flagged 84 demos and found 292 identical. A build compared with itself gave 0 false changes, apart from live content, which the job reports as unstable.
- ✅ Releases are staged, not published, by CI (2026-10-10). The npm trusted publisher for `blessing-ui` can run only `npm stage publish` and `npm dist-tag`. A `v*` tag makes `release.yml` stage the version and create the GitHub release. A person approves the version on npm with 2FA. On the first try, a direct `npm publish` failed with E403 "OIDC permission denied".
- ⬜ Real-device touch pass (skipped).

### Phase 23 — next catalog round (proposed 2026-10-11)

We checked each name against the 176 existing pages. `BlessToggleGroup` already covers a segmented control, so that item is dropped.

First batch (done, 2026-10-11). These are small, native-first, and the docs and blocks use them.

- ✅ `BlessStat`: KPI tile with a value, a delta, and an optional `BlessSparkline`.
- ✅ `BlessToc`: table of contents that marks the current heading. It builds on `useScrollSpy`.
- ✅ `BlessCopyButton`: copies text with the Clipboard API and shows a "Copied" state to assistive technology.
- ✅ `BlessBanner`: announcement or cookie banner that a person can dismiss, with `persist`.
- ✅ `BlessAffix`: sticky wrapper with an offset.

Second batch. These need more design work.

- ⬜ Forms: `BlessPhoneInput`, `BlessCardInput`, `BlessCurrencyInput`, `BlessDurationInput`, and an auto-growing mode for `BlessTextarea`.
- ⬜ `BlessTimezonePicker` on top of `BlessCombobox`.
- ⬜ Data display: `BlessJsonViewer` (on top of `BlessTree`), `BlessTagCloud`, `BlessPoll` (vote bars), and `BlessReactions` (chips with counts).
- ⬜ `BlessNotificationInbox`: a panel of notices that a person can read and clear.
- ⬜ Charts on the `BlessChart` frame: Funnel, Radar, and Sankey. Unovis stays a consumer install.
- ⬜ Media: `BlessWaveform` for audio, and a zoom and pan viewer for `BlessGallery` and `BlessLoupe`.

Each component needs tests, a docs page with a live example, a README row, and a flipped checkbox. This is the build order of Phase 1 to 22.

### Deliberately skipped

- **Chart**: no bundled lib. Phase 11 ✅: `--bless-color-chart-{1..5}` (≥3:1 both themes) + `BlessChart` frame that maps them onto Unovis `--vis-*` vars. Unovis is the documented pairing, installed by the consumer.
- **Sonner / Radix / cmdk ports**: behaviors re-implemented minimally, not wrapped.

### Order

5 → 6 → 7. Inside each phase, build order = list order. Every component: tests (grouped per area in `src/components/*.test.ts`), a docs page with a live example, a README row, checkbox flipped.

## 4. API conventions

- Component prefix `Bless`, file `src/components/BlessButton.vue`, class prefix `bless-`.
- Props: kebab in template, camel in script. Color/size props accept **token keys**, not raw values.
- `v-model` for open/selected state. Emit `update:modelValue` only.
- Slots over render props. Named slots `prefix` / `suffix` for icons.
- No global plugin: tree-shakable named exports from `src/index.ts`. Router links via `app.provide(blessLinkKey, RouterLink)`.
- Every component: `defineProps` typed, `defineEmits` typed, `defineOptions({ name })`.

## 5. Repo layout (target)

```
blessing-ui/
  tokens.css            ✅
  preview.html          ✅ tokens demo
  src/
    index.ts            named exports
    components/*.vue
    composables/        useTheme, useFloating, useFieldId, useRovingFocus, useMedia, useGesture, …
  docs/                 VitePress site ✅ — components/*.md (demo + generated API), demos/*.vue, guide/
  package.json          exports: ./tokens.css, . (ESM), ./style.css
```

Tooling: Vite and `vite-plugin-dts`, and Vitest and `@vue/test-utils` (one smoke test per component). There is no Storybook. The VitePress docs site is both the dev playground and the documentation (`docs/`, GitHub Pages via `.github/workflows/docs.yml`).

## 6. Non-goals

- Tailwind preset, SSR-specific code, icon set: not needed for v0.x. (RTL: done.) (Dark mode: done, Phase 8.) (Form controls were a v0 non-goal, now Phase 5.)
- Copying saenai.tv assets (logo, art, `main_bg.png`) or CSS/JS.

## 7. Open questions

- ✅ **Design language (implemented, 2026-09-26):** the six philosophical threads of the series are the design rules. The rules are lean on attention, color means chosen, fuse when grouped, overflow once, write on the page, and care over spectacle. The language has one square plate everywhere, and the leaning-flower mark. Docs: the Design section (`docs/design/`). Build record in [DESIGN-LANGUAGE.md](./DESIGN-LANGUAGE.md).

- ~~`ponytail:` ceilings~~ all lifted ✅: Tree arrow-key navigation, VirtualScroller `dynamic` (measured heights), DataTable / useDataTable `server` mode (`state` event, `total`), useFloating `boundary` + `arrow` (Tooltip always, Popover opt-in).
- ~~Straight / rounded variant~~ → cut + petal merged (2026-09-21), then square everywhere with the lean on attention (2026-09-26).
- ~~Pre-publish component review, one by one~~ ✅ (2026-09-25): every component page opens with when to use the component, and when not to. Fixes for behavior and accessibility landed per component with tests. Library-wide outcomes: Field hands id, invalid, describedby, and labelledby to any control. Menu, popover, and dialog triggers carry aria-haspopup, aria-controls, and aria-expanded. Unstyled lists keep `role="list"`. Clock reads wait for mount (SSR day mismatch). Overlays return focus on close.
- ~~Blocks review~~ ✅ (2026-09-25): we checked all 16 blocks at desktop, phone, and dark, and fixed them per block. Examples of the fixes: the palette step of onboarding rendered `[object Object]`. The Enter key of chat sent mid-IME-conversion. Dashboard navigation was missing on phones. Focus followed nothing when a pane or screen replaced another. Publish done, see below.
- ~~Docs review, page by page~~ ✅ (2026-09-26/27): we checked home, guide, design, all components, all blocks, and the README against the design language. We removed the accent at rest, kept focus whenever a control removes itself, mirrored RTL, and shared Field wiring across every control (`joinIds`). Each bug that those passes found got a test.
- ~~Hanging headline, outline badge~~ ✅ `BlessSection headline="hanging"` / `#band`, `BlessBadge variant="outline"`.
- ~~Publish~~ ✅ (2026-09-27): `blessing-ui@0.1.0` on npm with CHANGELOG. Docs at ui.blessing.id, deployed to Cloudflare Pages by CI after every e2e browser passes on main.

- ~~Package as single `style.css` bundle or per-component CSS?~~ Both ✅: `preserveModules` + `cssCodeSplit`, `scripts/postbuild.mjs` links each `BlessX.js` to `BlessX.css` and assembles `blessing-ui.css`. `sideEffects` lists `**/*.css` and `dist/index.js` (so the tokens import survives tree-shaking). One component ≈ 2 KB gzip CSS, measured by `e2e/consumer`.
- ~~Router coupling~~ ✅ `blessLinkKey` provide + `useLink()`: ten link-rendering components render the provided RouterLink/NuxtLink for in-app hrefs, `<a>` otherwise. Zero router imports.
