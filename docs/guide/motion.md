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

## Lists and charts

A list of items arrives one item after another, `--bless-stagger` apart. Examples are a feed, a timeline, search results, and a grid of cards. The eighth item and later share one delay, so a long list does not keep you waiting. Bars grow from their baseline, lines draw themselves, and the dots of a line land after the line passes. A chart takes `--bless-duration-draw`. In calm motion, all of these fade.

A list that you reorder, such as [OrderList](../components/order-list), does not stagger. An item that moves would replay its arrival.

## Forms and controls

A new tab panel, a new step of a [Stepper](../components/stepper), and the content of an open [Collapsible](../components/collapsible) arrive with the base layer. An error message under a field rises in quickly. A switch thumb, a check mark, and a radio dot snap into place. Progress bars and rings fill with the long soft ease over `--bless-duration-draw`.

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

To stagger your own list, add the `bless-stagger` class to its parent. To draw your own line, give the path `pathLength="1"`.

```css
.my-line {
  stroke-dasharray: 1;
  animation: bless-draw var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
```

The keyframes animate the `translate`, `scale`, `filter`, and `clip-path` properties, not `transform`. This keeps the lean, which is a transform, working during the motion.
