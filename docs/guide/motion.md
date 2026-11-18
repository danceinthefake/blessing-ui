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

A list that you reorder works differently: [DataTable](../components/data-table) rows, [Kanban](../components/kanban) cards, [Sortable](../components/sortable) and [PlayQueue](../components/play-queue) items, and [OrderList](../components/order-list) items. They stagger on the first load, and a new item rises in. When you sort, drag, or move an item with the keyboard, the items slide to their new places. A moved item does not replay its arrival. For the slide, give the component a `rowKey`, so that each item keeps its identity when it moves.

## Forms and controls

A new tab panel, a new step of a [Stepper](../components/stepper), and the content of an open [Collapsible](../components/collapsible) arrive with the base layer. An error message under a field rises in quickly. A switch thumb, a check mark, and a radio dot snap into place. Progress bars and rings fill with the long soft ease over `--bless-duration-draw`.

## Chat and AI

A [Message](../components/message) talks, so its bubble wipes up with the voice layer. So does the [TypingIndicator](../components/typing-indicator). Tool calls, reasoning, and artifact panels arrive with the base layer, and so does their content when you open it. The steps of an [AgentPlan](../components/agent-plan), the chips of [Suggestions](../components/suggestions), and the comments of a [Thread](../components/thread) stagger.

Typed text is opt-in. To type a reply out like a game text box, give [StreamingText](../components/streaming-text) a `pace` in letters a second. Screen readers wait for the full text. Under reduced motion, the text shows at once.

## What stays still

Controls, fields, layout, and text do not arrive. A button, an input, a stack, or a heading is there when the page is. They move only when you engage them: the lean on attention, the snap of a toggle, and the flair if you turn it on. Editors, canvases, calendars, and tables that you work in stay still too, so that the work never waits for the motion.

Content does arrive. Cards, panels, receipts, and articles rise in. Meters fill, bars grow, round charts open from their middle, and grids of cells fade in.

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

To stagger your own list, add the `bless-stagger` class to its parent. If the list reorders, wrap it in `<TransitionGroup appear appear-active-class="bless-appear" enter-active-class="bless-arrive" move-class="bless-move" @leave="(el, done) => done()">` instead. To draw your own line, give the path `pathLength="1"`.

```css
.my-line {
  stroke-dasharray: 1;
  animation: bless-draw var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
```

The keyframes animate the `translate`, `scale`, `filter`, and `clip-path` properties, not `transform`. This keeps the lean, which is a transform, working during the motion.
