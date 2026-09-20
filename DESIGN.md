# Blessing UI — design document

Generic Vue 3 UI library. Visual language borrowed from saenai.tv (see `../saenai/DESIGN.md`): grey-scale UI, one accent family (Megumi's pink by default, five more by `data-palette`), skewed labels instead of rounded corners, thin oversized watermark type, opacity-fade hovers.

## 1. Principles

1. **Tokens first.** Every component reads `--bless-*` only. No hard-coded colours, sizes, or durations in components. Theming = override custom props.
2. **Skew, not radius.** Shape language is `skewX(-10deg)`; radius only on tiny badges.
3. **Fluid, one breakpoint.** `clamp()` for type; single `800px` breakpoint for layout changes.
4. **Quiet motion.** Hover = opacity `.6` over `.3s`. No bounces. Respect `prefers-reduced-motion`.
5. **Light DOM, scoped CSS.** Vue SFC with `<style scoped>` + BEM-ish class `bless-<component>__<part>`. No shadow DOM, no CSS-in-JS.
6. **Accessible by default.** Fix what saenai.tv lacked: visible focus ring, `aria-*` on modal/drawer/tabs, AA contrast on text (accent-soft is decorative only).
7. **No Tailwind dependency.** Consumers may map tokens into Tailwind v4 `@theme`; library itself stays plain CSS.

## 2. Tokens (done — `tokens.css`)

| Group              | Props                                                                                                                                                                                              | Notes                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` | semantic names        |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                | Roboto + Noto Sans JP |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}`                                                                                                                                                        | `clamp()` 8→151px     |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                |                       |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}`                                                                                                                                                                | 4px base              |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                                                                   |                       |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                                                                         | modal only            |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                     |                       |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                                |                       |

Dark theme ✅: greys/border/rule/backdrop/shadow redefined (and `--bless-font-weight-thin` 100→300, since light-on-dark reads thinner) under `prefers-color-scheme: dark` (unless `data-theme="light"`) and `:root[data-theme="dark"]`; accent unchanged; `color-scheme` set so native controls follow. `useTheme()` + `BlessThemeToggle` manage the attribute + `localStorage`.

## 3. Component roadmap

Order = build order. Each row: saenai.tv origin → generic component.

### Phase 1 — primitives

- [x] `BlessSkew` — skewed container (`skewX`), counter-skews slot text. Base for label/button/tab. Props: `as`, `color` (`text|accent|danger|surface`).
- [x] `BlessButton` — `BlessSkew` + `<button>`/`<a>`. Props: `variant` (`solid|outline|ghost`), `color`, `size` (`sm|md|lg`), `href`, `disabled`, `loading`. Hover opacity, focus ring.
- [x] `BlessBadge` — `NEW!` pill. Props: `color`, `text`. `scale(.8)`, radius-sm.
- [x] `BlessDash` — 10×1px separator pseudo (date ― badge). Inline.
- [x] `BlessIcon` — slot-based SVG wrapper, `size`, `currentColor`.
- [x] `BlessText` — typographic helper. Props: `size` (token key), `weight`, `muted`, `tracking`.

### Phase 2 — layout

- [x] `BlessWatermark` — oversized thin skewed background word (`"News"`). Props: `text`, `position` (`top-right` default). `aria-hidden`.
- [x] `BlessSection` — heading + optional `BlessWatermark` + slot.
- [x] `BlessStage` — page shell: fixed sidebar (22% / 200px inner) + content (`max 1300px`); collapses to drawer ≤800px. Slots: `sidebar`, `default`, `footer`.
- [x] `BlessSidebarNav` — vertical nav list. Props: `items[{label,to,badge}]`, `active`. Emits `select`.
- [x] `BlessDrawer` — folded into `BlessStage` (no standalone need yet). mobile off-canvas; `v-model`, focus trap, `Esc` closes, `aria-modal`.
- [x] `BlessBackground` — tiled texture layer, `z:-1`, `offset` variants.

### Phase 3 — content

- [x] `BlessCard` — flat surface, no radius, optional skew header.
- [x] `BlessList` / `BlessListItem` — date + dash + badge + title row (news pattern).
- [x] `BlessTabs` — skewed tab labels; `v-model`, roving tabindex, `role=tablist`.
- [x] `BlessModal` — hash-routable (`?modal=id` or `#id`), shadow-md, `Esc`, focus return. Replaces saenai character modal.
- [x] `BlessGallery` — lightbox with prev/next (fancyBox replacement). `BlessModal` + keyboard nav.
- [x] `BlessTable` — station/credits table (onair, staff-cast). Responsive: stacked rows ≤800px.

