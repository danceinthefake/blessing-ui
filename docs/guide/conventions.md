# Conventions

- Prefix `Bless`, file `src/components/BlessButton.vue`, class prefix `bless-` with BEM-ish parts: `bless-button__inner`, `bless-button--accent`.
- Colour and size props take **token keys** (`color="accent"`, `size="sm"`), never raw values.
- `v-model` for open / selected state; named models for secondary state (`v-model:open`, `v-model:step`).
- Slots over render props. `#prefix` / `#suffix` for icons.
- No global plugin. Named exports only; tree-shakes per component.
- Light DOM, plain scoped-by-class CSS. No shadow DOM, no CSS-in-JS, no Tailwind dependency.
- Hover is `opacity .6` over `.3s`; appearances fade; no bounces. Nothing blurs — a floating thing sits on a 1px accent plate.

## Shape: cut or petal

Everything leans (`--bless-skew`, −10°). There are two corners a plate can have, and one rule for which:

|           | Shape                                                                                                          | Rule                                                               | Where                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Cut**   | sharp on all four corners                                                                                      | **If the source site had it, or it's a box or a label, it's cut.** | buttons, tabs, tags, badges, fields, pickers, steps, pagination, cards, panels, menus, popovers, tables, alerts, toasts, the watermark |
| **Petal** | only the two acute corners rounded (`--bless-radius-petal`) — soft body, sharp point, like the circle's flower | **If it's ours and round by nature, it's petal.**                  | avatars, switches, chips, chat bubbles, fabs (speed dial, scroll-top, jump), slider and range thumbs, count dots                       |

Tests for a new component: _would a user expect this to be round anywhere else?_ A face, a toggle, a removable token, a speech bubble, a thumb you drag — yes, petal. A thing you read or press — cut. When unsure, cut; petal is the exception, and the exception is what makes it read.

Never: a full circle, a fully rounded plate, or a petal on a label. `--bless-radius` and `--bless-radius-plate` exist at `0` for consumers who want to round the rest; the library itself never sets them.

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
