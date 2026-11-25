---
title: Design language
---

<Eyecatch kicker="Volume 04 · design" title="Design language" num="04" :level="1" accent />

Blessing UI takes the six philosophical threads of _Saenai Heroine no Sodatekata_ as its design rules. At rest a control is calm and upright. Attention lifts it softly; a choice fills it with color; tags and nameplates carry the −10° lean; a group fuses with its neighbors. Here the threads are abstract principles. They are not tied to any character, palette, or color. The [story](./story) tells where the look came from. The [brand](./brand) shows how it is drawn.

## The six threads

The series is built on six ideas. Several characters live out each idea, and no single character owns it:

| Thread                                 | The idea in the series                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | Some callings ask you to leave the people who made you. The series refuses to call that only betrayal or only courage. |
| Archetype and authenticity             | A genre is a wardrobe of costumes. Being real is refusing to wear one, and being seen accurately by someone who looks. |
| Possibility and commitment             | A harem story lives on open doors. Growing up means finally closing them, and accepting the loss.                      |
| Consumer becoming creator              | To love a story is to receive it. To make one is to answer for it. Passion has to become craft.                        |
| Pride and belonging                    | Pride is armor, and armor keeps friends out. Belonging asks what we set down, and whether it was ever really us.       |
| Talent and the fear of being surpassed | Talent lifts the one who carries it and unsettles everyone beside it. A pupil repays a teacher by surpassing them.     |

## The rules

Each thread becomes one rule that a component shows: a behavior, a shape, or a limit on what the library will do.

| Thread                                 | Rule                    | In the library                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | **Care over spectacle** | Every motion can be interrupted. Reduced motion means instant. Destructive actions prefer undo over a confirm dialog. Contrast wins over looks. A person feels this rule more than sees it, but it is still a rule.                                                                                                                                                                         |
| Archetype and authenticity             | **Lean on attention**   | Pill controls stand upright at rest and respond with an AA-safe tone shift and soft lift (`--bless-hover-lift`) on hover without distorting their shape. The signature −10° lean (`--bless-lean`, mirrored in RTL) stays strictly on rectangular app tags, eyecatches, speaker nameplates, and grouped plates so it stays legible and distinctive. The focus ring stays, so motion is never the only signal. |
| Possibility and commitment             | **Color means chosen**  | Idle things are ink and outline. A chosen thing (selected, active, open, pressed, or done) fills with the accent. Hover never adds color. The focus ring and links keep the accent, so they stay findable. The place of the color on a screen tells you what the person decided.                                                                                                            |
| Consumer becoming creator              | **Write on the page**   | A field is a line you write on, not a box to fill in. The accent line grows under it while you write. Reading turns into writing in place, so use [Inplace](/components/inplace) instead of a separate edit form.                                                                                                                                                                           |
| Pride and belonging                    | **Fuse when grouped**   | Things that belong together share one plate. A ButtonGroup is one outline and leans as one. An InputGroup is one field. A ToggleGroup is one plate too. A chosen date range is one band. Each part alone keeps its own edge.                                                                                                                                                                |
| Talent and the fear of being surpassed | **Overflow, once**      | Growth shows as outgrowing a frame. The watermark and the hanging headline spill past their section, and a finished Progress bar runs past its track. At most one thing overflows per screen. If more things overflow, none of them means anything.                                                                                                                                         |

<Demo title="Try them — hover, press, choose, write, finish">
  <DesignRules />
  <template #code>

<<< ../demos/DesignRules.vue

  </template>
</Demo>

## Weighting

The threads are not equal. The title of the series is about raising a heroine who fits no type. This puts authenticity and creation at its center. Commitment drives its ending.

| Level                       | Rule                                   | Role                                                                                                                          |
| --------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Overrides all               | Care over spectacle                    | When rules conflict, care wins. The lean stops animating under reduced motion, contrast beats looks, and undo beats a dialog. |
| Signature (every component) | Lean on attention · Color means chosen | These two rules make the library recognizable, even as a single button inside the layout of someone else.                     |
| Core surface                | Write on the page                      | Every input. The people using a UI library are themselves making something.                                                   |
| Used sparingly              | Fuse when grouped · Overflow, once     | Use them only where the structure calls for them. Otherwise they turn into spectacle and break care over spectacle.           |

## Buttons

Color means chosen applies to the main button too. A main button at rest is an option that the page offers. It is not a choice that the person made. If you color it, you choose for the person. A colorful call-to-action is the kind of stock costume that the authenticity thread refuses.

| Button    | At rest              | Hover (≥ 4.5:1 AA)         | Focus              | Pressed           |
| --------- | -------------------- | -------------------------- | ------------------ | ----------------- |
| Main      | solid ink pill, bold | tone-shift + spring lift   | accent focus ring  | fills with accent |
| Secondary | surface outline pill | soft well fill + lift      | accent focus ring  | fills with accent |

The main button stands out by weight (solid against outline), not by color. Hover never washes out contrast with `opacity: 0.6`.

## Shape, moods, and light

Cards and panels use calm soft corners (`--bless-radius: 14px`) with borderless `surface` elevation ("Light, not lines"). Buttons, switches, chips, and soft-wash badges are clean un-skewed pills (`--bless-radius-pill`), and inputs are flat `0px`-radius manuscript underlines ("Write on the page"). The −10° lean (`--bless-lean`) stays strictly on rectangular app tags, eyecatches, and `BlessNovelBox` speaker nameplates. Three moods—sunlit porcelain **Daylight**, backlit **Golden hour**, and starry cobalt **Night**—set paper and light, paired with three typographic voices (UI sans, `--bless-font-serif`, and tabular monospace) while six character palettes supply the accent. The teardrop lives in the [mark](./brand#mark). [Conventions](../guide/conventions#shape) shows the tokens in practice.

## Motion

Motion follows the series in three layers. Most scenes of the series are calm, so the base layer is a soft rise when a part appears. The game in the story talks through text boxes, so the parts that talk to the person (a dialog, a toast, a tooltip) arrive with a snap, like a text box. The comedy beats are short breaks, so the flair layer (a pop, a shake) turns on only with `data-flair`. Care over spectacle sets the limits. Calm motion only fades, and reduced motion in the system turns all motion off. The [motion guide](../guide/motion) shows the tokens and the classes.

## The rest of this volume

<ChapterCards :items="[
  { title: 'Brand', text: 'The mark, the wordmark, and the elements that every part uses.', link: '/design/brand' },
  { title: 'Story', text: 'Where the look came from, and what we added.', link: '/design/story' },
  { title: 'Site types', text: '18 kinds of sites, and the parts that serve each kind.', link: '/design/site-types' },
  { title: 'Credits', text: 'The sources, standards, and tools that we used.', link: '/design/credits' },
]" />

<script setup>
import DesignRules from "../demos/DesignRules.vue";
</script>
