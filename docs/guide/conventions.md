# Conventions

- Prefix `Bless`, file `src/components/BlessButton.vue`, class prefix `bless-` with BEM-ish parts: `bless-button__inner`, `bless-button--accent`.
- Colour and size props take **token keys** (`color="accent"`, `size="sm"`), never raw values.
- `v-model` for open / selected state; named models for secondary state (`v-model:open`, `v-model:step`).
- Slots over render props. `#prefix` / `#suffix` for icons.
- No global plugin. Named exports only; tree-shakes per component.
- Light DOM, plain scoped-by-class CSS. No shadow DOM, no CSS-in-JS, no Tailwind dependency.
- Shape language is `skewX(-10deg)`; radius only on tiny badges. Hover is `opacity .6` over `.3s`; no bounces.

See [DESIGN.md](https://github.com/danceinthefake/blessing-ui/blob/main/DESIGN.md) for the roadmap and the reasoning behind each phase.
