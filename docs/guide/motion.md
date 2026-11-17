# Motion

<script setup>
import MotionLayers from "../demos/MotionLayers.vue";
</script>

<p class="bless-lead">Motion in blessing-ui has three layers, like the series it comes from. Most scenes are calm and soft. The game UI shows up when the story is about the game. Comedy beats are short breaks. A calm setting gives less motion, and reduced motion in the system turns all of it off.</p>

<Demo title="The three layers, with calm and flair switches">
  <MotionLayers />
  <template #code>

<<< ../demos/MotionLayers.vue

  </template>
</Demo>

## The layers

| Layer | Where                                                         | What it does                                                                         | Tokens                                                                   |
| ----- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Base  | Every appearance: popovers, menus, banners, alerts, panels    | Rises `--bless-rise` out of a soft focus (a short blur) and settles with a long ease | `bless-enter`, `--bless-duration-enter`, `--bless-ease-soft`             |
| Voice | Parts that talk: dialogs, toasts, tours, coachmarks, tooltips | Wipes up from its bottom edge, like the text box of a visual novel                   | `bless-voice`, `--bless-duration-voice`, `--bless-ease-snap`             |
| Flair | Opt-in with `data-flair`: a choice, a toggle, a wrong value   | A chosen thing pops with squash and stretch. A wrong value shakes                    | `bless-pop`, `bless-shake`, `--bless-duration-flair`, `--bless-ease-pop` |

Hover does not change. A control fades and leans on attention, and it never bounces.

## Flair

Flair is off by default, because a pop on every click gets tiring in a form that someone uses all day. To turn it on, set `data-flair` on `<html>` or on one container, for example a reward screen or a game.

```html
<section data-flair>…</section>
```

Inside it, these pop when they become chosen: `aria-pressed`, `aria-checked`, a selected tab, and a checked checkbox or radio. A field with `aria-invalid="true"` shakes. A thing that is already chosen when the page loads pops once. To set the strength, change `--bless-flair` (`1` is full, `0` is off).

## Calm motion

For people who want less motion but not none, set `data-motion="calm"` on `<html>` or on one container. Appearances fade in 140 ms and do not travel or blur. Flair is off.

```html
<html data-motion="calm"></html>
```

## Reduced motion

If the system asks for reduced motion, every duration token is `0s`. Things appear at once, and nothing moves. The spinners still turn, but slower, so that a busy state does not look frozen.

## In your own components

The keyframes are global, so you can use them with the tokens.

```css
.my-panel {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
```

The keyframes animate the `translate`, `scale`, `filter`, and `clip-path` properties, not `transform`. This keeps the lean, which is a transform, working during the motion.
