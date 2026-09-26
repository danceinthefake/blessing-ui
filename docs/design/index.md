<script setup>
import DesignRules from "../demos/DesignRules.vue";
</script>

# Design language

Blessing UI takes the six philosophical threads of _Saenai Heroine no Sodatekata_ as its design rules. At rest it is calm and upright; a control leans when you look at it, fills with colour when you choose it, and fuses with its neighbours when it belongs to a group. The threads are abstract principles here — they are not tied to any character, palette or colour. Where the look itself came from is the [story](./story); how it is drawn is the [brand](./brand).

## The six threads

The series is built on six ideas, each lived through several characters rather than owned by one:

| Thread                                 | The idea in the series                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | Some callings ask you to leave the people who made you. The series refuses to call that only betrayal or only courage. |
| Archetype and authenticity             | A genre is a wardrobe of costumes. Being real is refusing to wear one, and being seen accurately by someone who looks. |
| Possibility and commitment             | A harem story lives on open doors. Growing up means finally closing them, and accepting the loss.                      |
| Consumer becoming creator              | To love a story is to receive it; to make one is to answer for it. Passion has to become craft.                        |
| Pride and belonging                    | Pride is armor, and armor keeps friends out. Belonging asks what we set down, and whether it was ever really us.       |
| Talent and the fear of being surpassed | Talent lifts the one who carries it and unsettles everyone beside it. A pupil repays a teacher by surpassing them.     |

## The rules

Each thread becomes one rule a component shows: a behaviour, a shape, or a limit on what the library will do.

| Thread                                 | Rule                    | In the library                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | **Care over spectacle** | Every motion can be interrupted; reduced motion means instant; destructive actions prefer undo over a confirm dialog; contrast wins over looks. Felt rather than seen, but stated as a rule.                                                                                                                                                                                |
| Archetype and authenticity             | **Lean on attention**   | Controls stand upright and plain at rest. Hovered, focused or pressed, they lean −10° (`--bless-lean`, mirrored in RTL), showing their character only to the person engaging with them; a field leans while you write in it, a group leans as one. The focus ring stays, so the lean is never the only signal. Only display type — the watermark, the mark — leans at rest. |
| Possibility and commitment             | **Colour means chosen** | Idle things are ink and outline; a chosen thing — selected, active, open, pressed, done — fills with the accent. Hover never adds colour. The focus ring and links keep the accent so they stay findable. Where the colour is on a screen tells you what has been decided.                                                                                                  |
| Consumer becoming creator              | **Write on the page**   | A field is a line you write on, not a box to fill in; the accent line grows under it while you write. Reading turns into writing in place — [Inplace](/components/inplace) rather than a separate edit form.                                                                                                                                                                |
| Pride and belonging                    | **Fuse when grouped**   | Things that belong together share one plate: a ButtonGroup is one outline and leans as one, an InputGroup is one field, a ToggleGroup is one plate too, a chosen date range is one band. Alone, each keeps its own edge.                                                                                                                                                    |
| Talent and the fear of being surpassed | **Overflow, once**      | Growth shows as outgrowing a frame: the watermark and the hanging headline spill past their section, a finished Progress bar runs past its track. At most one thing overflows per screen, or it stops meaning anything.                                                                                                                                                     |

<Demo title="Try them — hover, press, choose, write, finish">
  <DesignRules />
  <template #code>

<<< ../demos/DesignRules.vue

  </template>
</Demo>

## Weighting

The threads are not equal. The series' title — raising a heroine who fits no type — puts authenticity and creation at its centre, and commitment drives its ending.

| Level                       | Rule                                    | Role                                                                                                                      |
| --------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Overrides all               | Care over spectacle                     | When rules conflict, care wins: the lean stops animating under reduced motion, contrast beats looks, undo beats a dialog. |
| Signature (every component) | Lean on attention · Colour means chosen | The two rules that make the library recognisable, even as a single button inside someone else's layout.                   |
| Core surface                | Write on the page                       | Every input. The people using a UI library are themselves making something.                                               |
| Used sparingly              | Fuse when grouped · Overflow, once      | Only where the structure calls for it, or they turn into spectacle and break care over spectacle.                         |

## Buttons

Colour means chosen applies to the main button too. A main button at rest is an option the page offers, not a choice the person has made; colouring it chooses for them, and the colourful call-to-action is the kind of stock costume the authenticity thread refuses.

| Button    | At rest              | Hover             | Focus                   | Pressed           |
| --------- | -------------------- | ----------------- | ----------------------- | ----------------- |
| Main      | solid ink fill, bold | fades, leans −10° | leans −10°, accent ring | fills with accent |
| Secondary | ink outline          | fades, leans −10° | leans −10°, accent ring | fills with accent |

The main button stands out by weight — solid against outline — not by colour.

## Shape

One shape: the upright plate with a whole, square outline, for everything from a button to an avatar. The lean carries the identity, not the corners; the teardrop lives in the [mark](./brand#mark). The rule in practice is in [Conventions](../guide/conventions#shape).
