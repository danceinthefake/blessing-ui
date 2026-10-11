# Conventions

What holds across all 190 components. If a component breaks one of these rules, it is a bug.

## API

- **Names.** Use the `Bless` prefix and one component per file: `BlessButton` in `src/components/BlessButton.vue`. Exports are named. There is no plugin to install, and nothing is global.
- **Props take token keys, never raw values.** For example: `color="accent"`, `size="sm"`, `weight="thin"`. If you want a color that is not a token, add the token.
- **`v-model` for the primary state.** Named models cover the rest: `v-model:open` (dialogs, popovers, drawers), `v-model:step`, `v-model:selected`, `v-model:collapsed`, and `v-model:left` / `:right` on the layout.
- **Events.** `update:*` exists for every model. Anything that lists navigable things (nav, menus, trees, lists) emits `select(item, event)`. If you route yourself, call `preventDefault()` on the event. Or [provide a router link](./install#with-a-router) and do not call it. The lifecycle events are `close`, `cancel`, `confirm`, `finish`, and `submit`.
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
- **Built-in wording is replaceable.** A `labels` prop supplies the text that a component says for you, for example buttons, hints, and screen-reader announcements. The prop is a `Partial`, so you override only what you need. A message that carries numbers or names is a function of them: `:labels="{ grabbed: (i, n) => `Diambil ${i} dari ${n}` }"`.

  These components have a `labels` prop:

  - Sortable, Kanban, Timer, SliderCaptcha, Cropper, ShortcutRecorder, CodeBlock, Gantt, Calendar, InputNumber, DataTable, DataView, OrderList, PickList, Marquee, Uploader.
  - Editor (by tool key), Stepper, Tour, SwipeDeck, Questionnaire, ThemeToggle, InfiniteCanvas, NodeGraph, Treemap.

  The words that a component starts with are ordinary props with those defaults, so they need no `labels` entry. These props are `label`, `placeholder`, and `emptyText`. The empty states of DataView and SwipeDeck also take `labels.empty` (or the `#empty` slot).

  A single string has its own prop instead: `clearLabel` (DatePicker), `dotsLabel` (Carousel), `label` (LoadingBar), and `errorText` (Attachment). Functions of a name or number also have their own props: `removeLabel` (Combobox, FileInput), `pageLabel` (Pagination), and `goLabel` (Steps).

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

- **Lean on attention.** Plates stand upright at rest. While hovered, focused, or pressed, they lean to `--bless-lean` (−10°, mirrored in RTL). A field leans while you write in it. A group leans as one. The focus ring stays, so the lean is never the only signal. Under reduced motion, the lean switches without animating. Only big display type (the watermark and the mark) leans at rest.
- **Color means chosen.** Idle things are ink and outline. The accent appears on selected, active, open, pressed, or done things only. Examples are a checked box, the current tab, and the filled part of a progress bar. The focus ring stays accent. Main buttons are solid ink and fill with the accent while pressed. `color="accent"` props remain for consumers, but the library never defaults to them at rest.
- **Fuse when grouped.** Things that belong together share one plate. A ButtonGroup is one outline and leans as one. An InputGroup is one field. A ToggleGroup is one plate too. A chosen date range is one band. Each part alone keeps its own edge.
- **Overflow, once.** Growth shows as outgrowing a frame: the watermark and the hanging headline spill past their section, a finished Progress bar runs past its track. At most one thing overflows per screen, or it stops meaning anything.
- **Write on the page.** A field is a line you write on, not a box to fill in. It is transparent, with an underline, and the accent line grows under it while you write. Reading turns into writing in place. For values that people mostly read, use [Inplace](/components/inplace) instead of a separate edit form.
- **Hover fades and leans, never slides**: `opacity: var(--bless-hover-opacity)` over `var(--bless-duration-slow)`, and the plate leans to `--bless-lean` in place. Appearances fade in place. Only state changes travel (a sheet slides from its edge, a switch thumb moves).
- **Nothing blurs.** A floating surface sits on `--bless-shadow-plate`, a 1px accent offset. Modals and sheets rely on the scrim.
- **Type**: use thin for the voice at headline size and up, and bold tracked uppercase for the UI. Body is `--bless-text-md`. Nothing is smaller than `2xs` (8–9px), and `2xs` is only for small meta beside larger text: badges, counts, dates, and captions.

## Shape

One shape: the upright plate with a whole, square outline. Buttons, tabs, tags, fields, cards, and menus are square. The parts that are round anywhere else are also square: avatars, switches, chips, chat bubbles, fabs, slider thumbs, and count dots. The identity is the lean on attention, not the corners. The teardrop belongs to the [mark](../design/brand#mark).

Never use a full circle or a rounded plate from the library itself. There are three exceptions, where the circle is the function and not the look: the radio (a circle is how a radio differs from a checkbox), the knob, and the [CircularProgress](../components/circular-progress) gauge. The phone [Mockup](../components/mockup) keeps its rounded corners too. They belong to the device, not to the system. `--bless-radius`, `--bless-radius-plate`, and `--bless-petal` exist at `0` for consumers who want rounding. `--bless-petal: 8px` brings back two rounded opposite corners on the parts that are round by nature.

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
