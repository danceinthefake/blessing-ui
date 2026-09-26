# Design language

Blessing UI takes the six philosophical threads of _Saenai Heroine no Sodatekata_ as its design rules. At rest it is calm and upright; a control leans when you look at it, fills with colour when you choose it, and fuses with its neighbours when it belongs to a group. The threads are abstract principles here — they are not tied to any character, palette or colour. Where the look itself came from is the [story](./story); how it is drawn is the [brand](./brand).

## The six threads

The series is built on six ideas, each lived through several characters rather than owned by one:

| Thread                                 | The idea in the series                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Archetype and authenticity             | A genre is a wardrobe of costumes. Being real is refusing to wear one, and being seen accurately by someone who looks. |
| Art and love                           | Some callings ask you to leave the people who made you. The series refuses to call that only betrayal or only courage. |
| Consumer becoming creator              | To love a story is to receive it; to make one is to answer for it. Passion has to become craft.                        |
| Possibility and commitment             | A harem story lives on open doors. Growing up means finally closing them, and accepting the loss.                      |
| Talent and the fear of being surpassed | Talent lifts the one who carries it and unsettles everyone beside it. A pupil repays a teacher by surpassing them.     |
| Pride and belonging                    | Pride is armor, and armor keeps friends out. Belonging asks what we set down, and whether it was ever really us.       |

## The rules

Each thread becomes one rule a component shows: a behaviour, a shape, or a limit on what the library will do.

| Thread                                 | Rule                    | In the library                                                                                                                                                                                                                     |
| -------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Archetype and authenticity             | **Lean on attention**   | Controls stand upright and plain at rest. Hovered, focused or pressed, they lean −10° (`--bless-lean`), showing their character only to the person engaging with them. The focus ring stays, so the lean is never the only signal. |
| Possibility and commitment             | **Colour means chosen** | Idle things are ink and outline; a chosen thing — selected, active, pressed, done — fills with the accent. Where the colour is on a screen tells you what has been decided.                                                        |
| Pride and belonging                    | **Fuse when grouped**   | Things that belong together share one plate: a ButtonGroup is one outline and leans as one, an InputGroup is one field, toggles that are on side by side join, a chosen date range is one band. Alone, each keeps its own edge.    |
| Talent and the fear of being surpassed | **Overflow, once**      | Growth shows as outgrowing a frame: the watermark and the hanging headline spill past their section, a finished Progress bar runs past its track. At most one thing per screen.                                                    |
| Consumer becoming creator              | **Write on the page**   | A field is a line you write on, not a box to fill in; the accent line grows under it while you write. Reading turns into writing in place — [Inplace](/components/inplace) rather than a separate edit form.                       |
| Art and love                           | **Care over spectacle** | Every motion can be interrupted; reduced motion means instant; destructive actions prefer undo over a confirm dialog; contrast wins over looks. Felt rather than seen, but stated as a rule.                                       |

## Weighting

The threads are not equal. The series' title — raising a heroine who fits no type — puts authenticity and creation at its centre, and commitment drives its ending.

| Level                       | Rule                                    | Role                                                                                                                      |
| --------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Overrides all               | Care over spectacle                     | When rules conflict, care wins: the lean stops animating under reduced motion, contrast beats looks, undo beats a dialog. |
| Signature (every component) | Lean on attention · Colour means chosen | The two rules that make the library recognisable, even as a single button inside someone else's layout.                   |
| Core surface                | Write on the page                       | Every input. The people using a UI library are themselves making something.                                               |
| Used sparingly              | Fuse when grouped · Overflow, once      | Only where the structure calls for it, or they turn into spectacle and break the top level.                               |

## Buttons

Colour means chosen applies to the main button too. A main button at rest is an option the page offers, not a choice the person has made; colouring it chooses for them, and the colourful call-to-action is the kind of stock costume the authenticity thread refuses.

| Button    | At rest              | Hover / focus | Pressed           |
| --------- | -------------------- | ------------- | ----------------- |
| Main      | solid ink fill, bold | leans −10°    | fills with accent |
| Secondary | ink outline          | leans −10°    | fills with accent |

The main button stands out by weight — solid against outline — not by colour.

## Shape

One shape: the upright plate with a whole, square outline, for everything from a button to an avatar. The lean carries the identity, not the corners; the teardrop lives in the [mark](./brand#mark). The rule in practice is in [Conventions](../guide/conventions#shape).
