<script setup>
import DesignRules from "../demos/DesignRules.vue";
</script>

# Design language

Blessing UI takes the six philosophical threads of _Saenai Heroine no Sodatekata_ as its design rules. At rest a control is calm and upright. A look at it makes it lean. A choice fills it with color. A group fuses it with its neighbors. Here the threads are abstract principles. They are not tied to any character, palette, or color. The [story](./story) tells where the look came from. The [brand](./brand) shows how it is drawn.

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
| Archetype and authenticity             | **Lean on attention**   | Controls stand upright and plain at rest. When hovered, focused, or pressed, they lean −10° (`--bless-lean`, mirrored in RTL). They show their character only to the person who engages with them. A field leans while you write in it, and a group leans as one. The focus ring stays, so the lean is never the only signal. Only display type (the watermark and the mark) leans at rest. |
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

| Button    | At rest              | Hover             | Focus                   | Pressed           |
| --------- | -------------------- | ----------------- | ----------------------- | ----------------- |
| Main      | solid ink fill, bold | fades, leans −10° | leans −10°, accent ring | fills with accent |
| Secondary | ink outline          | fades, leans −10° | leans −10°, accent ring | fills with accent |

The main button stands out by weight (solid against outline), not by color.

## Shape

One shape: the upright plate with a whole, square outline, for everything from a button to an avatar. The lean carries the identity, not the corners. The teardrop lives in the [mark](./brand#mark). [Conventions](../guide/conventions#shape) shows the rule in practice.
