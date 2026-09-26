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
  .bless-button--accent {
    letter-spacing: 0.2em;
  }
  ```

- **Or override tokens on a subtree** when it's about values, not rules:

  ```css
  .sidebar {
    --bless-color-accent: var(--bless-color-text);
  }
  ```

- Every component's stylesheet is attached to its module; importing the component imports its CSS. `blessing-ui/style.css` is the whole set if you'd rather load once.

## Accessibility

- **Native element first.** `<button>`, `<dialog>`, `<details>`, `<select>`, `<input type=range|date|time|color|file>`, the Popover API. A wrapper only when the platform has no part for it.
- **Role and name on everything composite**: menus, listboxes, tablists, grids, trees, dialogs, switches, sliders. Every icon-only control has an `aria-label`; every field is associated with its label (`BlessField` does it for you).
- **Keyboard**: arrow keys move inside a composite (tabs, menus, trees, grids, carousels, steps — ← / → follow reading direction in RTL); `Home` / `End` jump; `Esc` closes anything that floats; `Enter` / `Space` activate. Focus ring is `2px` accent, `outline-offset: 2px`, on `:focus-visible` only.
- **Contrast**: text tokens ≥ 4.5:1 on `bg` and `surface` in both themes; fills that carry text carry it at ≥ 4.5:1 (accent, badge, info, danger). `prefers-reduced-motion` zeroes every duration.

## Care

Care overrides every other rule here — when looks and care disagree, care wins ([design language](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN-LANGUAGE.md)).

- **Motion can always be interrupted.** Transitions reverse from where they are; nothing waits for an animation to finish before responding. Anything that moves on its own stops for the person: carousel autoplay pauses on hover and focus, toasts pause while pointed at or focused, the splash skips on click or `Esc`.
- **Reduced motion means instant.** Durations collapse to `0s`; scripted motion (smooth scrolls, autoplay, height animation, the splash) checks `reducedMotion()` from `composables/useMedia` and skips.
- **Contrast wins over looks.** See the contrast line under Accessibility; a palette that can't meet it changes its text token, not the rule.
- **Undo over confirm.** If an action can be reversed, do it and offer **Undo** in a [toast](/components/toaster). Keep the [confirm dialog](/components/alert-dialog) for what truly can't be taken back.

## Look

- **Colour means chosen.** Idle things are ink and outline; the accent appears only on what is selected, active, open, pressed or done (a checked box, the current tab, the filled part of a progress bar). The focus ring stays accent. Main buttons are solid ink and fill with the accent while pressed. `color="accent"` props remain for consumers, but the library never defaults to them at rest.
- **Hover fades, never moves**: `opacity: var(--bless-hover-opacity)` over `var(--bless-duration-slow)`. Appearances fade in place; only state changes move (a sheet slides from its edge, a switch thumb travels).
- **Nothing blurs.** A floating surface sits on `--bless-shadow-plate`, a 1px accent offset. Modals and sheets rely on the scrim.
- **Type**: thin for the voice, bold tracked uppercase for the UI. Body is `--bless-text-md`; nothing smaller than `2xs` (8px) and that only on badges.

## Shape: cut or petal

Plates stand upright at rest and lean to `--bless-lean` (−10°) on attention — a control while it is hovered, focused or pressed, a field while you write in it; only big display type (the watermark) leans at rest. There are two corners a plate can have, and one rule for which:

|           | Shape                                                                                                          | Rule                                                               | Where                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Cut**   | sharp on all four corners                                                                                      | **If the source site had it, or it's a box or a label, it's cut.** | buttons, tabs, tags, badges, fields, pickers, steps, pagination, cards, panels, menus, popovers, tables, alerts, toasts, the watermark |
| **Petal** | only the two acute corners rounded (`--bless-radius-petal`) — soft body, sharp point, like the circle's flower | **If it's ours and round by nature, it's petal.**                  | avatars, switches, chips, chat bubbles, fabs (speed dial, scroll-top, jump), slider and range thumbs, count dots                       |

Tests for a new component: _would a user expect this to be round anywhere else?_ A face, a toggle, a removable token, a speech bubble, a thumb you drag — yes, petal. A thing you read or press — cut. When unsure, cut; petal is the exception, and the exception is what makes it read.

Never: a full circle, a fully rounded plate, or a petal on a label. `--bless-radius` and `--bless-radius-plate` exist at `0` for consumers who want to round the rest; the library itself never sets them.

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
