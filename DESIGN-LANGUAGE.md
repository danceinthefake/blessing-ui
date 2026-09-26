# Blessing UI — design language (proposal)

Status: **proposal, not adopted.** Nothing here is implemented in the library yet. Decisions still open are listed at the end.

Blessing UI takes the six philosophical threads of _Saekano_ as its design rules. At rest it is calm and upright; a control leans when you look at it, closes and takes colour when you choose it, and fuses with its neighbours when it belongs to a group. The threads are abstract principles here — they are not tied to any character, palette or colour.

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

| Thread                                 | Design idea                           | Concrete form                                                                                                                                                                                                                                                                                      |
| -------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Possibility and commitment             | Choosing closes a door                | **The open corner.** Every plate at rest has one corner left open, a small gap in its outline. When something is chosen (selected, active, pressed, submitted) the gap closes and the plate fills. Tabs, radios, toggles, menu items and steps show "chosen" as a closed shape, not only a colour. |
| Possibility and commitment             | Colour means chosen                   | **Accent only on the committed.** Idle things are ink and outline; the accent appears only on what is selected, active or confirmed. Where the colour is on a screen tells you what has been decided.                                                                                              |
| Archetype and authenticity             | No costume; revealed to whoever looks | **Lean on attention.** At rest, controls stand upright and plain. On hover, focus or press they lean −10°, showing their character only to the person engaging with them. The lean is a response, not decoration.                                                                                  |
| Pride and belonging                    | Armor apart, one shape together       | **Fuse when grouped.** Things that belong together share one continuous plate: button groups, an input with its add-ons, a selected date range, chips chosen together. Alone, each keeps its own edge; together, the inner edges disappear.                                                        |
| Talent and the fear of being surpassed | Outgrowing the frame                  | **Overflow.** Big type (watermarks, hanging headlines, a finished progress bar) may break out of its container on purpose. Growth shows as exceeding a boundary, not filling one.                                                                                                                  |
| Consumer becoming creator              | Reading turns into writing            | **Write on the page.** Fields look like lines you write on (an underline, a manuscript), and read-to-edit in place is a first-class pattern, not a separate component.                                                                                                                             |
| Art and love                           | Never break the people for the work   | **Care over spectacle.** Every motion can be interrupted and reversed; destructive actions prefer undo over a confirm dialog; reduced motion means instant; contrast wins over looks. Felt rather than seen, but stated as a rule.                                                                 |

## A screen with all six at work

At rest, a screen is calm: upright plates in ink, each with one open corner, and fields you write on. Engaging with something leans it; choosing it closes its corner and colours it; grouping fuses it with its neighbours; big type spills past its frame.

This keeps the library recognisable even as a single button inside someone else's layout — the weakness of a purely calm, upright style.

**It settles the cut vs petal question.** The base shape is the upright plate. The −10° lean moves from decoration to a behaviour, the open corner becomes the signature, and corner radius no longer carries the identity.

## Logo concepts

The mark should carry the same ideas as the components, so a logo and a button speak one language.

1. **The open plate** (lead option): a leaning parallelogram outline with one corner open and a small filled sliver inside. It is the UI's own signature, so the logo and every component share one idea.
2. **Six threads woven:** six strokes interlaced into one shape — "no idea belongs to a single character; each passes through several hands", drawn as threads passing through each other.
3. **Overflowing B:** a letterform whose stroke breaks out of its frame, for outgrowing.

## Trade-offs

- **The open corner must stay subtle** — a gap of a few pixels, drawn carefully at small sizes (checkboxes, chips) — or it reads as a rendering bug.
- **Lean on attention can't be the only focus signal.** The focus ring stays for keyboard users; under reduced motion the lean switches without animating.
- **Colour means chosen is the biggest behaviour change.** Primary buttons would be ink until pressed, so a call to action needs another way to stand out (weight, size, overflow).
- **Scope:** a larger rework than a shape swap — tokens, at-rest and active styles across many components, and the logo.

## Open decisions

- [ ] Does "colour means chosen" apply to primary buttons, or do they keep the accent at rest?
- [ ] Which logo concept to develop: open plate, six threads, or overflowing B?
- [ ] Which threads, if any, to weight differently before implementation?