### Phase 4 — media (optional, defer)

- [x] `BlessAudioPlayer` — sample player (Aniplex sound player analogue). Native `<audio>` + skewed controls.
- [x] `BlessSplash` — first-visit intro overlay, `localStorage` flag, reduced-motion skips.

## 3b. Roadmap v2 — shadcn parity

Target: cover [shadcn/ui's component list](https://ui.shadcn.com/docs/components) with the Blessing look. Same rules: native platform first, tokens only, no runtime dependency beyond Vue. Forms leave the non-goals list.

### Already covered (v1 name → shadcn)

`BlessButton`→Button · `BlessBadge`→Badge · `BlessCard`→Card · `BlessTabs`→Tabs · `BlessModal`→Dialog · `BlessTable`→Table · `BlessDash`→Separator (inline) · `BlessStage`→Sidebar + Sheet (mobile) · `BlessSidebarNav`→Navigation Menu (vertical) · `BlessText`→Typography · `BlessGallery`→Carousel (modal form).

### Phase 5 — native-backed primitives (no JS positioning)

- [x] `BlessSeparator` — block `<hr>` / vertical; `BlessDash` stays inline
- [x] `BlessLabel` — `<label>`, required mark, muted hint
- [x] `BlessInput` — `<input>` text/email/number/…; skewed focus underline, `invalid` state, `#prefix` `#suffix`
- [x] `BlessTextarea` — auto-grow via `field-sizing: content` + rows fallback
- [x] `BlessCheckbox` — native `<input type=checkbox>` + skewed box; `indeterminate`
- [x] `BlessRadioGroup` / `BlessRadio` — `role=radiogroup`, arrow keys are native
- [x] `BlessSwitch` — `<input type=checkbox role=switch>`
- [x] `BlessSelect` — styled native `<select>` (no custom listbox; see Phase 7 for Combobox)
- [x] `BlessSlider` — `<input type=range>`, accent fill via gradient
- [x] `BlessProgress` — `<progress>` styled, skewed track; indeterminate
- [x] `BlessSkeleton` — shimmer block, `width`/`height`/`lines`
- [x] `BlessAvatar` — img + fallback initials, `size`, `square` (skewed frame)
- [x] `BlessAspectRatio` — `aspect-ratio` wrapper
- [x] `BlessAlert` — inline notice, `color`, `#icon` `#title`, dismissible
- [x] `BlessCollapsible` — `<details>`/`<summary>`, `v-model:open`
- [x] `BlessAccordion` — group of `BlessCollapsible`, `type` single/multiple (`name` attr gives native exclusivity)
- [x] `BlessToggle` / `BlessToggleGroup` — pressed button(s), `aria-pressed`, single/multiple
- [x] `BlessBreadcrumb` — `<nav aria-label>` + `<ol>`, skewed separators
- [x] `BlessPagination` — page list + prev/next, `v-model`, `siblings`, ellipsis
- [x] `BlessScrollArea` — thin custom scrollbar via `scrollbar-width` + `scrollbar-color`, fade edges
- [x] `BlessKbd` — keycap
- [x] `BlessForm` / `BlessField` — `<form novalidate>` wrapper, field wiring label→control→error, `aria-describedby`; validation via native Constraint API (`setCustomValidity`), no schema lib

### Phase 6 — floating (Popover API + one positioning composable)

Decision: use the native **Popover API** (`popover` attr, top layer, light-dismiss) + `useFloating()` (~60 lines: anchor rect, flip, shift). Revisit `@floating-ui/dom` only if edge cases pile up. `anchor-name` CSS anchor positioning as progressive enhancement later.

- [x] `useFloating(anchor, floating, { placement, offset })`
- [x] `BlessPopover` — trigger + content, `v-model:open`, placement
- [x] `BlessTooltip` — hover/focus, delay, `role=tooltip`, `aria-describedby`
- [x] `BlessHoverCard` — `BlessPopover` with hover intent
- [x] `BlessDropdownMenu` — `role=menu`, items/checkbox/radio/separator/sub, roving focus, typeahead
- [x] `BlessContextMenu` — `BlessDropdownMenu` on `contextmenu`
- [x] `BlessMenubar` — horizontal bar of `BlessDropdownMenu`s, ←→ across menus
- [x] `BlessSheet` — side panel on `<dialog>` (extract from `BlessStage` drawer), `side` left/right/top/bottom
- [x] `BlessDrawer` — bottom sheet with drag handle (mobile); alias of `BlessSheet side=bottom` + touch drag
- [x] `BlessAlertDialog` — `BlessModal` preset: `role=alertdialog`, no backdrop dismiss, focus on cancel
- [x] `BlessToaster` / `useToast()` — `role=status` region, stack, auto-dismiss, `action`; skewed cards (Sonner equivalent)

### Phase 7 — composite

- [x] `BlessCommand` — command palette: input + filtered list, `⌘K`, groups, `role=listbox`, in `BlessModal`
- [x] `BlessCombobox` — `BlessInput` + `BlessPopover` listbox, `aria-activedescendant`, `multiple`, `creatable`
- [x] `BlessCalendar` — month grid, `role=grid`, keyboard nav, `min`/`max`, range; `Intl.DateTimeFormat`, no date lib
- [x] `BlessDatePicker` — `BlessInput` + `BlessPopover` + `BlessCalendar`; native `<input type=date>` fallback on touch
- [x] `BlessInputOTP` — n single-char inputs, paste, `autocomplete=one-time-code`
- [x] `BlessDataTable` — `BlessTable` + sorting, selection, pagination, column visibility; headless `useDataTable()`, no TanStack
- [x] `BlessCarousel` — inline scroll-snap slider, prev/next, dots, autoplay; `BlessGallery` reuses it
- [x] `BlessResizable` — split panes, `role=separator` `aria-valuenow`, keyboard resize
- [x] `BlessNavigationMenu` — horizontal top nav with mega-panels (`BlessPopover`), for non-sidebar layouts

### Phase 8 — theming

- [x] Dark tokens — OS-following + `data-theme` override, `--bless-color-backdrop` / `--bless-color-media-bg` extracted from hard-coded scrims
- [x] `useTheme()` — `light|dark|system`, persisted, `isDark`
- [x] `BlessThemeToggle` — `mode` switch (☀/☾ button) or group (`BlessToggleGroup`)

### Phase 9 — shadcn additions (2026-09 list)

- [x] `BlessSpinner` — skewed outline square, accent edge, `role=status`; `BlessButton loading` renders it
- [x] `BlessEmpty` — icon / title / description / actions, dashed frame or plain
- [x] `BlessButtonGroup` — joined `BlessButton`s, horizontal / vertical, `role=group`
- [x] `BlessInputGroup` — shared surface + underline around any control, `#prefix` `#suffix` addons (text or button)
- [x] `BlessItem` — media + title + description + actions row, `href` → `<a>`, plain / outline / surface

### Phase 10 — conversation

- [x] `BlessMessage` — avatar + header + body + footer, `align`, `compact` for grouped runs
- [x] `BlessBubble` — surface/accent/outline/plain, skew-cut tail corner, line-clamp collapsible, reactions
- [x] `BlessMarker` — status / note / separator / border, shimmer
- [x] `BlessAttachment` — ext or image media, uploading (spinner / `BlessProgress`), error, remove
- [x] `BlessMessageScroller` — ResizeObserver follow-at-bottom, `reach-top` + `loadHistory()` offset restore, jump-to-latest
- [x] `BlessQuestionnaire` — steps on `BlessRadioGroup` / `BlessCheckbox` / `BlessTextarea`, required + skip, 1–9 shortcuts, `BlessProgress`

Skipped from shadcn: Direction (RTL non-goal), Native Select / Sidebar / Toast (covered by `BlessSelect` / `BlessStage` / `BlessToaster`).

### Phase 11 — chart

Decision: **Unovis** (`@unovis/vue`) as the documented, consumer-installed pairing — SVG, CSS-var themed, same wrapper shape shadcn uses. Nothing from it is imported by the library.

- [x] `--bless-color-chart-{1..5}` — categorical palette, light and dark variants, all ≥3:1 on bg and surface
- [x] `BlessChart` — `<figure>` frame: title / description / height / legend, maps bless tokens → `--vis-*` (+ `--vis-dark-*`) for palette, axis, tooltip, crosshair

### Phase 12 — gap fill, native-first (from a broader component list)

- [x] `BlessRating` — radios in a fieldset, skewed glyph, click current to clear
- [x] `BlessFileInput` — `<input type=file>` + drop zone, file list with remove
- [x] `BlessColorPicker` — `<input type=color>` well + preset swatches
- [x] `BlessPasswordMeter` — `<meter>` scored by pluggable rules, rule list
- [x] `BlessSteps` — `<ol>` stepper, `aria-current=step`, done steps clickable
- [x] `BlessTimeline` — `<ol>` with rail, coloured dots, item slot
- [x] `BlessIndicator` — count / dot badge on a wrapped element
- [x] `BlessContainer` / `BlessStack` — layout utilities
- [x] `BlessScrollTop` — fixed button after a scroll threshold
- [x] `BlessListbox` — `role=listbox`, single / multiple, arrows / Home / End / typeahead
- [x] `BlessTree` — nested `<details>`, `role=tree`, `v-model:selected`
- [x] `BlessSwap` — checkbox with two faces, fade / rotate / flip

### Phase 13 — gap fill, medium

- [x] `BlessInputMask` — `applyMask` / `unmask` over `BlessInput`, `update:raw`
- [x] `useScrollSpy()` — IntersectionObserver, topmost intersecting id
- [x] `BlessBottomTabs` — `variant` bar (fixed, labels) or dock (floating, icons); `inline` for previews
- [x] `BlessSpeedDial` — FAB, staggered fan-out, four directions, Esc / blur close
- [x] `BlessVirtualScroller` — fixed row height window + overscan, `scrollTo(i)`
- [x] `BlessOrderList` — native HTML drag-and-drop + ↑↓ buttons + Alt+arrows, live region
- [x] `BlessPickList` — two `BlessListbox`es, › » ‹ «
- [x] `BlessMockup` — browser / window / phone (the one rounded frame — it's a device)
- [x] `BlessTour` — `useFloating` to a selector target, spotlight cut-out via box-shadow, centred steps

### Phase 14 — last cheap ones

- [x] `BlessKnob` — conic-gradient dial over a hidden native `<input type=range>` (keyboard + a11y stay native), pointer drag → angle → value
- [x] `BlessWatermarkOverlay` — tiled rotated-text SVG `background-image` layer, `aria-hidden`, no pointer events
- [x] `BlessSignaturePad` — canvas + pointer events, DPR-aware, `v-model` data URL, `clear()` / `isEmpty()`

### Phase 15 — engine-backed frames (same pattern as Chart)

- [x] `BlessEditor` — toolbar + content frame around a **Tiptap** editor; `@tiptap/vue-3` optional peer, type-only in the lib
- [x] `BlessQrCode` — SVG from a boolean matrix; **uqr** documented as the encoder, consumer-installed

### Phase 16 — PrimeVue gap fill, cheap

- [x] finish the partials: `BlessChip` (removable), `BlessInputNumber` (± / Intl), `BlessPasswordInput` (reveal + meter), `BlessStepper` (panels over `BlessSteps`), `BlessInputTags`
- [x] `BlessToolbar`, `BlessFloatLabel` (CSS-only via `:has` + `:placeholder-shown`), `BlessFieldset`, `BlessPanel`, `BlessMeterGroup`, `BlessSplitButton`, `BlessBlockUI` (`inert`), `BlessInplace`, `BlessDeferredContent`, `BlessConfirmPopup`, `BlessCompare` (`<input type=range>` + `clip-path`), `BlessDataView`
- [x] `useAnimateOnScroll()`

### Phase 17 — PrimeVue gap fill, medium

- [x] `BlessCascadeSelect` — columns per level in a `BlessPopover`, arrows drill / back, opens on the selected path
- [x] `BlessTreeSelect` — `BlessTree` in a `BlessPopover`, single closes, multiple shows chips, `leafOnly`
- [x] `BlessTreeTable` — flattens by expansion and renders through `BlessTable`; cell slots pass through
- [x] `BlessOrgChart` — recursive `ul/li` with CSS connectors, skewed nodes, `v-model:selected`
- [x] `useDialog()` + `BlessDialogHost` — promise-based, component or text body, `close(result)` prop

### Phase 18 — mobile (Quasar's touch set)

- [x] `usePan` / `useSwipe` / `useLongPress` / `useTouchRepeat` — pointer-event composables with capture
- [x] `BlessPullToRefresh` — dampened pull at scrollTop 0, `refresh(done)`
- [x] `BlessSlideItem` — pan reveals `#left` / `#right` actions, fire or `sticky`
- [x] `BlessActionSheet` — action list / grid on `BlessDrawer`
- [x] `BlessTabPanels` — swipeable pager with slide transition, `loop`
- [x] `BlessInfiniteScroll` — sentinel + `load(done)`, re-checks short pages
- [x] `BlessLayout` — header reveal, footer, left / right drawers (beside above `breakpoint`, over below, edge-swipe on touch), safe-area tokens
- [x] `--bless-safe-*` tokens

### Phase 19 — Quasar web gaps

- [x] `BlessCircularProgress` (SVG ring), `BlessRange` (two native range inputs), `BlessTimePicker` (`<input type=time>` + datalist), `BlessImg` (lazy, ratio, LQIP placeholder, error), `BlessVideo`, `BlessLoadingBar` + `useLoadingBar` (trickle, nested start/stop, `track()`), `BlessUploader` (XHR with progress + abort, or `upload` event), `BlessParallax`, `BlessSlideTransition` (JS height hooks), `BlessClientOnly`
- [x] `useResizeObserver`, `useFullscreen`, `useVisibility`, `useScroll`

Skipped from Quasar: Ripple / Morph / Mutation (directive utilities, no bounces), Meta (use `@unhead`), Cookies / WebStorage / AddressbarColor (VueUse territory), spinner variants (one spinner is the brand).

Skipped from PrimeVue: Terminal, Ripple / StyleClass / Fluid / KeyFilter (directive utilities), FocusTrap (native `<dialog>` covers it).

RTL ✅ (2026-09-20): logical properties throughout, skew mirrored under `[dir=rtl]`, `logicalKey()` swaps ←/→ in keyboard handlers; named-physical props stay physical. Guide: docs/guide/rtl.

### Phase 20 — Blocks (copy-in sections) ✅

Not components: finished sections shipped as source you copy, `docs/blocks/<slug>/` as a vertical slice (`index.vue`, optional `parts/`, `use<Name>.ts`, `domain.ts`, `api.ts` port + offline mock, docs-only `meta.ts`). `pnpm docs:blocks` scaffolds pages and the sidebar registry; `BlockDemo` previews at desktop/phone width with per-file code tabs. Contract in `docs/blocks/README.md`.

- [x] Showcase set (official-site front page): News, On Air, Character (hash-routed modals), Staff & Cast, Release, Story, Full site (composition in `BlessStage`, opens full-page)
- [x] App set: Sign in, Dashboard, Settings, Data page, Page states, Pricing, Inbox, Chat, Onboarding

### Contrast policy (axe, 2026-09-20 triage)

- Text tokens meet 4.5:1 on `bg` and `surface` in both themes: `text`, `text-muted`, `accent-text` (per palette), `danger`.
- Fills (`accent`, `badge`, `danger`, `info`) carry white at 3.6–4.4:1 — the 3:1 UI-component bar, not the text bar. Components never set small copy in a fill colour; `warning`/`success` are fills only (their text is `on-light`/`text`).
- Decorative type (`BlessWatermark`) is excluded from the audit; disabled controls are exempt by spec.
- Remaining reported nodes are all white-on-accent by design; `e2e/axe.mjs` fails on serious/critical only.

### Deliberately skipped

- **Chart** — no bundled lib. Phase 11 ✅: `--bless-color-chart-{1..5}` (≥3:1 both themes) + `BlessChart` frame that maps them onto Unovis `--vis-*` vars; Unovis is the documented pairing, installed by the consumer.
- **Sonner / Radix / cmdk ports** — behaviours re-implemented minimally, not wrapped.

### Order

5 → 6 → 7. Inside each phase, build order = list order. Every component: one test file, docs page with demo, README row, checkbox flipped.

## 4. API conventions

- Component prefix `Bless`, file `src/components/BlessButton.vue`, class prefix `bless-`.
- Props: kebab in template, camel in script. Colour/size props accept **token keys**, not raw values.
- `v-model` for open/selected state; emit `update:modelValue` only.
- Slots over render props. Named slots `prefix` / `suffix` for icons.
- No global plugin required; tree-shakable named exports from `src/index.ts`. Optional `install()` for `app.use`.
- Every component: `defineProps` typed, `defineEmits` typed, `defineOptions({ name })`.

## 5. Repo layout (target)

```
blessing-ui/
  tokens.css            ✅
  preview.html          ✅ tokens demo
  src/
    index.ts            named exports
    components/*.vue
    composables/        useFocusTrap, useHashModal, useMedia(800px)
  docs/                 VitePress site ✅ — components/*.md (demo + generated API), demos/*.vue, guide/
  package.json          exports: ./tokens.css, . (ESM), ./style.css
```

Tooling: Vite + `vite-plugin-dts`, Vitest + `@vue/test-utils` (one smoke test per component), no Storybook — the VitePress docs site is both dev playground and showcase (`docs/`, GitHub Pages via `.github/workflows/docs.yml`).

## 6. Non-goals

- Tailwind preset, RTL (deferred, see Phase 15), SSR-specific code, icon set — not needed for v0.x. (Dark mode: done, Phase 8.) (Form controls were a v0 non-goal; now Phase 5.)
- Copying saenai.tv assets (logo, art, `main_bg.png`) or CSS/JS.

## 7. Open questions

- ~~`ponytail:` ceilings~~ all lifted ✅: Tree arrow-key navigation, VirtualScroller `dynamic` (measured heights), DataTable / useDataTable `server` mode (`state` event, `total`), useFloating `boundary` + `arrow` (Tooltip always, Popover opt-in).
- Straight / rounded variant: `--bless-skew: 0deg` already removes the lean, but `--bless-radius-*` is consumed almost nowhere, so a round look is not one token today. Do it by having every skewed box also read `--bless-radius-sm` (badge, chip, button, plate) — then `skew: 0` + a radius value is the whole variant. Not started.

- ~~Package as single `style.css` bundle or per-component CSS?~~ Both ✅: `preserveModules` + `cssCodeSplit`, `scripts/postbuild.mjs` links each `BlessX.js` to `BlessX.css` and assembles `blessing-ui.css`; `sideEffects` lists `**/*.css` and `dist/index.js` (so the tokens import survives tree-shaking). One component ≈ 2 KB gzip CSS, measured by `e2e/consumer`.
- Router coupling for `BlessSidebarNav` `to` — plain `href` + `@select`, let consumer wire router. Decide at Phase 2.
