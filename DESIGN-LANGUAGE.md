# Blessing UI — design language (proposal)

Status: **direction approved, not yet implemented.** The prototype behaviours and the leaning-flower mark are accepted; nothing here is in the library yet. Decisions still open are listed at the end.

Blessing UI takes the six philosophical threads of _Saekano_ as its design rules. At rest it is calm and upright; a control leans when you look at it, fills with colour when you choose it, and fuses with its neighbours when it belongs to a group. The threads are abstract principles here — they are not tied to any character, palette or colour.

Interactive prototype of these behaviours: [Blessing Threads](https://claude.ai/artifact/RR9MxcvFCFhRSp7C9REYLn) (private).

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

## As design rules

Each thread becomes one rule a component can show: a shape, a behaviour, or a limit on what the library will do.

| Thread                                 | Design idea                           | Concrete form                                                                                                                                                                                                                               |
| -------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Possibility and commitment             | Choosing fills; colour means chosen   | **Accent only on the committed.** Idle things are ink and outline; a chosen thing (selected, active, pressed, confirmed) fills with the accent. Where the colour is on a screen tells you what has been decided.                            |
| Archetype and authenticity             | No costume; revealed to whoever looks | **Lean on attention.** At rest, controls stand upright and plain. On hover, focus or press they lean −10°, showing their character only to the person engaging with them. The lean is a response, not decoration.                           |
| Pride and belonging                    | Armor apart, one shape together       | **Fuse when grouped.** Things that belong together share one continuous plate: button groups, an input with its add-ons, a selected date range, chips chosen together. Alone, each keeps its own edge; together, the inner edges disappear. |
| Talent and the fear of being surpassed | Outgrowing the frame                  | **Overflow.** Big type (watermarks, hanging headlines, a finished progress bar) may break out of its container on purpose. Growth shows as exceeding a boundary, not filling one.                                                           |
| Consumer becoming creator              | Reading turns into writing            | **Write on the page.** Fields look like lines you write on (an underline, a manuscript), and read-to-edit in place is a first-class pattern, not a separate component.                                                                      |
| Art and love                           | Never break the people for the work   | **Care over spectacle.** Every motion can be interrupted and reversed; destructive actions prefer undo over a confirm dialog; reduced motion means instant; contrast wins over looks. Felt rather than seen, but stated as a rule.          |

## A screen with all six at work

At rest, a screen is calm: upright plates in ink and fields you write on. Engaging with something leans it; choosing it fills it with colour; grouping fuses it with its neighbours; big type spills past its frame.

This keeps the library recognisable even as a single button inside someone else's layout — the weakness of a purely calm, upright style.

**It settles the cut vs petal question.** The base shape is the upright plate with a whole, square outline. The −10° lean moves from decoration to a behaviour and becomes the signature; corner radius no longer carries the identity.

## The mark

The mark comes from blessing software's own logo in the series: a colourful, circular five-petal flower. It is redrawn in the system's terms rather than copied — five teardrop petals, each sharp at the centre and soft outside, around an empty middle.

1. **The flower** (upright): the circle's logo, redrawn.
2. **The leaning flower** (chosen — the primary mark): the same petals with the house −10° lean, so the flower turns slightly.
3. **Ink, one chosen:** for small sizes and one-colour use — the flower in ink with one petal in the accent (colour means chosen).

The earlier mark, five skewed plates in a ring, is built from the system but no longer reads as a flower. Abstract marks (an open plate, woven threads, an overflowing B) were tried and set aside: the mark should come from blessing software's flower.

## Weighting

The threads are not equal. The series' title — raising a heroine who fits no type — puts authenticity and creation at its centre, and commitment drives its ending.

| Level                       | Thread → rule                                                                                    | Role                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Overrides all               | Art and love → care over spectacle                                                               | When rules conflict, care wins: the lean turns off under reduced motion, contrast beats looks, undo is preferred over a confirm dialog. |
| Signature (every component) | Archetype and authenticity → lean on attention; Possibility and commitment → colour means chosen | The two rules that make the library recognisable.                                                                                       |
| Core surface                | Consumer becoming creator → write on the page                                                    | Every input: underline fields and edit in place. The people using a UI library are themselves making something.                         |
| Used sparingly              | Pride and belonging → fuse when grouped; Talent → overflow                                       | Only where the structure calls for it. Overflow at most once per screen, or it turns into spectacle and breaks the top level.           |

## Buttons

"Colour means chosen" applies to main buttons too. A main button at rest is an option the page offers, not a choice the person has made; colouring it chooses for them, and the colourful call-to-action is the kind of stock costume the authenticity thread refuses.

| Button    | At rest              | Hover / focus | Pressed / confirmed |
| --------- | -------------------- | ------------- | ------------------- |
| Main      | solid ink fill, bold | leans −10°    | fills with accent   |
| Secondary | ink outline          | leans −10°    | fills with accent   |

The main button stands out by weight (solid against outline), not by colour. On any screen, the only colour is what the user has chosen.

## Build order

1. [x] Care rules: interruptible motion, reduced motion, contrast — every later rule has to respect them.
2. [x] Colour means chosen: tokens, and ink at rest across all components.
3. [x] Lean on hover and focus.
4. [x] Write on the page: fields and inplace editing.
5. [ ] Fuse when grouped: button groups, input add-ons, date ranges.
6. [ ] Overflow: headlines, watermarks, finished progress.
7. [ ] The mark: the leaning flower in the docs and README.

## Trade-offs

- **Tried and dropped: the open corner.** A gap left in each outline (closing when chosen) read as a broken border, and the cover square it needed showed as a notch inside solid buttons. Outlines stay whole.
- **Lean on attention can't be the only focus signal.** The focus ring stays for keyboard users; under reduced motion the lean switches without animating.
- **Colour means chosen is the biggest behaviour change.** Main buttons are ink until pressed, so a call to action stands out by weight rather than colour; people used to coloured call-to-action buttons may find it quiet at first.
- **Scope:** a larger rework than a shape swap — tokens, at-rest and active styles across many components, and the logo.

## Open decisions

- [x] Does "colour means chosen" apply to main buttons? **Yes** — solid ink at rest, accent when pressed (see Buttons).
- [x] Which flower to develop: **the leaning flower** is the primary mark; the ink version stays for small and one-colour use.
- [x] Which threads to weight differently? **Yes** — see Weighting.
