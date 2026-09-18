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

| Group | Props | Notes |
|---|---|---|
| Colour | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,border,rule}` | semantic names |
| Font | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}` | Roboto + Noto Sans JP |
| Type scale | `--bless-text-{2xs,xs,sm,md,lg,xl,display}` | `clamp()` 8→151px |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}` | |
| Space | `--bless-space-{1,2,3,4,6,8,12,16}` | 4px base |
| Shape | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width` | |
| Elevation | `--bless-shadow-{none,md}` | modal only |
| Motion | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale` | |
| Layout | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}` | |

Dark theme: not planned. Add by redefining colour props under `[data-theme="dark"]` when needed.

## 3. Component roadmap

Order = build order. Each row: saenai.tv origin → generic component.

### Phase 1 — primitives
- [ ] `BlessSkew` — skewed container (`skewX`), counter-skews slot text. Base for label/button/tab. Props: `as`, `color` (`text|accent|danger|surface`).
- [ ] `BlessButton` — `BlessSkew` + `<button>`/`<a>`. Props: `variant` (`solid|outline|ghost`), `color`, `size` (`sm|md|lg`), `href`, `disabled`, `loading`. Hover opacity, focus ring.
- [ ] `BlessBadge` — `NEW!` pill. Props: `color`, `text`. `scale(.8)`, radius-sm.
- [ ] `BlessDash` — 10×1px separator pseudo (date ― badge). Inline.
- [ ] `BlessIcon` — slot-based SVG wrapper, `size`, `currentColor`.
- [ ] `BlessText` — typographic helper. Props: `size` (token key), `weight`, `muted`, `tracking`.

### Phase 2 — layout
- [ ] `BlessWatermark` — oversized thin skewed background word (`"News"`). Props: `text`, `position` (`top-right` default). `aria-hidden`.
- [ ] `BlessSection` — heading + optional `BlessWatermark` + slot.
- [ ] `BlessStage` — page shell: fixed sidebar (22% / 200px inner) + content (`max 1300px`); collapses to drawer ≤800px. Slots: `sidebar`, `default`, `footer`.
- [ ] `BlessSidebarNav` — vertical nav list. Props: `items[{label,to,badge}]`, `active`. Emits `select`.
- [ ] `BlessDrawer` — mobile off-canvas; `v-model`, focus trap, `Esc` closes, `aria-modal`.
- [ ] `BlessBackground` — tiled texture layer, `z:-1`, `offset` variants.

### Phase 3 — content
- [ ] `BlessCard` — flat surface, no radius, optional skew header.
- [ ] `BlessList` / `BlessListItem` — date + dash + badge + title row (news pattern).
- [ ] `BlessTabs` — skewed tab labels; `v-model`, roving tabindex, `role=tablist`.
- [ ] `BlessModal` — hash-routable (`?modal=id` or `#id`), shadow-md, `Esc`, focus return. Replaces saenai character modal.
- [ ] `BlessGallery` — lightbox with prev/next (fancyBox replacement). `BlessModal` + keyboard nav.
- [ ] `BlessTable` — station/credits table (onair, staff-cast). Responsive: stacked rows ≤800px.

### Phase 4 — media (optional, defer)
- [ ] `BlessAudioPlayer` — sample player (Aniplex sound player analogue). Native `<audio>` + skewed controls.
- [ ] `BlessSplash` — first-visit intro overlay, `localStorage` flag, reduced-motion skips.

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

- Tailwind preset, dark mode, RTL, SSR-specific code, icon set, form controls (input/select) — not in saenai.tv, not needed for v0.x.
- Copying saenai.tv assets (logo, art, `main_bg.png`) or CSS/JS.

## 7. Open questions

- Package as single `style.css` bundle or per-component CSS? (lean: single, Vite lib mode emits it)
- Router coupling for `BlessSidebarNav` `to` — plain `href` + `@select`, let consumer wire router. Decide at Phase 2.
