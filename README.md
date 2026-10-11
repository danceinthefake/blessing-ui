<p align="center">
  <img src="docs/public/logo.svg" width="96" height="96" alt="">
</p>

# Blessing UI

[![npm](https://img.shields.io/npm/v/blessing-ui)](https://www.npmjs.com/package/blessing-ui) [![ci](https://github.com/danceinthefake/blessing-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/danceinthefake/blessing-ui/actions/workflows/ci.yml)

Vue 3 component library and design tokens. The UI is gray-scale, with one accent that appears only on what someone chose. The look has square, upright plates that lean on engagement, thin oversized watermark type, and opacity-fade hovers. The rules come from a [design language](docs/design/index.md). We derived the look again from the official site of one anime, and took ideas only. The [story](docs/design/story.md) says which anime, what we kept, and what we did not take.

Docs, with every component live: **[ui.blessing.id](https://ui.blessing.id)**

- 188 components, from button to data table to chat. Only `--bless-*` custom properties style them. There is no Tailwind dependency.
- Native platform first: `<dialog>`, Popover API, `<details>`, native form controls, `Intl` dates, and scroll-snap. There is no positioning, date, or table library.
- Accessible defaults: focus rings, ARIA tablist, dialog, and tables, and `prefers-reduced-motion`
- ESM, tree-shakable, with `vue` as the only required peer (`@tiptap/vue-3` is optional, for `BlessEditor`). One component (`BlessButton`) costs about 1 KB gzip of JS and about 2.6 KB of CSS (tokens and its own styles). Everything costs about 64 KB and 27 KB. CSS is split per component and the import pulls it in, so you never pay for styles that you do not use

## Install

```sh
pnpm add blessing-ui vue
```

```ts
import { BlessButton } from "blessing-ui";
```

That is all. Each component brings its own stylesheet, and the tokens come with the first import. To load all styles up front instead (no bundler, or a CDN):

```ts
import "blessing-ui/style.css"; // tokens + every component's styles
```

Fonts are not bundled. Load Roboto (100/300/400/700) and Noto Sans JP yourself, for example:

```html
<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Noto+Sans+JP:400,700&display=swap"
  rel="stylesheet"
/>
```

Tokens only (no components):

```css
@import "blessing-ui/tokens.css";
.tab[aria-selected="true"] {
  background: var(--bless-color-accent); /* the accent marks what is chosen */
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
      <BlessButton href="/news">More</BlessButton>
    </BlessSection>
  </BlessStage>
</template>
```

## Components

188 components across eight groups. Every one styles itself from `--bless-*` tokens and ships with a test and a docs page.

### Primitives

| Component                             | Purpose                                               | Key props / slots                                                                                      |
| ------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `BlessSkew`                           | Plate that leans on attention. Its slot stays upright | `as`, `color`                                                                                          |
| `BlessButton`                         | Button or anchor                                      | `variant` solid/outline/ghost, `color`, `size`, `href`, `disabled`, `loading`. `#prefix` `#suffix`     |
| `BlessBadge`                          | Small label, ink by default                           | `color`, `scaled`                                                                                      |
| `BlessDash`                           | Inline 10×1px separator                               | `color`                                                                                                |
| `BlessSeparator`                      | `<hr>` / vertical rule, optional label                | `orientation`, `decorative`, `color`, `label`                                                          |
| `BlessIcon`                           | SVG slot wrapper                                      | `size`, `label`                                                                                        |
| `BlessText`                           | Typography helper                                     | `as`, `size`, `weight`, `tracking`, `leading`, `muted`, `uppercase`                                    |
| `BlessKbd`                            | Key combo                                             | `keys[]` or slot                                                                                       |
| `BlessThemeToggle`                    | Light/dark switch or 3-way group                      | `mode` switch/group, `label`, `labels`                                                                 |
| `BlessSpinner`                        | Loading indicator (`role=status`)                     | `size`, `color`, `label`. `BlessButton loading` uses it                                                |
| `BlessEmpty`                          | Empty state                                           | `title`, `description`, `variant` outline/plain. `#icon` `#title` `#description` default=actions       |
| `BlessButtonGroup`                    | Joined buttons                                        | `orientation`, `label`                                                                                 |
| `BlessIndicator`                      | Count / dot badge on any element                      | `value` number or true, `max`, `color`, `position`                                                     |
| `BlessTimeline`                       | Vertical rail of events                               | `items[{title,time,description,color}]`. `#default="{item}"` `#dot`                                    |
| `BlessSwap`                           | Two-face toggle                                       | `v-model`, `label`, `effect` fade/rotate/flip. `#on` `#off`                                            |
| `BlessWatermarkOverlay`               | Tiled text watermark over content                     | `text`, `gap`, `angle`, `fontSize`, `opacity`, `color`                                                 |
| `BlessCircularProgress`               | Ring progress                                         | `value` (omit = spinning), `max`, `size`, `thickness`, `color`, `showValue`, `format`                  |
| `BlessLoadingBar` + `useLoadingBar()` | Top-of-page progress                                  | `height`, `position`, `color`. `start()` `stop()` `set(p)` `track(promise)`                            |
| `BlessSlideTransition`                | Height 0 ↔ auto                                       | `appear`. Wrap one `v-if` element with `transition: height`                                            |
| `BlessClientOnly`                     | Browser-only render                                   | `#fallback`                                                                                            |
| `BlessChip`                           | Compact token, removable                              | `label`, `icon`, `image`, `removable`, `color`, `size`. Emits `remove`                                 |
| `BlessTagCloud`                       | Tags sized by weight                                  | `tags` `[{label,weight,href}]`, `min`, `max`, `sort`, `label`. Emits `select`                          |
| `BlessMeterGroup`                     | Multi-segment meter                                   | `segments[{label,value,color}]`, `max`, `legend`, `format`, `orientation`                              |
| `BlessBlockUI`                        | Blocking overlay                                      | `blocked`, `fullscreen`. `#indicator`                                                                  |
| `BlessMockup`                         | Browser / window / phone frame                        | `type`, `title`, `dark`                                                                                |
| `BlessItem`                           | Media + title + description + actions                 | `title`, `description`, `href`, `button`, `variant` plain/outline/surface, `size`. `#media` `#actions` |
| `BlessAvatar`                         | Image with initials fallback                          | `src`, `name`, `size`, `lean`, `color`                                                                 |
| `BlessSkeleton`                       | Placeholder that breathes (no shimmer)                | `width`, `height`, `lines`, `avatar`                                                                   |
| `BlessAspectRatio`                    | Ratio box                                             | `ratio`                                                                                                |
| `BlessProgress`                       | Bar, determinate or not                               | `value`, `max`, `label`, `showValue`, `color`, `size`                                                  |
| `BlessAlert`                          | Inline notice                                         | `title`, `color`, `live`, `dismissible`, `v-model`. `#icon` `#title`                                   |
| `BlessBanner`                         | Page-wide announcement bar                            | `color`, `dismissible`, `persist`, `v-model`, `label`. `#action`                                       |
| `BlessCopyButton`                     | Copy text, with a Copied state                        | `value`, `variant`, `size`, `timeout`, `labels`. Emits `copy`                                          |

### Forms

| Component                          | Purpose                                                                                                 | Key props / slots                                                                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlessLabel`                       | `<label>` with required mark and hint                                                                   | `for`, `required`, `hint`                                                                                                                                                                                                        |
| `BlessInput`                       | Text-like input                                                                                         | `v-model`, `type`, `size`, `invalid`, `description`, `error`. `#prefix` `#suffix`                                                                                                                                                |
| `BlessInputGroup`                  | Shared surface: addons + any control                                                                    | `size`, `disabled`. `#prefix` `#suffix` (text or `BlessButton`), default = `BlessInput`/`BlessSelect`                                                                                                                            |
| `BlessTextarea`                    | Auto-growing textarea                                                                                   | `v-model`, `rows`, `autogrow`, `maxlength`, `counter`, `error`                                                                                                                                                                   |
| `BlessCheckbox`                    | Native checkbox                                                                                         | `v-model` (bool or array), `value`, `indeterminate`, `description`                                                                                                                                                               |
| `BlessRadioGroup` / `BlessRadio`   | Native radios                                                                                           | group `v-model`, `label`, `orientation`. Radio `value`, `description`                                                                                                                                                            |
| `BlessSwitch`                      | `role=switch` toggle                                                                                    | `v-model`, `size`, `labelPosition`                                                                                                                                                                                               |
| `BlessRating`                      | Star rating on native radios                                                                            | `v-model`, `max`, `icon`, `size`, `readonly`                                                                                                                                                                                     |
| `BlessFileInput`                   | File input + drop zone                                                                                  | `v-model` File[], `accept`, `multiple`, `hint`, `list`, `invalid`                                                                                                                                                                |
| `BlessColorPicker`                 | `<input type=color>` + swatches                                                                         | `v-model` hex, `swatches[]`, `showValue`                                                                                                                                                                                         |
| `BlessPasswordMeter`               | Strength `<meter>` from rules                                                                           | `value`, `rules[{label,test}]`, `labels`, `showRules`                                                                                                                                                                            |
| `BlessListbox`                     | `role=listbox`, keyboard + typeahead                                                                    | `v-model` (array when `multiple`), `options`, `rows`, `label`. `#default="{option, selected}"`                                                                                                                                   |
| `BlessKnob`                        | Rotary dial on `<input type=range>`                                                                     | `v-model`, `min`, `max`, `step`, `size`, `sweep`, `format`, `label`                                                                                                                                                              |
| `BlessSignaturePad`                | Canvas signature                                                                                        | `v-model` data URL, `height`, `lineWidth`, `color`, `type`. Emits `end`. Exposes `clear()` `isEmpty()`                                                                                                                           |
| `BlessEditor`                      | Rich text toolbar for Tiptap                                                                            | `editor` (from `useEditor`), `tools[]`, `minHeight`. Default slot = `<EditorContent>`. `#toolbar` `#footer`. Optional peer `@tiptap/vue-3`                                                                                       |
| `BlessRange`                       | Two-thumb range                                                                                         | `v-model` [lo, hi], `min`, `max`, `step`, `gap`, `label`, `showValue`, `format`                                                                                                                                                  |
| `BlessTimePicker`                  | `<input type=time>` + datalist                                                                          | `v-model` "HH:MM", `step` (minutes), `min`, `max`, `hour12`, `seconds`, `size`                                                                                                                                                   |
| `BlessUploader`                    | Upload queue                                                                                            | `url`, `field`, `headers`, `accept`, `multiple`, `auto`, `maxSize`. Emits `upload(item, progress, done, fail)` `done` `error`. Exposes `start()` `clear()`                                                                       |
| `BlessInputNumber`                 | Number with ± and Intl format                                                                           | `v-model` number, `min`, `max`, `step`, `buttons`, `prefix`, `suffix`, `format`, `locale`                                                                                                                                        |
| `BlessPasswordInput`               | Password + reveal + meter                                                                               | `v-model`, `meter`. Wraps `BlessInput`                                                                                                                                                                                           |
| `BlessInputTags`                   | Free-text tags                                                                                          | `v-model` string[], `separators`, `max`, `duplicates`                                                                                                                                                                            |
| `BlessFloatLabel`                  | Floating / in-field label                                                                               | `label`, `for`, `variant` over/in. Wrap a control with `placeholder=" "`                                                                                                                                                         |
| `BlessFieldset`                    | `<fieldset>` + legend                                                                                   | `legend`, `toggleable`, `v-model:collapsed`, `disabled`                                                                                                                                                                          |
| `BlessInplace`                     | Click to edit                                                                                           | `v-model:active`, `closable`. `#display` `#content="{close}"`                                                                                                                                                                    |
| `BlessCompare`                     | Before / after slider                                                                                   | `v-model` 0–100, `orientation`. `#before` `#after`                                                                                                                                                                               |
| `BlessCascadeSelect`               | Nested options, one column per level                                                                    | `v-model`, `options[{value,label,children}]`, `showPath`, `separator`, `size`. Emits `select(option, path)`                                                                                                                      |
| `BlessTreeSelect`                  | Tree in a popover                                                                                       | `v-model` id or id[], `nodes`, `multiple`, `leafOnly`, `size`. Emits `select`                                                                                                                                                    |
| `BlessInputMask`                   | Pattern-masked `BlessInput`                                                                             | `v-model` masked, `mask` (`#` digit `A` letter `*` either), `placeholder`. Emits `update:raw`                                                                                                                                    |
| `BlessCardInput`                   | Card number: groups, brand, Luhn check                                                                  | `v-model` (digits), `validate`, `labels`. Emits `brand`                                                                                                                                                                          |
| `BlessDurationInput`               | Time as `h:mm:ss` or `1h 30m`                                                                           | `v-model` (seconds), `seconds`, `min`, `max`, `labels`                                                                                                                                                                           |
| `BlessPhoneInput`                  | Country code and phone number (E.164)                                                                   | `v-model`, `v-model:country`, `countries`, `defaultCountry`, `locale`, `labels`                                                                                                                                                  |
| `BlessOrderList`                   | Reorderable list                                                                                        | `v-model` items, `rowKey`, `buttons`. Drag, ↑↓, Alt+arrows. Emits `move`. `#default="{item,index}"`                                                                                                                              |
| `BlessCountUp`                     | Number that counts up to its value, optionally as odometer reels                                        | `value`, `duration`, `locale`, `options` (Intl), `appear`, `odometer`                                                                                                                                                            |
| `BlessTimer`                       | Countdown, stopwatch or interval timer with Start / Pause / Reset                                       | `mode`, `duration`, `phases[{label,seconds}]`, `rounds`, `autostart`, `controls`, `v-model:running`. Emits `finish` `phase`. Exposes `start` `pause` `reset` `toggle`                                                            |
| `BlessGauge`                       | Read-only gauge with zones, as a half circle or a bar (role=meter)                                      | `value`, `min`, `max`, `zones[{to,color,label}]`, `variant` arc/linear, `label`, `format`                                                                                                                                        |
| `BlessGantt`                       | Schedule: task bars on a day axis with progress, dependencies and a today line. Draggable if `editable` | `v-model:tasks` `[{id,label,start,end,progress,after}]`, `editable`, `dayWidth`, `rowHeight`, `from`, `to`, `locale`, `labelWidth`, `v-model:selected`. Emits `select` `change`                                                  |
| `BlessShortcutRecorder`            | Press-to-record key combo with conflict detection                                                       | `v-model` for example `Ctrl+K`, `taken` (list or `{combo: name}`), `allowBare`, `label`, `placeholder`. Emits `conflict`                                                                                                         |
| `BlessDiff`                        | Line diff of two texts, inline or side by side, with folding                                            | `a`, `b`, `mode` inline/split, `context`, `lineNumbers`, `labelA`, `labelB`, `label`                                                                                                                                             |
| `BlessCodeBlock`                   | Code listing with copy, line marks, line numbers and file tabs. You bring the highlighter               | `code`, `lang`, `filename`, `files[{name,code,lang}]`, `v-model:active`, `lines` "2,4-6", `lineNumbers`, `copy`, `wrap`. Emits `copy`. `#code="{code,lang,lines}"`                                                               |
| `BlessMarquee`                     | Ticker with no visible loop point. Pauses on hover, focus and a button. Still under reduced motion      | `speed`, `reverse`, `pauseOnHover`, `controls`, `v-model:paused`, `label`                                                                                                                                                        |
| `BlessMasonry`                     | Variable-height cards packed into columns, in reading order                                             | `items`, `rowKey`, `columns`, `minWidth`, `gap`, `label`. `#default="{item,index}"`                                                                                                                                              |
| `BlessSplitView`                   | Master / detail: draggable divider on a wide screen, one pane at a time on a narrow screen              | `v-model` master width %, `v-model:detail` (stacked), `breakpoint`, `min`, `max`, `storageKey`, `backLabel`. Emits `back`. `#master="{open}"` `#detail`                                                                          |
| `BlessRadialMenu`                  | Round menu around the pointer: right-click, long touch (slide and release) or the menu key              | `items[{id,label,icon,disabled}]`, `v-model:open`, `radius`, `holdMs`, `disabled`, `label`. Emits `select`. Default slot is the target, `#item="{item,index}"`                                                                   |
| `BlessLoupe`                       | Magnifier lens over an image: hover, touch-drag or arrow keys                                           | `src`, `alt`, `zoomSrc`, `zoom`, `size`                                                                                                                                                                                          |
| `BlessSliderCaptcha`               | Slide the piece into the gap (a human check, not security)                                              | `v-model:verified`, `src`, `tolerance`, `label`. Emits `verify({ms})` `fail`. Exposes `reset()`. ←→ + Enter from the keyboard                                                                                                    |
| `BlessSwipeDeck`                   | Stack of cards: swipe or press to accept / reject / skip                                                | `v-model` remaining cards, `rowKey`, `label`, `controls`, `threshold`, `labels`. Emits `decide(item, decision)` `undo(item)`. `#card` `#empty`. Exposes `accept` `reject` `skip` `undo`                                          |
| `BlessHotspots`                    | Numbered pins on an image or diagram, each with a popover                                               | `v-model` spots `[{id,x,y,label}]` (percent), `v-model:active`, `src`, `alt`, `editable`, `placement`. Emits `add` `remove`. `#spot="{spot,index}"`, default slot for a diagram                                                  |
| `BlessCropper`                     | Crop and rotate an image. Exports the cropped pixels                                                    | `src`, `aspect`, `crossorigin`, `controls`, `label`. `v-model` rect `{x,y,width,height,rotation}`. `toBlob({type,quality,maxWidth})`. Emits `ready` `error`                                                                      |
| `BlessKanban`                      | Board: columns of cards, drag or keys between columns                                                   | `v-model` columns `[{id,title,items,limit}]`, `rowKey`, `label`. Emits `move(item, from, to)`. `#card="{item,column,index}"` `#header="{column}"`                                                                                |
| `BlessMention`                     | Textarea with `@` / `#` suggestions                                                                     | `v-model`, `options` (list or `{trigger: list}`), `triggers`, `limit`, `label`. Other props go to `BlessTextarea`. Emits `select(option, trigger)`                                                                               |
| `BlessHeatmapCalendar`             | Activity grid, one square per day                                                                       | `data` {iso: count}, `end`, `weeks`, `weekStart`, `levels`, `max`, `locale`, `unit`, `legend`. `v-model` picked day. Arrows move by day / week                                                                                   |
| `BlessSortable`                    | Reorder a list or grid by drag handle or keyboard                                                       | `v-model` items, `rowKey`, `label`, `columns`. Drag, Space + arrows, Esc cancels. Emits `move`. `#default="{item,index}"`                                                                                                        |
| `BlessPickList`                    | Transfer between two listboxes                                                                          | `v-model:source`, `v-model:target`, `sourceLabel`, `targetLabel`, `rows`                                                                                                                                                         |
| `BlessSelect`                      | Styled native `<select>` (picker styled too on Chrome 135+)                                             | `v-model`, `options` (groups ok), `placeholder`, `size`, `error`                                                                                                                                                                 |
| `BlessSlider`                      | Native range                                                                                            | `v-model`, `min`, `max`, `step`, `showValue`, `format`                                                                                                                                                                           |
| `BlessToggle` / `BlessToggleGroup` | Pressed buttons                                                                                         | toggle `v-model:pressed`, `value`. Group `v-model`, `type` single/multiple                                                                                                                                                       |
| `BlessCombobox`                    | Searchable select                                                                                       | `v-model`, `options`, `multiple`, `creatable` (emits `create`), `size`                                                                                                                                                           |
| `BlessTimezonePicker`              | IANA time zone search with offsets                                                                      | `v-model`, `zones`, `at`, `detect`, `placeholder`                                                                                                                                                                                |
| `BlessDatePicker`                  | Calendar in a popover                                                                                   | `v-model` ISO string or `[start,end]`, `range`, `min`, `max`, `locale`, `nativeOnTouch`                                                                                                                                          |
| `BlessCalendar`                    | Month grid                                                                                              | same as DatePicker plus `weekStart`, `disabledDates`, `month`                                                                                                                                                                    |
| `BlessInputOTP`                    | One-time code cells                                                                                     | `v-model`, `length`, `numeric`, `separators`, `masked`. Emits `complete`                                                                                                                                                         |
| `BlessForm` / `BlessField`         | Constraint-API form + field wiring                                                                      | form emits `submit(FormData)` / `invalid`. Field `label`, `required`, `description`, `error`. `#default="{ id, error, describedby }"`                                                                                            |
| `BlessNodeGraph`                   | Editable node-and-link diagram. Keyboard linking, acyclic option                                        | `v-model:nodes` `{id,x,y,label}`, `v-model:edges` `{from,to}`, `v-model:selected`, `v-model:view`, `snap`, `acyclic`, `editable`, `nodeWidth`, `nodeHeight`, `label`, `labels`. `#node`. `connect` `disconnect` `move` `remove`  |
| `BlessFormula`                     | Safe expression field: live result, exact errors, did-you-mean, variable chips                          | `v-model`, `variables` `{name,label?,value}`, `functions`, `label`, `placeholder`, `disabled`, `locale`, `labels`. `result`                                                                                                      |
| `BlessRangeCalendar`               | Month where drags add or remove days (availability). Keyboard painting, blocks summary                  | `v-model` `string[]` (YYYY-MM-DD), `month`, `weekStart`, `locale`, `min`, `max`, `disabledDates`, `label`, `labels`. `#summary`. `change`                                                                                        |
| `BlessScheduler`                   | Day/week time grid. Drag to create/move/resize, overlap lanes, keyboard, snap                           | `v-model` events `{id,title,date,start,end}` (minutes), `v-model:date`, `v-model:selected`, `view`, `weekStart`, `dayStart`, `dayEnd`, `snap`, `hourHeight`, `locale`, `editable`, `label`, `labels`. `create` `change` `remove` |

### Layout & navigation

| Component                                   | Purpose                                                                                       | Key props / slots                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlessStage`                                | Page shell, sidebar → drawer under 800px                                                      | `v-model:open`. `#sidebar` default `#footer` `#background`                                                                                                 |
| `BlessSidebarNav`                           | Vertical nav list                                                                             | `items`, `active`. Emits `select`. `#item`                                                                                                                 |
| `BlessNavigationMenu`                       | Horizontal nav with panels                                                                    | `items[{label,href,items[]}]`. Emits `select`. `#panel`                                                                                                    |
| `BlessMenubar`                              | Bar of `BlessDropdownMenu`s                                                                   | `label`                                                                                                                                                    |
| `BlessSteps`                                | Stepper                                                                                       | `steps[{label,description}]`, `v-model` index, `orientation`, `clickable`. Emits `select`                                                                  |
| `BlessTree` / `BlessTreeItem`               | Nested `<details>` tree                                                                       | `nodes[{label,id,href,icon,children,open,disabled}]`, `v-model:selected`. Emits `select` `change`                                                          |
| `BlessJsonViewer`                           | Any value as an open-and-close tree                                                           | `value`, `rootLabel`, `openDepth`, `limit`, `label`                                                                                                        |
| `BlessContainer`                            | Centerd max-width box                                                                         | `size` sm/md/lg/full, `padded`, `as`                                                                                                                       |
| `BlessStack`                                | Flex row / column                                                                             | `direction`, `gap` token, `align`, `justify`, `wrap`, `as`                                                                                                 |
| `BlessScrollTop`                            | Back-to-top button                                                                            | `threshold`, `target`, `position`, `label`                                                                                                                 |
| `BlessAffix`                                | Sticky wrapper                                                                                | `offset`, `v-model:stuck`. `#default="{stuck}"`                                                                                                            |
| `BlessToc`                                  | Table of contents with the current heading marked                                             | `items` `[{id,label,level}]`, `selector`, `label`, `rootMargin`                                                                                            |
| `BlessToolbar`                              | Start / center / end bar                                                                      | `label`, `surface`. `#start` `#center` `#end`                                                                                                              |
| `BlessPanel`                                | Titled box                                                                                    | `title`, `toggleable`, `v-model:collapsed`, `surface`. `#actions` `#footer`                                                                                |
| `BlessStepper`                              | Steps + panels                                                                                | `steps`, `v-model`, `orientation`, `labels`. `#default="{step,index,next,prev,last}"` `#actions`. Emits `finish`                                           |
| `BlessSplitButton`                          | Button + menu                                                                                 | `label`, `items`, `color`, `variant`, `size`. Emits `click` `select`                                                                                       |
| `BlessDataView`                             | List / grid + pagination                                                                      | `items`, `pageSize`, `columns`, `v-model:layout`, `rowKey`. `#default="{item,index,layout}"` `#header` `#empty`                                            |
| `BlessDeferredContent`                      | Mount on scroll into view                                                                     | `rootMargin`, `minHeight`. `#placeholder`. Emits `load`                                                                                                    |
| `BlessTreeTable`                            | Expandable rows                                                                               | `rows` (with `children`), `columns`, `rowKey`, `treeColumn`, `v-model:expanded`, `defaultExpanded`. `#cell-*` pass through                                 |
| `BlessOrgChart` / `BlessOrgChartNode`       | Node tree with connectors                                                                     | `nodes`, `v-model:selected`. `#node="{node, selected}"`. Emits `select`                                                                                    |
| `BlessBottomTabs`                           | Mobile bottom nav / dock                                                                      | `items[{label,value,icon,href,badge}]`, `v-model`, `variant` bar/dock, `inline`. Emits `select`                                                            |
| `BlessSpeedDial`                            | FAB with fan-out actions                                                                      | `actions[{label,value,icon,color}]`, `direction`, `color`, `v-model:open`, `inline`. Emits `select`                                                        |
| `BlessVirtualScroller`                      | Windowed list (fixed row height)                                                              | `items`, `itemHeight`, `height`, `overscan`, `rowKey`. Exposes `scrollTo(i)`. `#default="{item,index}"`                                                    |
| `BlessBreadcrumb`                           | Trail                                                                                         | `items[{label,href}]`, `separator`. `#item`                                                                                                                |
| `BlessPagination`                           | Page list                                                                                     | `v-model`, `total`, `siblings`, `href(page)`                                                                                                               |
| `BlessTabs`                                 | ARIA tablist                                                                                  | `tabs`, `v-model`, `activation`, `color`. `#default="{tab}"` `#tab`                                                                                        |
| `BlessSection` / `BlessWatermark`           | Titled block with a giant watermark word                                                      | `title`, `watermark`, `watermarkPosition`, `headingLevel`                                                                                                  |
| `BlessBackground`                           | Tiled texture layer                                                                           | `src`, `offset`, `mode`, `opacity`                                                                                                                         |
| `BlessCard`                                 | Flat surface                                                                                  | `label`, `labelColor`, `surface`, `bordered`, `href`. `#media` `#footer`                                                                                   |
| `BlessList` / `BlessListItem`               | Divided rows                                                                                  | item `meta`, `badge`, `href`. `#suffix`                                                                                                                    |
| `BlessCollapsible` / `BlessAccordion(Item)` | `<details>` based                                                                             | `v-model:open`, `title`, `disabled`. Accordion `type` single/multiple                                                                                      |
| `BlessScrollArea`                           | Thin scrollbar + fade                                                                         | `axis`, `fade`, `height`, `width`                                                                                                                          |
| `BlessResizable`                            | Two-pane split                                                                                | `v-model` (% of first pane), `direction`, `min`, `max`, `step`. `#a` `#b`                                                                                  |
| `BlessTable`                                | Typed table, stacks on mobile                                                                 | `columns`, `rows`, `rowKey`, `caption`, `striped`, `stack`. `#cell-<key>`                                                                                  |
| `BlessDataTable`                            | Table + sort/search/select/paginate                                                           | `columns` (+`sortable`, `hideable`), `rows`, `rowKey`, `selectable`, `searchable`, `pageSize`. `#toolbar` `#cell-<key>`                                    |
| `BlessInfiniteCanvas`                       | Pan / zoom surface. Ctrl+wheel and pinch zoom, arrows and +/− from the keyboard               | `v-model:view` `{x,y,zoom}`, `minZoom`, `maxZoom`, `grid`, `controls`, `wheelZoom`, `label`, `labels`. Exposes `fit` `centerOn` `zoomBy` `reset` `toWorld` |
| `BlessDock`                                 | Magnifying icon dock. Toolbar keys, links or buttons, badge. Off for touch and reduced motion | `items` `{id,label,icon?,href?,badge?,disabled?}`, `position`, `size`, `magnification`, `radius`, `label`. `#item`. `select`                               |

### Overlays

| Component                         | Purpose                                                                            | Key props / slots                                                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlessModal`                      | Native `<dialog>`                                                                  | `v-model`, `title`, `hash` (deep link), `size`, `dismissible`. `#footer`                                                                                                                                 |
| `BlessAlertDialog`                | Confirm dialog                                                                     | `v-model`, `title`, `description`, `confirmLabel`, `cancelLabel`, `color`, `loading`. Emits `confirm` `cancel`                                                                                           |
| `BlessSheet`                      | Side panel                                                                         | `v-model`, `side`, `title`, `size`, `handle`. `#footer`                                                                                                                                                  |
| `BlessDrawer`                     | Bottom sheet with swipe-to-close                                                   | `v-model`, `title`                                                                                                                                                                                       |
| `BlessPopover`                    | Popover API panel                                                                  | `v-model:open`, `placement`, `trigger` click/hover/manual, `modal`. `#trigger` `#default="{close}"`                                                                                                      |
| `BlessTooltip`                    | Hover/focus tip                                                                    | `text`, `placement`, `delay`. `#content`                                                                                                                                                                 |
| `BlessHoverCard`                  | Rich hover popover                                                                 | `placement`, `openDelay`, `closeDelay`. `#trigger`                                                                                                                                                       |
| `BlessDropdownMenu`               | ARIA menu                                                                          | `items` (item/checkbox/radio/separator/label/sub), `placement`, `v-model:checked`, `v-model:radios`. Emits `select`. `#trigger`                                                                          |
| `BlessContextMenu`                | Menu on right click                                                                | `items`. Wraps its slot                                                                                                                                                                                  |
| `BlessCommand`                    | ⌘K palette                                                                         | `v-model:open`, `v-model:history`, `items` (groups, keywords, shortcuts), `scopes`, `recent`, `recentLimit`, `persist`, `labels`, `inline`, `hotkey`. Emits `select`. `#footer`                          |
| `BlessGallery`                    | Thumb grid + lightbox                                                              | `items`, `v-model` index, `columns`, `loop`                                                                                                                                                              |
| `BlessConfirmPopup`               | Confirm in a popover                                                               | `message`, `title`, `confirmLabel`, `cancelLabel`, `color`, `placement`, `v-model:open`. Emits `confirm` `cancel`                                                                                        |
| `BlessDialogHost` + `useDialog()` | Programmatic modals                                                                | `open({ title, component, props, text, size, dismissible })` → Promise, `close(id, result)`                                                                                                              |
| `BlessTour`                       | Spotlight walkthrough                                                              | `steps[{target,title,text,placement}]`, `v-model:open`, `v-model:step`, `spotlight`, `labels`. Emits `finish` `skip`                                                                                     |
| `BlessToaster` + `useToast()`     | Notifications                                                                      | `position`. `toast()`, `success()`, `error()`, `warning()`, `info()`, `dismiss()`                                                                                                                        |
| `BlessSplash`                     | First-visit overlay                                                                | `once`, `duration`, `skipLabel`. Emits `done`                                                                                                                                                            |
| `BlessConfetti`                   | Confetti burst fired with `fire(from?, angle?)`. Off under reduced motion          | `count`, `colors`, `duration`, `spread`, `power`, `gravity`. `done`                                                                                                                                      |
| `BlessCoachmark`                  | Pulsing new-dot with a bubble. Remembers dismissal by id                           | `text`, `id`, `placement`, `dismissOnUse`, `v-model:dismissed`, `labels`. `dismiss`                                                                                                                      |
| `BlessOnboardingChecklist`        | Getting-started checklist: real checkboxes, progress, collapse, dismiss, persisted | `items` `{id,label,description?,action?}`, `v-model:done`, `v-model:collapsed`, `v-model:dismissed`, `title`, `persist`, `floating`, `dismissible`, `labels`. `#complete`. `select` `complete` `dismiss` |

### Conversation

| Component              | Purpose                                | Key props / slots                                                                                                            |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `BlessMessage`         | Avatar + header + content + footer row | `name`, `time`, `avatar`, `align` start/end, `compact`. `#avatar` `#header` `#footer` `#actions`                             |
| `BlessBubble`          | Message bubble                         | `variant` surface/accent/outline/plain, `align`, `collapsible`, `lines`, `reactions[]`. Emits `react`                        |
| `BlessMarker`          | Inline status / note / separator / row | `variant` status/note/separator/border, `color`, `shimmer`. `#icon`                                                          |
| `BlessAttachment`      | File / image chip                      | `name`, `description`, `src`, `href`, `state` idle/uploading/error, `progress`, `size`, `removable`. Emits `remove`          |
| `BlessMessageScroller` | Chat viewport                          | `height`, `initial`, `threshold`. Emits `reach-top` `at-bottom`. Exposes `scrollToBottom()` `scrollTo(id)` `loadHistory(fn)` |
| `BlessQuestionnaire`   | Multi-step single/multiple/freeform    | `questions[]`, `v-model` answers, `v-model:step`, `shortcuts`, `labels`. Emits `submit` `skip`                               |
| `BlessPoll`            | One-question vote with results         | `question`, `options` `[{value,label,votes}]`, `v-model`, `closed`, `labels`. Emits `vote`                                   |

### Chart

| Component        | Purpose                                                             | Key props / slots                                                                                            |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `BlessChart`     | Themed frame for any [Unovis](https://unovis.dev) chart             | `title`, `description`, `height`, `legend[]`. `#header` `#legend` `#footer`, default = chart                 |
| `BlessQrCode`    | QR SVG from a module matrix ([uqr](https://github.com/unjs/uqr))    | `matrix` boolean[][], `value`, `size`, `border`, `color`, `background`, `frame`                              |
| `BlessSparkline` | Tiny inline trend: line, bar or win/loss                            | `data`, `type`, `width`, `height`, `color`, `negativeColor`, `fill`, `dot`, `label`, `format`                |
| `BlessStat`      | KPI tile: value, change, trend                                      | `label`, `value`, `delta`, `goodWhen`, `deltaUnit`, `data`, `labels`. `#hint`                                |
| `BlessTreemap`   | Squarified treemap of a tree of sizes. Drill-down path and keyboard | `data` `{id,label,value?,children?,color?}`, `v-model:path`, `height`, `format`, `label`, `labels`. `select` |

Blessing does not bundle a chart library. `BlessChart` maps `--bless-color-chart-{1..5}`, type and dark mode onto Unovis' `--vis-*` variables, and adds a legend. Install Unovis yourself:

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

Any other SVG chart library works too. Read `var(--bless-color-chart-N)` for series colors.

### Mobile

| Component             | Purpose                    | Key props / slots                                                                                                                          |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `BlessLayout`         | App shell                  | `v-model:left` / `v-model:right`, `breakpoint`, `reveal`, `leftWidth`, `rightWidth`, `swipe`. `#header` `#footer` `#left` `#right` default |
| `BlessPullToRefresh`  | Drag down to reload        | `threshold`, `max`, `scrollTarget`. Emits `refresh(done)`. `#indicator="{ready,busy,pull}"`                                                |
| `BlessSlideItem`      | Swipe a row for actions    | `threshold`, `sticky`. `#left` `#right="{reset}"`. Emits `left(reset)` `right(reset)` `slide`                                              |
| `BlessActionSheet`    | Actions in a bottom drawer | `v-model:open`, `actions[{label,value,icon,description,danger}]`, `title`, `grid`, `cancel`. Emits `select` `cancel`                       |
| `BlessTabPanels`      | Swipeable panels           | `v-model`, `panels[]`, `swipeable`, `loop`, `threshold`. `#default="{panel,index}"`. Exposes `next()` `prev()`                             |
| `BlessInfiniteScroll` | Load more at the end       | `disabled`, `offset`, `root`, `doneText`. Emits `load(done)`. `#loading` `#done`. Exposes `reset()`                                        |

Gestures: `usePan(el, cb)` · `useSwipe(el, cb, { threshold, axis })` · `useLongPress(el, cb, { ms })` · `useTouchRepeat(el, cb, { delay, interval })`. Safe-area tokens `--bless-safe-{top,bottom,left,right}`.

### Media

| Component          | Purpose                                                                         | Key props / slots                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `BlessImg`         | Lazy image                                                                      | `src`, `alt`, `ratio`, `fit`, `loading`, `placeholder`, `srcset`, `sizes`. Default slot = caption overlay. `#error`       |
| `BlessVideo`       | Responsive embed / video                                                        | `src`, `title`, `ratio`, `native`, `poster`                                                                               |
| `BlessParallax`    | Slow-scrolling background                                                       | `src`, `height`, `speed`. `#media` default                                                                                |
| `BlessCarousel`    | Scroll-snap slider                                                              | `v-model`, `perView`, `gap`, `loop`, `autoplay`, `dots`, `arrows`                                                         |
| `BlessAudioPlayer` | Track list player                                                               | `tracks`, `v-model` index, `color`. Emits `play` `pause` `ended`                                                          |
| `BlessAnnotator`   | Draw / move / resize boxes and pins on an image. Regions as fractions. Keyboard | `v-model` regions `{id,x,y,w?,h?,label}`, `v-model:selected`, `v-model:tool`, `src`, `alt`, `editable`, `label`, `labels` |

### Composables

`useMedia(query?)` · `reducedMotion()` / `scrollBehavior(b?)` · `useHash()` · `useScrollSpy(ids | selector, { rootMargin, root })` → `{ active }` · `useAnimateOnScroll(el, { threshold, rootMargin, once })` → `{ visible }` · `useDialog()` → `{ open, close }` · gestures (see Mobile) · `useResizeObserver(el)` · `useFullscreen(el?)` · `useVisibility()` · `useScroll(el?)` · `useLoadingBar()` · `applyMask(mask, input)` / `unmask(mask, masked)` · `useTheme()` → `{ theme, isDark, set, toggle, palette, setPalette }` · `useFloating(anchor, floating, active, { placement, offset, padding, boundary, arrow })` → `{ x, y, side, arrowX, arrowY, update }` · `useToast()` · `useDataTable(rows, { rowKey, pageSize, searchKeys, server, total })` · date helpers `toISO` `fromISO` `addDays` `addMonths` `isoToday`.

### Types

`BlessNavItem`, `BlessNavMenuItem`, `BlessTab`, `BlessGalleryItem`, `BlessColumn<T>`, `BlessDataColumn<T>`, `BlessOption<T>`, `BlessTrack`, `BlessMenuItem`, `BlessCommandItem`, `BlessCrumb`, `BlessToastOptions`, `BlessTheme`, `BlessStep`, `BlessTimelineItem`, `BlessTreeNode`, `BlessPasswordRule`, `BlessBottomTab`, `BlessSpeedDialAction`, `BlessTourStep`, `BlessEditorTool`, `BlessMeterSegment`, `BlessCascadeOption`, `BlessDialogOptions`, `BlessAction`, `PanEvent`, `SwipeDirection`, `BlessUpload`, `BlessReaction`, `BlessQuestion`, `BlessQuestionChoice`, `BlessAnswers`, `Placement`, `DataTableState`.

## Blocks

Finished sections (a news list, a sign-in form, a dashboard shell) ship as source that you copy into your project. They are not a package that you import. Each section is a folder. The folder holds `index.vue`, optional `parts/`, `use<Name>.ts`, `domain.ts`, and `api.ts` with an offline mock. It imports only from `blessing-ui` and itself. Browse them under **Blocks** in the docs. The contract is in `docs/blocks/README.md`.

## Tokens

All styling reads `--bless-*` custom properties defined in `tokens.css`. Override on `:root` (or any subtree) to theme:

```css
:root {
  --bless-color-accent: #4090d0;
  --bless-lean: -6deg;
}
```

| Group              | Props                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color              | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,accent-text,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}`        |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                                   |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}` (fluid `clamp()`, 8→151px)                                                                                                                                       |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                                   |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` (4px base)                                                                                                                                                                        |
| Shape              | `--bless-lean`, `--bless-skew`, `--bless-skew-counter`, `--bless-petal`, `--bless-radius-petal` (+`-lg`), `--bless-radius`, `--bless-radius-plate` (0, override points), `--bless-border-width`, `--bless-dash-width` |
| Elevation          | `--bless-shadow-plate` (the 1px accent offset behind anything that floats), `--bless-shadow-{none,md}`                                                                                                                |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                                        |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                                                   |

### Palettes

Megumi's pink is the default accent. Five more accents exist: `data-palette="utaha" | "izumi" | "michiru" | "eriri" | "tomoya"` on `<html>`. They swap only the accent tokens. Grays and dark mode are untouched. `BlessPaletteToggle` switches them, and `useTheme().setPalette()` saves the choice.

### Dark mode

Grays invert, the accent family stays the same, and `--bless-font-weight-thin` changes from 100 to 300 (hairlines look thinner as light text on a dark background). Dark mode follows `prefers-color-scheme` by default. To force one theme, set `data-theme="dark"` or `"light"` on `<html>`. `useTheme()` saves the choice in `localStorage` (`bless-theme`) and applies the attribute. `BlessThemeToggle` is the ready-made control. Override the dark palette under `:root[data-theme="dark"]` and inside the `prefers-color-scheme: dark` block in `tokens.css`.

Durations collapse to `0s` under `prefers-reduced-motion`. Tailwind v4 users can map tokens in `@theme { --color-accent: var(--bless-color-accent); }`.

## Conventions

- Components `Bless*`, CSS classes `bless-<component>__<part>` / `--<modifier>`, no scoped styles or shadow DOM so overrides are plain CSS.
- Color/size props take token keys, never raw values.
- `v-model` for open and selected state. There is no router dependency. Call `app.provide(blessLinkKey, RouterLink)` once, and every component that renders a link uses it for in-app paths. Without it, they render a plain `<a>`.

## Development

```sh
mise install        # node 24, pnpm 12
pnpm install
pnpm dev            # docs site (VitePress) with live demos against src/ — http://localhost:5173
pnpm docs:meta      # regenerate docs/.vitepress/meta.json from the components (vue-component-meta)
pnpm docs:pages     # scaffold a docs page for any component that lacks one
pnpm e2e            # cross-browser page-error sweep + axe (needs a running docs preview on :4173)
pnpm e2e:consumer   # pack, install into e2e/consumer, strict type-check (no skipLibCheck), tree-shake size gate
pnpm test           # vitest + jsdom
pnpm typecheck      # vue-tsc
pnpm build          # dist/blessing-ui.{js,css} + index.d.ts
pnpm format         # oxfmt
```

Design principles and roadmap: [DESIGN.md](./DESIGN.md).

## Writing standard

All prose in this repository follows ASD-STE100 (Simplified Technical English), Issue 9. The official dictionary is free at asd-ste100.org. The `simple-english` plugin implements the rules. No tool can guarantee compliance, so read each text again before you commit it.

The rules cover these items:

- The README, `CHANGELOG.md`, `DESIGN.md`, and `e2e/README.md`.
- The pages in `docs/guide` and `docs/components`.
- Commit messages, pull request descriptions, and code comments.

Follow these rules:

- Procedural text: use the imperative mood. Write one instruction per sentence and 20 words at most.
- Descriptive text: use simple tenses and the active voice. Write 25 words at most per sentence and one topic per paragraph.
- Put the condition before the command: "If the build fails, read the log."
- Use "make sure that" for `check`, `verify`, `confirm`, and `ensure`. Use "configuration" for `config`, `settings`, and `options`.
- Use the modals can, will, and must. Do not use `should`, `would`, `may`, `might`, or `could`.
- Do not use contractions, semicolons, or em-dashes.
- Define a concept term at its first use. Do not define product names.
- Use American spelling.

Do not apply the rules to code, identifiers, commands, file paths, quoted errors, product names, marketing copy, or generated files. Do not rewrite a whole page for style alone. If you change a paragraph, make that paragraph comply.

The `release` workflow cuts the release notes from the `CHANGELOG.md` heading that starts with `## <version> `. Keep that prefix. Do not put an em-dash between the version and the date in new headings.

## License

Copyright © 2026 DanceInTheFake. Code and design are [MIT](LICENSE).

The name of the anime that this project takes its look from, its characters, and its artwork belong to their respective owners. This license does not cover them. Blessing UI is an independent fan project. See the [story](docs/design/story.md).

We checked component coverage against the lists of [shadcn/ui](https://ui.shadcn.com/) and [PrimeVue](https://primevue.org/). Every component is an independent implementation. The library uses nothing from either project. Both names belong to their owners.
