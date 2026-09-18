# Blessing UI

Vue 3 component library and design tokens. Grey-scale UI, one pink-red accent, skewed labels instead of rounded corners, thin oversized watermark type, opacity-fade hovers. Visual language derived from [saenai.tv](https://www.saenai.tv/) (ideas only; no assets or CSS copied).

- 63 components (shadcn/ui parity), tokens-only styling (`--bless-*` custom properties), no Tailwind dependency
- Native platform first: `<dialog>`, Popover API, `<details>`, native form controls, `Intl` dates, scroll-snap — no positioning, date or table library
- Accessible defaults: focus rings, ARIA tablist/dialog/tables, `prefers-reduced-motion`
- ESM, tree-shakable, `vue` as the only peer dependency. ~123 KB JS / 80 KB CSS raw, ~30 KB / 11 KB gzip for everything (tree-shakes per component)

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

63 components across seven groups. Every one styles itself from `--bless-*` tokens and ships with a test and a playground section.

### Primitives

| Component          | Purpose                                  | Key props / slots                                                                                  |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `BlessSkew`        | Skewed container, counter-skews its slot | `as`, `color`                                                                                      |
| `BlessButton`      | Button or anchor                         | `variant` solid/outline/ghost, `color`, `size`, `href`, `disabled`, `loading`; `#prefix` `#suffix` |
| `BlessBadge`       | Small pill                               | `color`, `scaled`                                                                                  |
| `BlessDash`        | Inline 10×1px separator                  | `color`                                                                                            |
| `BlessSeparator`   | `<hr>` / vertical rule, optional label   | `orientation`, `decorative`, `color`, `label`                                                      |
| `BlessIcon`        | SVG slot wrapper                         | `size`, `label`                                                                                    |
| `BlessText`        | Typography helper                        | `as`, `size`, `weight`, `tracking`, `leading`, `muted`, `uppercase`                                |
| `BlessKbd`         | Key combo                                | `keys[]` or slot                                                                                   |
| `BlessThemeToggle` | Light/dark switch or 3-way group         | `mode` switch/group, `label`                                                                       |
| `BlessAvatar`      | Image with initials fallback             | `src`, `name`, `size`, `square`, `color`                                                           |
| `BlessSkeleton`    | Shimmer placeholder                      | `width`, `height`, `lines`, `circle`                                                               |
| `BlessAspectRatio` | Ratio box                                | `ratio`                                                                                            |
| `BlessProgress`    | Bar, determinate or not                  | `value`, `max`, `label`, `showValue`, `color`, `size`                                              |
| `BlessAlert`       | Inline notice                            | `title`, `color`, `live`, `dismissible`, `v-model`; `#icon` `#title`                               |

### Forms

| Component                          | Purpose                               | Key props / slots                                                                                                                     |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `BlessLabel`                       | `<label>` with required mark and hint | `for`, `required`, `hint`                                                                                                             |
| `BlessInput`                       | Text-like input                       | `v-model`, `type`, `size`, `invalid`, `description`, `error`; `#prefix` `#suffix`                                                     |
| `BlessTextarea`                    | Auto-growing textarea                 | `v-model`, `rows`, `autogrow`, `maxlength`, `counter`, `error`                                                                        |
| `BlessCheckbox`                    | Native checkbox                       | `v-model` (bool or array), `value`, `indeterminate`, `description`                                                                    |
| `BlessRadioGroup` / `BlessRadio`   | Native radios                         | group `v-model`, `label`, `orientation`; radio `value`, `description`                                                                 |
| `BlessSwitch`                      | `role=switch` toggle                  | `v-model`, `size`, `labelPosition`                                                                                                    |
| `BlessSelect`                      | Styled native `<select>`              | `v-model`, `options` (groups ok), `placeholder`, `size`, `error`                                                                      |
| `BlessSlider`                      | Native range                          | `v-model`, `min`, `max`, `step`, `showValue`, `format`                                                                                |
| `BlessToggle` / `BlessToggleGroup` | Pressed buttons                       | toggle `v-model:pressed`, `value`; group `v-model`, `type` single/multiple                                                            |
| `BlessCombobox`                    | Searchable select                     | `v-model`, `options`, `multiple`, `creatable` (emits `create`), `size`                                                                |
| `BlessDatePicker`                  | Calendar in a popover                 | `v-model` ISO string or `[start,end]`, `range`, `min`, `max`, `locale`, `nativeOnTouch`                                               |
| `BlessCalendar`                    | Month grid                            | same as DatePicker plus `weekStart`, `disabledDates`, `month`                                                                         |
| `BlessInputOTP`                    | One-time code cells                   | `v-model`, `length`, `numeric`, `separators`, `masked`; emits `complete`                                                              |
| `BlessForm` / `BlessField`         | Constraint-API form + field wiring    | form emits `submit(FormData)` / `invalid`; field `label`, `required`, `description`, `error`; `#default="{ id, error, describedby }"` |

### Layout & navigation

| Component                                   | Purpose                                  | Key props / slots                                                                                                       |
| ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `BlessStage`                                | Page shell, sidebar → drawer under 800px | `v-model:open`; `#sidebar` default `#footer` `#background`                                                              |
| `BlessSidebarNav`                           | Vertical nav list                        | `items`, `active`; emits `select`; `#item`                                                                              |
| `BlessNavigationMenu`                       | Horizontal nav with panels               | `items[{label,href,items[]}]`; emits `select`; `#panel`                                                                 |
| `BlessMenubar`                              | Bar of `BlessDropdownMenu`s              | `label`                                                                                                                 |
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
| `BlessToaster` + `useToast()` | Notifications                    | `position`; `toast()`, `success()`, `error()`, `warning()`, `info()`, `dismiss()`                                               |
| `BlessSplash`                 | First-visit overlay              | `once`, `duration`, `skipLabel`; emits `done`                                                                                   |

### Media

| Component          | Purpose            | Key props / slots                                                 |
| ------------------ | ------------------ | ----------------------------------------------------------------- |
| `BlessCarousel`    | Scroll-snap slider | `v-model`, `perView`, `gap`, `loop`, `autoplay`, `dots`, `arrows` |
| `BlessAudioPlayer` | Track list player  | `tracks`, `v-model` index, `color`; emits `play` `pause` `ended`  |

### Composables

`useMedia(query?)` · `useHash()` · `useTheme()` → `{ theme, isDark, set, toggle }` · `useFloating(anchor, floating, active, { placement, offset })` · `useToast()` · `useDataTable(rows, { rowKey, pageSize, searchKeys })` · date helpers `toISO` `fromISO` `addDays` `addMonths` `isoToday`.

### Types

`BlessNavItem`, `BlessNavMenuItem`, `BlessTab`, `BlessGalleryItem`, `BlessColumn<T>`, `BlessDataColumn<T>`, `BlessOption<T>`, `BlessTrack`, `BlessMenuItem`, `BlessCommandItem`, `BlessCrumb`, `BlessToastOptions`, `BlessTheme`, `Placement`, `DataTableState`.

## Tokens

All styling reads `--bless-*` custom properties defined in `tokens.css`. Override on `:root` (or any subtree) to theme:

```css
:root {
  --bless-color-accent: #0aa;
  --bless-skew: -6deg;
}
```

| Group              | Props                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                     |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}` (fluid `clamp()`, 8→151px)                                                                                                                  |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                     |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` (4px base)                                                                                                                                          |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                                                        |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                                                              |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                          |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                     |

