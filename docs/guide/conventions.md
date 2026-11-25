# Conventions

What holds across all 442 components. If a component breaks one of these rules, it is a bug.

## API

- **Names.** Use the `Bless` prefix and one component per file: `BlessButton` in `src/components/BlessButton.vue`. Exports are named. There is no plugin to install, and nothing is global.
- **Props take token keys, never raw values.** For example: `color="accent"`, `size="sm"`, `weight="thin"`. If you want a color that is not a token, add the token.
- **`v-model` for the primary state.** Named models cover the rest: `v-model:open` (dialogs, popovers, drawers), `v-model:step`, `v-model:selected`, `v-model:collapsed`, and `v-model:left` / `:right` on the layout.
- **Events.** `update:*` exists for every model. Anything that lists navigable things (nav, menus, trees, lists) emits `select(item, event)`. If you route yourself, call `preventDefault()` on the event. Or [provide a router link](./install#with-a-router) and do not call it. The lifecycle events are `close`, `cancel`, `confirm`, `finish`, and `submit`. `close` hides a panel that can open again. `dismiss` removes a notice (an alert, a banner). `finish` fires when the work of a part ends: the last step, the last digit, the end of an animation.
- **Booleans.** A boolean prop names what it turns on, never `no…`. To turn off a part that is on by default, pass `false`, for example `:addable="false"`.
- **Slots over render props.** Recurring names: `#prefix` / `#suffix` (icons beside text), `#title`, `#media`, `#actions`, `#footer`, `#icon`, `#trigger` (the thing a popover anchors to). A slot with the same name means the same place in every component.

## CSS

- **Global CSS, namespaced by class.** No `<style scoped>`, no shadow DOM, no CSS-in-JS, no Tailwind dependency. Classes are `bless-<component>`, parts `bless-<component>__<part>`, modifiers `bless-<component>--<modifier>`.
- **Override with a plain selector.** Use no `:deep` and no `!important`:

  ```css
  .bless-button {
    letter-spacing: 0.2em;
  }
  ```

- **Or override tokens on a subtree** for changes to values, not rules:

  ```css
  .dense-table {
    --bless-lean: 0deg; /* no lean in a dense grid */
    --bless-space-3: 8px;
  }
  ```

- Every component's stylesheet is attached to its module, so importing the component imports its CSS. `blessing-ui/style.css` is the whole set. Use it to load the CSS once.

## Accessibility

- **Native element first.** Use `<button>`, `<dialog>`, `<details>`, `<select>`, `<input type=range|date|time|color|file>`, and the Popover API. The platform must have no part for it before you write a wrapper.
- **Role and name on everything composite**: menus, listboxes, tablists, grids, trees, dialogs, switches, and sliders. Every icon-only control has an `aria-label`. Every field is associated with its label (`BlessField` does it for you).
- **Built-in wording is replaceable.** A `labels` prop supplies the text that a component says for you, for example buttons, hints, and screen-reader announcements. The prop is a `Partial`, so you override only what you need. A message that carries numbers or names is a function of them: `:labels="{ grabbed: (i, n) => `Diambil ${i} dari ${n}` }"`. To replace the words of many components at once, use a [label pack](./translating).

  Every component that says words of its own takes them from `labels`. This includes a single word, for example the close button of Modal (`labels.close`). It also includes a message that is a function of a name or a number, for example `labels.remove` (Combobox, FileInput) and `labels.page` (Pagination).

  The words that a component starts with are ordinary props with those defaults, so they need no `labels` entry. These props are `label`, `placeholder`, and `emptyText`. The empty states of DataView and SwipeDeck also take `labels.empty` (or the `#empty` slot).

- **Keyboard**: arrow keys move inside a composite (tabs, menus, trees, grids, carousels, steps). The ← and → keys follow the reading direction in RTL. `Home` and `End` jump to the first and last item. `Esc` closes anything that floats. `Enter` and `Space` activate. The focus ring is `2px` accent with `outline-offset: 2px`, on `:focus-visible` only.
- **Contrast**: text tokens are at least 4.5:1 on `bg` and `surface` in both themes. Fills that carry text also carry it at at least 4.5:1 (accent, badge, info, danger). `prefers-reduced-motion` sets every duration to zero.

## Care

Care overrides every other rule here. If looks and care disagree, care wins ([design language](../design/)).

- **Motion can always be interrupted.** Transitions reverse from where they are. Nothing waits for an animation to finish before it responds. Anything that moves on its own stops for the person. Carousel autoplay pauses on hover and focus. Toasts pause while the pointer or focus is on them. The splash skips on click or `Esc`.
- **Reduced motion means instant.** Durations collapse to `0s`. Scripted motion (smooth scrolls, autoplay, height animation, the splash) checks `reducedMotion()` and skips. Both helpers are exported for your own code. When the person asked for less motion, `reducedMotion()` is `true`. `scrollBehavior()` returns `"smooth"` or `"auto"` accordingly: `el.scrollTo({ top: 0, behavior: scrollBehavior() })`.
- **Contrast wins over looks.** See the contrast line under Accessibility. If a palette cannot meet it, the palette changes its text token. The rule stays.
- **Undo over confirm.** To make an action reversible, do it and offer **Undo** in a [toast](/components/toaster). Keep the [confirm dialog](/components/alert-dialog) for what a person cannot take back.

## Design rules

The six rules of the [design language](../design/), as they show in the library, then the rest of the look.

- **Signature lean, upright controls.** Pill buttons, toggles, chips, and manuscript underline inputs stand upright at rest and on hover/focus, responding with an AA-safe tone shift, soft hover fill (`--bless-color-hover`), and subtle spring lift (`--bless-hover-lift`, zeroed in reduced/calm motion). The house −10° lean (`--bless-lean`, mirrored in RTL) stays strictly on rectangular app tags, eyecatches, `BlessNovelBox` speaker nameplates, `BlessSkew`, and display watermarks.
- **Color means chosen.** Idle things are ink and outline. The accent appears on selected, active, open, pressed, or done things only. Examples are a checked box, the current tab, and the filled part of a progress bar. The focus ring stays accent. Main buttons are solid ink and fill with the accent while pressed. `color="accent"` props remain for consumers, but the library never defaults to them at rest.
- **Fuse when grouped.** Things that belong together share one plate. A ButtonGroup joins its outer edges; an InputGroup is one field; a ToggleGroup shares borders; a chosen date range is one band. Each part alone keeps its own edge.
- **Overflow, once.** Growth shows as outgrowing a frame: the watermark and the hanging headline spill past their section, a finished Progress bar runs past its track. At most one thing overflows per screen, or it stops meaning anything.
- **Write on the page.** A field is a flat `0px`-radius line you write on, not a box to fill in. It is transparent with a hairline underline, and the accent line grows under it while you write. Reading turns into writing in place—use [Inplace](/components/inplace) instead of a separate edit form.
- **AA-safe hover, never washed out.** Hover never drops contrast with `opacity: 0.6` (`--bless-hover-opacity: 1`). Interactive controls shift tone or surface well (`--bless-color-hover` / `--bless-color-surface-2`) and lift softly (`--bless-hover-lift`). Appearances follow the three [motion](./motion) layers: a soft rise for most, a text-box wipe for the parts that talk, and opt-in flair.
- **Light, not lines.** Cards and panels float borderless on sunlit porcelain (`Daylight`), amber (`Golden hour`), or starry cobalt (`Night`) paper using soft ink-tinted shadows (`--bless-shadow-sm` / `--bless-shadow-plate`), with frosted glass (`--bless-color-surface-glass`) reserved for dialogue overlays like `BlessNovelBox`.
- **Three typographic voices**: **Plus Jakarta Sans** (`--bless-font-sans`) in sentence case for UI, **Newsreader** (`--bless-font-serif`) for editorial titles, quotes, and dialogue, and tabular monospace (`--bless-font-mono`) for timestamps and metadata.

## Shape

Soft, calm geometry tuned to each element's role:

- `--bless-radius: 14px` — cards, panels, dialogs, and popovers.
- `--bless-radius-plate: 6px` — rectangular skewed plates (app tags, `BlessNovelBox` nameplates, tooltips).
- `--bless-radius-pill: 999px` — buttons, switches, chips, and soft-wash badges.
- `--bless-petal: 999px` — circular avatars, portraits, radio buttons, knobs, and progress rings.
- `0px` — manuscript underline inputs (`BlessInput`, `BlessTextarea`, `BlessSelect`, etc.).

Set all four radius tokens to `0` if you want the original sharp square plates back. The teardrop belongs to the [mark](../design/brand#mark).

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
