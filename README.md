# Blessing UI

Vue 3 component library and design tokens. Grey-scale UI, one pink-red accent, skewed labels instead of rounded corners, thin oversized watermark type, opacity-fade hovers. Visual language derived from [saenai.tv](https://www.saenai.tv/) (ideas only; no assets or CSS copied).

- 20 components, tokens-only styling (`--bless-*` custom properties), no Tailwind dependency
- Native platform first: `<dialog>` for modals, `<audio>` for the player, `matchMedia` for the single 800px breakpoint
- Accessible defaults: focus rings, ARIA tablist/dialog/tables, `prefers-reduced-motion`
- ESM, tree-shakable, `vue` as the only peer dependency. ~27 KB JS / 25 KB CSS raw, ~8 KB / 4.5 KB gzip

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

| Component                     | Purpose                                        | Key props / slots                                                                                                   |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `BlessSkew`                   | Skewed container, counter-skews its slot       | `as`, `color` text/accent/danger/surface/none                                                                       |
| `BlessButton`                 | Button or anchor on `BlessSkew`                | `variant` solid/outline/ghost, `color`, `size` sm/md/lg, `href`, `disabled`, `loading`; `#prefix` `#suffix`         |
| `BlessBadge`                  | Small pill (`NEW!` default)                    | `color` badge/accent/danger/warning/success/info/text, `scaled`                                                     |
| `BlessDash`                   | 10×1px decorative separator                    | `color` text/muted/accent                                                                                           |
| `BlessIcon`                   | SVG slot wrapper, `currentColor`               | `size` token key or CSS length, `label` (omit = decorative)                                                         |
| `BlessText`                   | Typography helper                              | `as`, `size` 2xs…display, `weight`, `tracking`, `leading`, `muted`, `uppercase`                                     |
| `BlessWatermark`              | Oversized thin skewed background word          | `text`, `position` top-right/top-left/bottom-right/bottom-left                                                      |
| `BlessSection`                | Heading + watermark + body                     | `title`, `watermark` (`""` hides), `watermarkPosition`, `headingLevel`; `#title`                                    |
| `BlessStage`                  | Page shell: fixed sidebar → drawer under 800px | `v-model:open`, `menuLabel`; `#sidebar` default `#footer` `#background`                                             |
| `BlessSidebarNav`             | Vertical nav list                              | `items[{label,href,meta,badge,external}]`, `active`; emits `select`; `#item`                                        |
| `BlessBackground`             | Tiled texture layer                            | `src` (else hairline pattern), `offset`, `mode` absolute/fixed, `opacity`                                           |
| `BlessCard`                   | Flat bordered surface                          | `label`, `labelColor`, `surface`, `bordered`, `href`; `#label` `#media` `#footer`                                   |
| `BlessList` / `BlessListItem` | Divided rows, meta + dash + badge              | `divided`; item: `meta`, `badge`, `href`; `#meta` `#suffix`                                                         |
| `BlessTabs`                   | ARIA tablist with skewed tabs                  | `tabs[{value,label,disabled}]`, `v-model`, `activation` automatic/manual, `color`; `#default="{tab}"` `#tab`        |
| `BlessModal`                  | Native `<dialog>` modal                        | `v-model`, `title`, `hash` (deep link), `size` sm/md/lg/full, `dismissible`; `#title` `#footer`; emits `close`      |
| `BlessGallery`                | Thumbnail grid + lightbox                      | `items[{src,thumb,alt,caption}]`, `v-model` index (−1 closed), `columns`, `loop`; `#thumb`                          |
| `BlessTable`                  | Typed data table, stacks under 800px           | `columns: BlessColumn<T>[]`, `rows`, `rowKey`, `caption`, `striped`, `stack`; `#cell-<key>` `#cell` `#head` `#foot` |
| `BlessAudioPlayer`            | Sample player on `<audio>`                     | `tracks[{src,title,artist}]`, `v-model` index, `color`; emits `play` `pause` `ended`                                |
| `BlessSplash`                 | First-visit intro overlay                      | `once` (localStorage key), `duration` (0 = manual), `skipLabel`; `#default="{dismiss}"`; emits `done`               |

Composables: `useMedia(query?)` (reactive `matchMedia`, defaults to `(max-width: 800px)`), `useHash()` (reactive `location.hash`).

Types: `BlessNavItem`, `BlessTab`, `BlessGalleryItem`, `BlessColumn<T>`, `BlessTrack`.

## Tokens

All styling reads `--bless-*` custom properties defined in `tokens.css`. Override on `:root` (or any subtree) to theme:

```css
:root {
  --bless-color-accent: #0aa;
  --bless-skew: -6deg;
}
```

| Group              | Props                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,border,rule}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                  |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}` (fluid `clamp()`, 8→151px)                                                                               |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                  |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` (4px base)                                                                                                       |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                     |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                           |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                       |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                  |

Durations collapse to `0s` under `prefers-reduced-motion`. Tailwind v4 users can map tokens in `@theme { --color-accent: var(--bless-color-accent); }`.

## Conventions

- Components `Bless*`, CSS classes `bless-<component>__<part>` / `--<modifier>`, no scoped styles or shadow DOM so overrides are plain CSS.
- Colour/size props take token keys, never raw values.
- `v-model` for open/selected state; no router coupling (`BlessSidebarNav` emits `select`, call `preventDefault` and route yourself).

## Development

```sh
mise install        # node 24, pnpm 12
pnpm install
pnpm dev            # playground: http://localhost:5173 (and /stage.html)
pnpm test           # vitest + jsdom
pnpm typecheck      # vue-tsc
pnpm build          # dist/blessing-ui.{js,css} + index.d.ts
pnpm format         # oxfmt
```

Design principles and roadmap: [DESIGN.md](./DESIGN.md).

## License

MIT
