# Conventions

What holds across all 144 components. If a component breaks one of these, it's a bug.

## API

- **Names.** `Bless` prefix, one component per file: `BlessButton` in `src/components/BlessButton.vue`. Exports are named; there is no plugin to install and nothing global.
- **Props take token keys, never raw values.** `color="accent"`, `size="sm"`, `weight="thin"`. If you want a colour that isn't a token, add the token.
- **`v-model` for the primary state**; named models for the rest: `v-model:open` (dialogs, popovers, drawers), `v-model:step`, `v-model:selected`, `v-model:collapsed`, `v-model:left` / `:right` on the layout.
- **Events.** `update:*` for every model. `select(item, event)` on anything that lists navigable things (nav, menus, trees, lists) — call `preventDefault()` on the event if you route yourself, or [provide a router link](./install#with-a-router) and don't. Lifecycle-ish: `close`, `cancel`, `confirm`, `finish`, `submit`.
- **Slots over render props.** Recurring names: `#prefix` / `#suffix` (icons beside text), `#title`, `#media`, `#actions`, `#footer`, `#icon`, `#trigger` (the thing a popover anchors to). A slot with the same name means the same place in every component.

## CSS

- **Global CSS, namespaced by class.** No `<style scoped>`, no shadow DOM, no CSS-in-JS, no Tailwind dependency. Classes are `bless-<component>`, parts `bless-<component>__<part>`, modifiers `bless-<component>--<modifier>`.
- **Override with a plain selector** — no `:deep`, no `!important`:

  ```css
  .bless-button {
    letter-spacing: 0.2em;
  }
  ```

- **Or override tokens on a subtree** when it's about values, not rules:

  ```css
  .dense-table {
    --bless-lean: 0deg; /* no lean in a dense grid */
    --bless-space-3: 8px;
  }
  ```

- Every component's stylesheet is attached to its module; importing the component imports its CSS. `blessing-ui/style.css` is the whole set if you'd rather load once.

## Accessibility

- **Native element first.** `<button>`, `<dialog>`, `<details>`, `<select>`, `<input type=range|date|time|color|file>`, the Popover API. A wrapper only when the platform has no part for it.
- **Role and name on everything composite**: menus, listboxes, tablists, grids, trees, dialogs, switches, sliders. Every icon-only control has an `aria-label`; every field is associated with its label (`BlessField` does it for you).
- **Keyboard**: arrow keys move inside a composite (tabs, menus, trees, grids, carousels, steps — ← / → follow reading direction in RTL); `Home` / `End` jump; `Esc` closes anything that floats; `Enter` / `Space` activate. Focus ring is `2px` accent, `outline-offset: 2px`, on `:focus-visible` only.
- **Contrast**: text tokens ≥ 4.5:1 on `bg` and `surface` in both themes; fills that carry text carry it at ≥ 4.5:1 (accent, badge, info, danger). `prefers-reduced-motion` zeroes every duration.

## Care

Care overrides every other rule here — when looks and care disagree, care wins ([design language](../design/)).

- **Motion can always be interrupted.** Transitions reverse from where they are; nothing waits for an animation to finish before responding. Anything that moves on its own stops for the person: carousel autoplay pauses on hover and focus, toasts pause while pointed at or focused, the splash skips on click or `Esc`.
- **Reduced motion means instant.** Durations collapse to `0s`; scripted motion (smooth scrolls, autoplay, height animation, the splash) checks `reducedMotion()` and skips. Both helpers are exported for your own code: `reducedMotion()` is `true` when the person asked for less motion, and `scrollBehavior()` returns `"smooth"` or `"auto"` accordingly — `el.scrollTo({ top: 0, behavior: scrollBehavior() })`.
- **Contrast wins over looks.** See the contrast line under Accessibility; a palette that can't meet it changes its text token, not the rule.
- **Undo over confirm.** If an action can be reversed, do it and offer **Undo** in a [toast](/components/toaster). Keep the [confirm dialog](/components/alert-dialog) for what truly can't be taken back.

## Design rules

The six rules of the [design language](../design/), as they show in the library, then the rest of the look.

- **Lean on attention.** Plates stand upright at rest and lean to `--bless-lean` (−10°, mirrored in RTL) while hovered, focused or pressed; a field leans while you write in it; a group leans as one. The focus ring stays, so the lean is never the only signal, and under reduced motion it switches without animating. Only big display type — the watermark, the mark — leans at rest.
- **Colour means chosen.** Idle things are ink and outline; the accent appears only on what is selected, active, open, pressed or done (a checked box, the current tab, the filled part of a progress bar). The focus ring stays accent. Main buttons are solid ink and fill with the accent while pressed. `color="accent"` props remain for consumers, but the library never defaults to them at rest.
- **Fuse when grouped.** Things that belong together share one plate: a ButtonGroup is one outline and leans as one, an InputGroup is one field, a ToggleGroup is one plate too, a chosen date range is one band. Alone, each keeps its own edge.
- **Overflow, once.** Growth shows as outgrowing a frame: the watermark and the hanging headline spill past their section, a finished Progress bar runs past its track. At most one thing overflows per screen, or it stops meaning anything.
- **Write on the page.** A field is a line you write on, not a box to fill in: transparent, an underline, the accent line growing under it while you write. Reading turns into writing in place — for values people mostly read, use [Inplace](/components/inplace) rather than a separate edit form.
- **Hover fades and leans, never slides**: `opacity: var(--bless-hover-opacity)` over `var(--bless-duration-slow)`, and the plate leans to `--bless-lean` in place. Appearances fade in place; only state changes travel (a sheet slides from its edge, a switch thumb moves).
- **Nothing blurs.** A floating surface sits on `--bless-shadow-plate`, a 1px accent offset. Modals and sheets rely on the scrim.
- **Type**: thin for the voice at headline size and up, bold tracked uppercase for the UI. Body is `--bless-text-md`; nothing smaller than `2xs` (8px) and that only on badges.

## Shape

One shape: the upright plate with a whole, square outline. Buttons, tabs, tags, fields, cards, menus — and the parts that are round anywhere else (avatars, switches, chips, chat bubbles, fabs, slider thumbs, count dots) — are all square. The identity is the lean on attention, not the corners; the teardrop belongs to the [mark](../design/brand#mark).

Never: a full circle or a rounded plate from the library itself. `--bless-radius`, `--bless-radius-plate` and `--bless-petal` exist at `0` for consumers who want rounding — `--bless-petal: 8px` brings back two rounded opposite corners on the round-by-nature parts.

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
