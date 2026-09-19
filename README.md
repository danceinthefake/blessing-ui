<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/public/logo-dark.svg">
    <img src="docs/public/logo.svg" width="96" height="96" alt="">
  </picture>
</p>

# Blessing UI

Vue 3 component library and design tokens. Grey-scale UI, one pink-red accent, skewed labels instead of rounded corners, thin oversized watermark type, opacity-fade hovers. Visual language derived from [saenai.tv](https://www.saenai.tv/) (ideas only; no assets or CSS copied).

- 123 components (shadcn/ui parity), tokens-only styling (`--bless-*` custom properties), no Tailwind dependency
- Native platform first: `<dialog>`, Popover API, `<details>`, native form controls, `Intl` dates, scroll-snap — no positioning, date or table library
- Accessible defaults: focus rings, ARIA tablist/dialog/tables, `prefers-reduced-motion`
- ESM, tree-shakable, `vue` as the only required peer (`@tiptap/vue-3` optional, for `BlessEditor`). ~220 KB JS / 150 KB CSS raw, ~53 KB / 20 KB gzip for everything (tree-shakes per component)

## Install

```sh
pnpm add blessing-ui vue
```

```ts
// main.ts
import "blessing-ui/style.css"; // tokens + component styles
```

Fonts are not bundled. Load Roboto (100/300/400/700) and Noto Sans JP yourself, e.g.

```html
<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Noto+Sans+JP:400,700&display=swap"
  rel="stylesheet"
/>
```

Tokens only (no components):

```css
@import "blessing-ui/tokens.css";
.btn {
  background: var(--bless-color-accent);
}
```

## Usage

```vue
<script setup lang="ts">
import {
  BlessStage,
  BlessSidebarNav,
  BlessSection,
  BlessList,
  BlessListItem,
  BlessButton,
} from "blessing-ui";
</script>

<template>
  <BlessStage>
    <template #sidebar>
      <BlessSidebarNav
        :items="[{ label: 'News', href: '/news', meta: '04.04', badge: true }]"
        active="/news"
      />
    </template>

    <BlessSection title="News">
      <BlessList>
        <BlessListItem meta="2019.04.04" badge href="/news/1"
          >Blu-ray Disc BOX 発売決定</BlessListItem
        >
      </BlessList>
      <BlessButton color="accent" href="/news">More</BlessButton>
    </BlessSection>
  </BlessStage>
</template>
```

## Components

123 components across eight groups. Every one styles itself from `--bless-*` tokens and ships with a test and a docs page.

### Primitives

| Component               | Purpose                                  | Key props / slots                                                                                  |
| ----------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `BlessSkew`             | Skewed container, counter-skews its slot | `as`, `color`                                                                                      |
| `BlessButton`           | Button or anchor                         | `variant` solid/outline/ghost, `color`, `size`, `href`, `disabled`, `loading`; `#prefix` `#suffix` |
| `BlessBadge`            | Small pill                               | `color`, `scaled`                                                                                  |
| `BlessDash`             | Inline 10×1px separator                  | `color`                                                                                            |
| `BlessSeparator`        | `<hr>` / vertical rule, optional label   | `orientation`, `decorative`, `color`, `label`                                                      |
| `BlessIcon`             | SVG slot wrapper                         | `size`, `label`                                                                                    |
| `BlessText`             | Typography helper                        | `as`, `size`, `weight`, `tracking`, `leading`, `muted`, `uppercase`                                |
| `BlessKbd`              | Key combo                                | `keys[]` or slot                                                                                   |
| `BlessThemeToggle`      | Light/dark switch or 3-way group         | `mode` switch/group, `label`                                                                       |
| `BlessSpinner`          | Loading indicator (`role=status`)        | `size`, `color`, `label`; `BlessButton loading` uses it                                            |
| `BlessEmpty`            | Empty state                              | `title`, `description`, `variant` outline/plain; `#icon` `#title` `#description` default=actions   |
| `BlessButtonGroup`      | Joined buttons                           | `orientation`, `label`                                                                             |
| `BlessIndicator`        | Count / dot badge on any element         | `value` number or true, `max`, `color`, `position`                                                 |
| `BlessTimeline`         | Vertical rail of events                  | `items[{title,time,description,color}]`; `#default="{item}"` `#dot`                                |
| `BlessSwap`             | Two-face toggle                          | `v-model`, `label`, `effect` fade/rotate/flip; `#on` `#off`                                        |
| `BlessWatermarkOverlay` | Tiled text watermark over content        | `text`, `gap`, `angle`, `fontSize`, `opacity`, `color`                                             |
| `BlessChip`             | Removable pill                           | `label`, `icon`, `image`, `removable`, `color`, `size`; emits `remove`                             |
| `BlessMeterGroup`       | Multi-segment meter                      | `segments[{label,value,color}]`, `max`, `legend`, `format`, `orientation`                          |
| `BlessBlockUI`          | Blocking overlay                         | `blocked`, `fullscreen`; `#indicator`                                                              |
| `BlessMockup`           | Browser / window / phone frame           | `type`, `title`, `dark`                                                                            |
| `BlessItem`             | Media + title + description + actions    | `title`, `description`, `href`, `variant` plain/outline/surface, `size`; `#media` `#actions`       |
| `BlessAvatar`           | Image with initials fallback             | `src`, `name`, `size`, `square`, `color`                                                           |
| `BlessSkeleton`         | Shimmer placeholder                      | `width`, `height`, `lines`, `circle`                                                               |
| `BlessAspectRatio`      | Ratio box                                | `ratio`                                                                                            |
| `BlessProgress`         | Bar, determinate or not                  | `value`, `max`, `label`, `showValue`, `color`, `size`                                              |
| `BlessAlert`            | Inline notice                            | `title`, `color`, `live`, `dismissible`, `v-model`; `#icon` `#title`                               |

### Forms

| Component                          | Purpose                                                     | Key props / slots                                                                                                                          |
| ---------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `BlessLabel`                       | `<label>` with required mark and hint                       | `for`, `required`, `hint`                                                                                                                  |
| `BlessInput`                       | Text-like input                                             | `v-model`, `type`, `size`, `invalid`, `description`, `error`; `#prefix` `#suffix`                                                          |
| `BlessInputGroup`                  | Shared surface: addons + any control                        | `size`, `disabled`; `#prefix` `#suffix` (text or `BlessButton`), default = `BlessInput`/`BlessSelect`                                      |
| `BlessTextarea`                    | Auto-growing textarea                                       | `v-model`, `rows`, `autogrow`, `maxlength`, `counter`, `error`                                                                             |
| `BlessCheckbox`                    | Native checkbox                                             | `v-model` (bool or array), `value`, `indeterminate`, `description`                                                                         |
| `BlessRadioGroup` / `BlessRadio`   | Native radios                                               | group `v-model`, `label`, `orientation`; radio `value`, `description`                                                                      |
| `BlessSwitch`                      | `role=switch` toggle                                        | `v-model`, `size`, `labelPosition`                                                                                                         |
| `BlessRating`                      | Star rating on native radios                                | `v-model`, `max`, `icon`, `size`, `readonly`                                                                                               |
| `BlessFileInput`                   | File input + drop zone                                      | `v-model` File[], `accept`, `multiple`, `hint`, `list`, `invalid`                                                                          |
| `BlessColorPicker`                 | `<input type=color>` + swatches                             | `v-model` hex, `swatches[]`, `showValue`                                                                                                   |
| `BlessPasswordMeter`               | Strength `<meter>` from rules                               | `value`, `rules[{label,test}]`, `labels`, `showRules`                                                                                      |
| `BlessListbox`                     | `role=listbox`, keyboard + typeahead                        | `v-model` (array when `multiple`), `options`, `rows`, `label`; `#default="{option, selected}"`                                             |
| `BlessKnob`                        | Rotary dial on `<input type=range>`                         | `v-model`, `min`, `max`, `step`, `size`, `sweep`, `format`, `label`                                                                        |
| `BlessSignaturePad`                | Canvas signature                                            | `v-model` data URL, `height`, `lineWidth`, `color`, `type`; emits `end`; exposes `clear()` `isEmpty()`                                     |
| `BlessEditor`                      | Rich text toolbar for Tiptap                                | `editor` (from `useEditor`), `tools[]`, `minHeight`; default slot = `<EditorContent>`; `#toolbar` `#footer`. Optional peer `@tiptap/vue-3` |
| `BlessInputNumber`                 | Number with ± and Intl format                               | `v-model` number, `min`, `max`, `step`, `buttons`, `prefix`, `suffix`, `format`, `locale`                                                  |
| `BlessPasswordInput`               | Password + reveal + meter                                   | `v-model`, `meter`; wraps `BlessInput`                                                                                                     |
| `BlessInputTags`                   | Free-text tags                                              | `v-model` string[], `separators`, `max`, `duplicates`                                                                                      |
| `BlessFloatLabel`                  | Floating / in-field label                                   | `label`, `for`, `variant` over/in; wrap a control with `placeholder=" "`                                                                   |
| `BlessFieldset`                    | `<fieldset>` + legend                                       | `legend`, `toggleable`, `v-model:collapsed`, `disabled`                                                                                    |
| `BlessInplace`                     | Click to edit                                               | `v-model:active`, `closable`; `#display` `#content="{close}"`                                                                              |
| `BlessCompare`                     | Before / after slider                                       | `v-model` 0–100, `orientation`; `#before` `#after`                                                                                         |
| `BlessInputMask`                   | Pattern-masked `BlessInput`                                 | `v-model` masked, `mask` (`#` digit `A` letter `*` either), `placeholder`; emits `update:raw`                                              |
| `BlessOrderList`                   | Reorderable list                                            | `v-model` items, `rowKey`, `buttons`; drag, ↑↓, Alt+arrows; emits `move`; `#default="{item,index}"`                                        |
| `BlessPickList`                    | Transfer between two listboxes                              | `v-model:source`, `v-model:target`, `sourceLabel`, `targetLabel`, `rows`                                                                   |
| `BlessSelect`                      | Styled native `<select>` (picker styled too on Chrome 135+) | `v-model`, `options` (groups ok), `placeholder`, `size`, `error`                                                                           |
| `BlessSlider`                      | Native range                                                | `v-model`, `min`, `max`, `step`, `showValue`, `format`                                                                                     |
| `BlessToggle` / `BlessToggleGroup` | Pressed buttons                                             | toggle `v-model:pressed`, `value`; group `v-model`, `type` single/multiple                                                                 |
| `BlessCombobox`                    | Searchable select                                           | `v-model`, `options`, `multiple`, `creatable` (emits `create`), `size`                                                                     |
| `BlessDatePicker`                  | Calendar in a popover                                       | `v-model` ISO string or `[start,end]`, `range`, `min`, `max`, `locale`, `nativeOnTouch`                                                    |
| `BlessCalendar`                    | Month grid                                                  | same as DatePicker plus `weekStart`, `disabledDates`, `month`                                                                              |
| `BlessInputOTP`                    | One-time code cells                                         | `v-model`, `length`, `numeric`, `separators`, `masked`; emits `complete`                                                                   |
| `BlessForm` / `BlessField`         | Constraint-API form + field wiring                          | form emits `submit(FormData)` / `invalid`; field `label`, `required`, `description`, `error`; `#default="{ id, error, describedby }"`      |

### Layout & navigation

| Component                                   | Purpose                                  | Key props / slots                                                                                                       |
| ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `BlessStage`                                | Page shell, sidebar → drawer under 800px | `v-model:open`; `#sidebar` default `#footer` `#background`                                                              |
| `BlessSidebarNav`                           | Vertical nav list                        | `items`, `active`; emits `select`; `#item`                                                                              |
| `BlessNavigationMenu`                       | Horizontal nav with panels               | `items[{label,href,items[]}]`; emits `select`; `#panel`                                                                 |
| `BlessMenubar`                              | Bar of `BlessDropdownMenu`s              | `label`                                                                                                                 |
| `BlessSteps`                                | Stepper                                  | `steps[{label,description}]`, `v-model` index, `orientation`, `clickable`; emits `select`                               |
| `BlessTree` / `BlessTreeItem`               | Nested `<details>` tree                  | `nodes[{label,id,href,icon,children,open,disabled}]`, `v-model:selected`; emits `select`                                |
| `BlessContainer`                            | Centred max-width box                    | `size` sm/md/lg/full, `padded`, `as`                                                                                    |
| `BlessStack`                                | Flex row / column                        | `direction`, `gap` token, `align`, `justify`, `wrap`, `as`                                                              |
| `BlessScrollTop`                            | Back-to-top button                       | `threshold`, `target`, `position`, `label`                                                                              |
| `BlessToolbar`                              | Start / center / end bar                 | `label`, `surface`; `#start` `#center` `#end`                                                                           |
| `BlessPanel`                                | Titled box                               | `title`, `toggleable`, `v-model:collapsed`, `surface`; `#actions` `#footer`                                             |
| `BlessStepper`                              | Steps + panels                           | `steps`, `v-model`, `orientation`, `labels`; `#default="{step,index,next,prev,last}"` `#actions`; emits `finish`        |
| `BlessSplitButton`                          | Button + menu                            | `label`, `items`, `color`, `variant`, `size`; emits `click` `select`                                                    |
| `BlessDataView`                             | List / grid + pagination                 | `items`, `pageSize`, `columns`, `v-model:layout`, `rowKey`; `#default="{item,index,layout}"` `#header` `#empty`         |
| `BlessDeferredContent`                      | Mount on scroll into view                | `rootMargin`, `minHeight`; `#placeholder`; emits `load`                                                                 |
| `BlessBottomTabs`                           | Mobile bottom nav / dock                 | `items[{label,value,icon,href,badge}]`, `v-model`, `variant` bar/dock, `inline`; emits `select`                         |
| `BlessSpeedDial`                            | FAB with fan-out actions                 | `actions[{label,value,icon,color}]`, `direction`, `color`, `v-model:open`, `inline`; emits `select`                     |
| `BlessVirtualScroller`                      | Windowed list (fixed row height)         | `items`, `itemHeight`, `height`, `overscan`, `rowKey`; exposes `scrollTo(i)`; `#default="{item,index}"`                 |
| `BlessBreadcrumb`                           | Trail                                    | `items[{label,href}]`, `separator`; `#item`                                                                             |
| `BlessPagination`                           | Page list                                | `v-model`, `total`, `siblings`, `href(page)`                                                                            |
| `BlessTabs`                                 | ARIA tablist                             | `tabs`, `v-model`, `activation`, `color`; `#default="{tab}"` `#tab`                                                     |
| `BlessSection` / `BlessWatermark`           | Titled block with giant skewed word      | `title`, `watermark`, `watermarkPosition`, `headingLevel`                                                               |
| `BlessBackground`                           | Tiled texture layer                      | `src`, `offset`, `mode`, `opacity`                                                                                      |
| `BlessCard`                                 | Flat surface                             | `label`, `labelColor`, `surface`, `bordered`, `href`; `#media` `#footer`                                                |
| `BlessList` / `BlessListItem`               | Divided rows                             | item `meta`, `badge`, `href`; `#suffix`                                                                                 |
| `BlessCollapsible` / `BlessAccordion(Item)` | `<details>` based                        | `v-model:open`, `title`, `disabled`; accordion `type` single/multiple                                                   |
| `BlessScrollArea`                           | Thin scrollbar + fade                    | `axis`, `fade`, `height`, `width`                                                                                       |
| `BlessResizable`                            | Two-pane split                           | `v-model` (% of first pane), `direction`, `min`, `max`, `step`; `#a` `#b`                                               |
| `BlessTable`                                | Typed table, stacks on mobile            | `columns`, `rows`, `rowKey`, `caption`, `striped`, `stack`; `#cell-<key>`                                               |
| `BlessDataTable`                            | Table + sort/search/select/paginate      | `columns` (+`sortable`, `hideable`), `rows`, `rowKey`, `selectable`, `searchable`, `pageSize`; `#toolbar` `#cell-<key>` |

### Overlays

| Component                     | Purpose                          | Key props / slots                                                                                                               |
| ----------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `BlessModal`                  | Native `<dialog>`                | `v-model`, `title`, `hash` (deep link), `size`, `dismissible`; `#footer`                                                        |
| `BlessAlertDialog`            | Confirm dialog                   | `v-model`, `title`, `description`, `confirmLabel`, `cancelLabel`, `color`, `loading`; emits `confirm` `cancel`                  |
| `BlessSheet`                  | Side panel                       | `v-model`, `side`, `title`, `size`, `handle`; `#footer`                                                                         |
| `BlessDrawer`                 | Bottom sheet with swipe-to-close | `v-model`, `title`                                                                                                              |
| `BlessPopover`                | Popover API panel                | `v-model:open`, `placement`, `trigger` click/hover/manual, `modal`; `#trigger` `#default="{close}"`                             |
| `BlessTooltip`                | Hover/focus tip                  | `text`, `placement`, `delay`; `#content`                                                                                        |
| `BlessHoverCard`              | Rich hover popover               | `placement`, `openDelay`, `closeDelay`; `#trigger`                                                                              |
| `BlessDropdownMenu`           | ARIA menu                        | `items` (item/checkbox/radio/separator/label/sub), `placement`, `v-model:checked`, `v-model:radios`; emits `select`; `#trigger` |
| `BlessContextMenu`            | Menu on right click              | `items`; wraps its slot                                                                                                         |
| `BlessCommand`                | ⌘K palette                       | `v-model:open`, `items` (groups, keywords, shortcuts), `inline`, `hotkey`; emits `select`; `#footer`                            |
| `BlessGallery`                | Thumb grid + lightbox            | `items`, `v-model` index, `columns`, `loop`                                                                                     |
| `BlessConfirmPopup`           | Confirm in a popover             | `message`, `title`, `confirmLabel`, `cancelLabel`, `color`, `placement`, `v-model:open`; emits `confirm` `cancel`               |
| `BlessTour`                   | Spotlight walkthrough            | `steps[{target,title,text,placement}]`, `v-model:open`, `v-model:step`, `spotlight`, `labels`; emits `finish` `skip`            |
| `BlessToaster` + `useToast()` | Notifications                    | `position`; `toast()`, `success()`, `error()`, `warning()`, `info()`, `dismiss()`                                               |
| `BlessSplash`                 | First-visit overlay              | `once`, `duration`, `skipLabel`; emits `done`                                                                                   |

### Conversation

| Component              | Purpose                                | Key props / slots                                                                                                            |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `BlessMessage`         | Avatar + header + content + footer row | `name`, `time`, `avatar`, `align` start/end, `compact`; `#avatar` `#header` `#footer` `#actions`                             |
| `BlessBubble`          | Message bubble                         | `variant` surface/accent/outline/plain, `align`, `collapsible`, `lines`, `reactions[]`; emits `react`                        |
| `BlessMarker`          | Inline status / note / separator / row | `variant` status/note/separator/border, `color`, `shimmer`; `#icon`                                                          |
| `BlessAttachment`      | File / image chip                      | `name`, `description`, `src`, `href`, `state` idle/uploading/error, `progress`, `size`, `removable`; emits `remove`          |
| `BlessMessageScroller` | Chat viewport                          | `height`, `initial`, `threshold`; emits `reach-top` `at-bottom`; exposes `scrollToBottom()` `scrollTo(id)` `loadHistory(fn)` |
| `BlessQuestionnaire`   | Multi-step single/multiple/freeform    | `questions[]`, `v-model` answers, `v-model:step`, `shortcuts`, `labels`; emits `submit` `skip`                               |

### Chart

| Component     | Purpose                                                          | Key props / slots                                                                            |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `BlessChart`  | Themed frame for any [Unovis](https://unovis.dev) chart          | `title`, `description`, `height`, `legend[]`; `#header` `#legend` `#footer`, default = chart |
| `BlessQrCode` | QR SVG from a module matrix ([uqr](https://github.com/unjs/uqr)) | `matrix` boolean[][], `value`, `size`, `border`, `color`, `background`, `frame`              |

Blessing does not bundle a chart library. `BlessChart` maps `--bless-color-chart-{1..5}`, type and dark mode onto Unovis' `--vis-*` variables, and adds a skewed legend. Install Unovis yourself:

```sh
pnpm add @unovis/vue @unovis/ts
```

```vue
<BlessChart title="Views" :legend="['S1', 'S2']">
  <VisXYContainer :data>
    <VisLine :x="(d) => d.x" :y="[(d) => d.a, (d) => d.b]" />
    <VisAxis type="x" /><VisAxis type="y" />
    <VisTooltip /><VisCrosshair />
  </VisXYContainer>
</BlessChart>
```

Any other SVG chart lib works too — read `var(--bless-color-chart-N)` for series colours.

### Media

| Component          | Purpose            | Key props / slots                                                 |
| ------------------ | ------------------ | ----------------------------------------------------------------- |
| `BlessCarousel`    | Scroll-snap slider | `v-model`, `perView`, `gap`, `loop`, `autoplay`, `dots`, `arrows` |
| `BlessAudioPlayer` | Track list player  | `tracks`, `v-model` index, `color`; emits `play` `pause` `ended`  |

### Composables

`useMedia(query?)` · `useHash()` · `useScrollSpy(ids | selector, { rootMargin, root })` → `{ active }` · `useAnimateOnScroll(el, { threshold, rootMargin, once })` → `{ visible }` · `applyMask(mask, input)` / `unmask(mask, masked)` · `useTheme()` → `{ theme, isDark, set, toggle }` · `useFloating(anchor, floating, active, opts | () => opts)` · `useToast()` · `useDataTable(rows, { rowKey, pageSize, searchKeys })` · date helpers `toISO` `fromISO` `addDays` `addMonths` `isoToday`.

### Types

`BlessNavItem`, `BlessNavMenuItem`, `BlessTab`, `BlessGalleryItem`, `BlessColumn<T>`, `BlessDataColumn<T>`, `BlessOption<T>`, `BlessTrack`, `BlessMenuItem`, `BlessCommandItem`, `BlessCrumb`, `BlessToastOptions`, `BlessTheme`, `BlessStep`, `BlessTimelineItem`, `BlessTreeNode`, `BlessPasswordRule`, `BlessBottomTab`, `BlessSpeedDialAction`, `BlessTourStep`, `BlessEditorTool`, `BlessMeterSegment`, `BlessReaction`, `BlessQuestion`, `BlessQuestionChoice`, `BlessAnswers`, `Placement`, `DataTableState`.

## Tokens

All styling reads `--bless-*` custom properties defined in `tokens.css`. Override on `:root` (or any subtree) to theme:

```css
:root {
  --bless-color-accent: #0aa;
  --bless-skew: -6deg;
}
```

| Group              | Props                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}` (fluid `clamp()`, 8→151px)                                                                                                                             |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` (4px base)                                                                                                                                                     |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                                                                   |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                                                                         |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                     |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                                |

### Dark mode

Greys invert, the accent family stays, and `--bless-font-weight-thin` steps 100→300 (hairlines read thinner light-on-dark). Follows `prefers-color-scheme` by default; set `data-theme="dark"` / `"light"` on `<html>` to force one. `useTheme()` persists the choice in `localStorage` (`bless-theme`) and applies the attribute; `BlessThemeToggle` is the ready-made control. Override the dark palette under `:root[data-theme="dark"]` and inside the `prefers-color-scheme: dark` block in `tokens.css`.

Durations collapse to `0s` under `prefers-reduced-motion`. Tailwind v4 users can map tokens in `@theme { --color-accent: var(--bless-color-accent); }`.

## Conventions

- Components `Bless*`, CSS classes `bless-<component>__<part>` / `--<modifier>`, no scoped styles or shadow DOM so overrides are plain CSS.
- Colour/size props take token keys, never raw values.
- `v-model` for open/selected state; no router coupling (`BlessSidebarNav` emits `select`, call `preventDefault` and route yourself).

## Development

```sh
mise install        # node 24, pnpm 12
pnpm install
pnpm dev            # docs site (VitePress) with live demos against src/ — http://localhost:5173
pnpm docs:meta      # regenerate docs/.vitepress/meta.json from the components (vue-component-meta)
pnpm docs:pages     # scaffold a docs page for any component that lacks one
pnpm test           # vitest + jsdom
pnpm typecheck      # vue-tsc
pnpm build          # dist/blessing-ui.{js,css} + index.d.ts
pnpm format         # oxfmt
```

Design principles and roadmap: [DESIGN.md](./DESIGN.md).

## License

MIT
