# Blessing UI — design document

Generic Vue 3 UI library. Visual language borrowed from saenai.tv (see `../saenai/DESIGN.md`): grey-scale UI, one pink-red accent family, skewed labels instead of rounded corners, thin oversized watermark type, opacity-fade hovers.

## 1. Principles

1. **Tokens first.** Every component reads `--bless-*` only. No hard-coded colours, sizes, or durations in components. Theming = override custom props.
2. **Skew, not radius.** Shape language is `skewX(-10deg)`; radius only on tiny badges.
3. **Fluid, one breakpoint.** `clamp()` for type; single `800px` breakpoint for layout changes.
4. **Quiet motion.** Hover = opacity `.6` over `.3s`. No bounces. Respect `prefers-reduced-motion`.
5. **Light DOM, scoped CSS.** Vue SFC with `<style scoped>` + BEM-ish class `bless-<component>__<part>`. No shadow DOM, no CSS-in-JS.
6. **Accessible by default.** Fix what saenai.tv lacked: visible focus ring, `aria-*` on modal/drawer/tabs, AA contrast on text (accent-soft is decorative only).
7. **No Tailwind dependency.** Consumers may map tokens into Tailwind v4 `@theme`; library itself stays plain CSS.

## 2. Tokens (done — `tokens.css`)

| Group              | Props                                                                                                                                                | Notes                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,border,rule}` | semantic names        |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                  | Roboto + Noto Sans JP |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}`                                                                                                          | `clamp()` 8→151px     |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                  |                       |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}`                                                                                                                  | 4px base              |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                     |                       |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                           | modal only            |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                       |                       |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                  |                       |

Dark theme: not planned. Add by redefining colour props under `[data-theme="dark"]` when needed.

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
- [ ] `BlessCheckbox` — native `<input type=checkbox>` + skewed box; `indeterminate`
- [ ] `BlessRadioGroup` / `BlessRadio` — `role=radiogroup`, arrow keys are native
- [ ] `BlessSwitch` — `<input type=checkbox role=switch>`
- [ ] `BlessSelect` — styled native `<select>` (no custom listbox; see Phase 7 for Combobox)
- [ ] `BlessSlider` — `<input type=range>`, accent fill via gradient
- [ ] `BlessProgress` — `<progress>` styled, skewed track; indeterminate
- [ ] `BlessSkeleton` — shimmer block, `width`/`height`/`lines`
- [ ] `BlessAvatar` — img + fallback initials, `size`, `square` (skewed frame)
- [ ] `BlessAspectRatio` — `aspect-ratio` wrapper
- [ ] `BlessAlert` — inline notice, `color`, `#icon` `#title`, dismissible
- [ ] `BlessCollapsible` — `<details>`/`<summary>`, `v-model:open`
- [ ] `BlessAccordion` — group of `BlessCollapsible`, `type` single/multiple (`name` attr gives native exclusivity)
- [ ] `BlessToggle` / `BlessToggleGroup` — pressed button(s), `aria-pressed`, single/multiple
- [ ] `BlessBreadcrumb` — `<nav aria-label>` + `<ol>`, skewed separators
- [ ] `BlessPagination` — page list + prev/next, `v-model`, `siblings`, ellipsis
- [ ] `BlessScrollArea` — thin custom scrollbar via `scrollbar-color`/`::-webkit-scrollbar`, fade edges
- [ ] `BlessKbd` — keycap
- [ ] `BlessForm` / `BlessField` — `<form novalidate>` wrapper, field wiring label→control→error, `aria-describedby`; validation via native Constraint API (`setCustomValidity`), no schema lib

### Phase 6 — floating (Popover API + one positioning composable)

Decision: use the native **Popover API** (`popover` attr, top layer, light-dismiss) + `useFloating()` (~60 lines: anchor rect, flip, shift). Revisit `@floating-ui/dom` only if edge cases pile up. `anchor-name` CSS anchor positioning as progressive enhancement later.

- [ ] `useFloating(anchor, floating, { placement, offset })`
- [ ] `BlessPopover` — trigger + content, `v-model:open`, placement
- [ ] `BlessTooltip` — hover/focus, delay, `role=tooltip`, `aria-describedby`
- [ ] `BlessHoverCard` — `BlessPopover` with hover intent
- [ ] `BlessDropdownMenu` — `role=menu`, items/checkbox/radio/separator/sub, roving focus, typeahead
- [ ] `BlessContextMenu` — `BlessDropdownMenu` on `contextmenu`
- [ ] `BlessMenubar` — horizontal bar of `BlessDropdownMenu`s, ←→ across menus
- [ ] `BlessSheet` — side panel on `<dialog>` (extract from `BlessStage` drawer), `side` left/right/top/bottom
- [ ] `BlessDrawer` — bottom sheet with drag handle (mobile); alias of `BlessSheet side=bottom` + touch drag
- [ ] `BlessAlertDialog` — `BlessModal` preset: `role=alertdialog`, no backdrop dismiss, focus on cancel
- [ ] `BlessToast` / `useToast()` — `role=status` region, stack, auto-dismiss, `action`; skewed cards (Sonner equivalent)

### Phase 7 — composite

- [ ] `BlessCommand` — command palette: input + filtered list, `⌘K`, groups, `role=listbox`, in `BlessModal`
- [ ] `BlessCombobox` — `BlessInput` + `BlessPopover` listbox, `aria-activedescendant`, `multiple`, `creatable`
- [ ] `BlessCalendar` — month grid, `role=grid`, keyboard nav, `min`/`max`, range; `Intl.DateTimeFormat`, no date lib
- [ ] `BlessDatePicker` — `BlessInput` + `BlessPopover` + `BlessCalendar`; native `<input type=date>` fallback on touch
- [ ] `BlessInputOTP` — n single-char inputs, paste, `autocomplete=one-time-code`
- [ ] `BlessDataTable` — `BlessTable` + sorting, selection, pagination, column visibility; headless `useDataTable()`, no TanStack
- [ ] `BlessCarousel` — inline scroll-snap slider, prev/next, dots, autoplay; `BlessGallery` reuses it
- [ ] `BlessResizable` — split panes, `role=separator` `aria-valuenow`, keyboard resize
- [ ] `BlessNavigationMenu` — horizontal top nav with mega-panels (`BlessPopover`), for non-sidebar layouts

### Deliberately skipped

- **Chart** — out of scope; pair with any chart lib, expose tokens only.
- **Sonner / Radix / cmdk ports** — behaviours re-implemented minimally, not wrapped.

### Order

5 → 6 → 7. Inside each phase, build order = list order. Every component: one test file, playground section, README row, checkbox flipped.

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
  docs/                 per-component .md (props, slots, events, example)
  playground/           Vite app, one page per component
  package.json          exports: ./tokens.css, . (ESM), ./style.css
```

Tooling: Vite + `vite-plugin-dts`, Vitest + `@vue/test-utils` (one smoke test per component), no Storybook (playground page is enough). Add only when Phase 1 starts.

## 6. Non-goals

- Tailwind preset, dark mode, RTL, SSR-specific code, icon set — not needed for v0.x. (Form controls were a v0 non-goal; now Phase 5.)
- Copying saenai.tv assets (logo, art, `main_bg.png`) or CSS/JS.

## 7. Open questions

- Package as single `style.css` bundle or per-component CSS? (lean: single, Vite lib mode emits it)
- Router coupling for `BlessSidebarNav` `to` — plain `href` + `@select`, let consumer wire router. Decide at Phase 2.