### Dark mode

Greys invert, the accent family stays. Follows `prefers-color-scheme` by default; set `data-theme="dark"` / `"light"` on `<html>` to force one. `useTheme()` persists the choice in `localStorage` (`bless-theme`) and applies the attribute; `BlessThemeToggle` is the ready-made control. Override the dark palette under `:root[data-theme="dark"]` and inside the `prefers-color-scheme: dark` block in `tokens.css`.

Durations collapse to `0s` under `prefers-reduced-motion`. Tailwind v4 users can map tokens in `@theme { --color-accent: var(--bless-color-accent); }`.

## Conventions

- Components `Bless*`, CSS classes `bless-<component>__<part>` / `--<modifier>`, no scoped styles or shadow DOM so overrides are plain CSS.
- Colour/size props take token keys, never raw values.
- `v-model` for open/selected state; no router coupling (`BlessSidebarNav` emits `select`, call `preventDefault` and route yourself).

## Development

```sh
mise install        # node 24, pnpm 12
pnpm install
pnpm dev            # playground: http://localhost:5173 (+ /forms.html, /floating.html, /composite.html, /stage.html)
pnpm test           # vitest + jsdom
pnpm typecheck      # vue-tsc
pnpm build          # dist/blessing-ui.{js,css} + index.d.ts
pnpm format         # oxfmt
```

Design principles and roadmap: [DESIGN.md](./DESIGN.md).

## License

MIT
