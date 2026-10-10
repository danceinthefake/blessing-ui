# Blessing UI — design language

Status: **implemented.** All seven build steps below are in the library (September 2026). Decisions still open are listed at the end.

Blessing UI takes the six philosophical threads of _Saekano_ as its design rules. At rest a control is calm and upright. A look at it makes it lean. A choice fills it with color. A group fuses it with its neighbors. Here the threads are abstract principles. They are not tied to any character, palette, or color.

The user-facing version is the [Design language](https://danceinthefake.github.io/blessing-ui/design/) page of the docs. This file keeps the build record.

## The six threads

The series is built on six ideas, each lived through several characters rather than owned by one:

| Thread                                 | The idea in the series                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | Some callings ask you to leave the people who made you. The series refuses to call that only betrayal or only courage. |
| Archetype and authenticity             | A genre is a wardrobe of costumes. Being real is refusing to wear one, and being seen accurately by someone who looks. |
| Possibility and commitment             | A harem story lives on open doors. Growing up means finally closing them, and accepting the loss.                      |
| Consumer becoming creator              | To love a story is to receive it. To make one is to answer for it. Passion has to become craft.                        |
| Pride and belonging                    | Pride is armor, and armor keeps friends out. Belonging asks what we set down, and whether it was ever really us.       |
| Talent and the fear of being surpassed | Talent lifts the one who carries it and unsettles everyone beside it. A pupil repays a teacher by surpassing them.     |

## As design rules

Each thread becomes one rule a component can show: a shape, a behavior, or a limit on what the library will do.

| Thread                                 | Design idea                            | Concrete form                                                                                                                                                                                                                                                                   |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Art and love                           | Never break the people for the work    | **Care over spectacle.** Every motion can be interrupted and reversed. Destructive actions prefer undo over a confirm dialog. Reduced motion means instant. Contrast wins over looks. A person feels this rule more than sees it, but it is still a rule.                       |
| Archetype and authenticity             | No costume, revealed to whoever looks  | **Lean on attention.** At rest, controls stand upright and plain. On hover, focus, or press they lean −10°. They show their character only to the person who engages with them. The lean is a response, not decoration.                                                         |
| Possibility and commitment             | Choosing fills, and color means chosen | **Accent only on the committed.** Idle things are ink and outline. A chosen thing (selected, active, pressed, confirmed) fills with the accent. The place of the color on a screen tells you what the person decided.                                                           |
| Consumer becoming creator              | Reading turns into writing             | **Write on the page.** Fields look like lines you write on (an underline, a manuscript). Editing in place is a first-class pattern, not a separate component.                                                                                                                   |
| Pride and belonging                    | Armor apart, one shape together        | **Fuse when grouped.** Things that belong together share one continuous plate: button groups, an input with its add-ons, a selected date range, and chips chosen together. Each part alone keeps its own edge. Together, the inner edges disappear.                             |
| Talent and the fear of being surpassed | Outgrowing the frame                   | **Overflow.** Big type (watermarks, hanging headlines, a finished progress bar) can break out of its container on purpose. Growth shows as exceeding a boundary, not filling one. At most one thing overflows per screen. If more things overflow, none of them means anything. |

## A screen with all six at work

At rest, a screen is calm: upright plates in ink and fields you write on. Engaging with something leans it. Choosing it fills it with color. Grouping it fuses it with its neighbors. Big type spills past its frame.

This keeps the library recognizable, even as a single button inside the layout of someone else. A purely calm, upright style does not have this strength.

**It settles the cut vs petal question.** The base shape is the upright plate with a whole, square outline. The −10° lean moves from decoration to a behavior and becomes the signature. Corner radius no longer carries the identity.

## The mark

The mark comes from the logo of the circle Blessing Software in the series: a colorful, circular five-petal flower. We redrew it in the terms of the system and did not copy it. It has five teardrop petals around an empty middle. Each petal is sharp at the center and soft outside.

1. **The flower** (upright): the circle's logo, redrawn.
2. **The leaning flower** (chosen, the primary mark): the same petals with the house −10° lean, so the flower turns slightly.
3. **Ink, one chosen:** for small sizes and one-color use. It is the flower in ink with one petal in the accent (color means chosen).

The earlier mark was five skewed plates in a ring. The system builds it, but it no longer reads as a flower. We tried abstract marks (an open plate, woven threads, an overflowing B) and set them aside. The mark must come from the flower of Blessing Software.

## Weighting

The threads are not equal. The title of the series is about raising a heroine who fits no type. This puts authenticity and creation at its center. Commitment drives its ending.

| Level                       | Thread → rule                                                                                   | Role                                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overrides all               | Art and love → care over spectacle                                                              | When rules conflict, care wins. The lean turns off under reduced motion, contrast beats looks, and undo is preferred over a confirm dialog.                 |
| Signature (every component) | Archetype and authenticity → lean on attention. Possibility and commitment → color means chosen | These two rules make the library recognizable.                                                                                                              |
| Core surface                | Consumer becoming creator → write on the page                                                   | Every input: underline fields and edit in place. The people who use a UI library make something themselves.                                                 |
| Used sparingly              | Pride and belonging → fuse when grouped. Talent → overflow                                      | Use them only where the structure calls for them. Allow overflow at most once per screen. Otherwise it turns into spectacle and breaks care over spectacle. |

## Buttons

"Color means chosen" applies to main buttons too. A main button at rest is an option that the page offers. It is not a choice that the person made. If you color it, you choose for the person. A colorful call-to-action is the kind of stock costume that the authenticity thread refuses.

| Button    | At rest              | Hover             | Focus                   | Pressed / confirmed |
| --------- | -------------------- | ----------------- | ----------------------- | ------------------- |
| Main      | solid ink fill, bold | fades, leans −10° | leans −10°, accent ring | fills with accent   |
| Secondary | ink outline          | fades, leans −10° | leans −10°, accent ring | fills with accent   |

The main button stands out by weight (solid against outline), not by color. On any screen, the only color is what the user chose.

## Build order

1. [x] Care rules: interruptible motion, reduced motion, and contrast. Every later rule must respect them.
2. [x] Color means chosen: tokens, and ink at rest across all components.
3. [x] Lean on hover and focus.
4. [x] Write on the page: fields and inplace editing.
5. [x] Fuse when grouped: button groups, input add-ons, date ranges.
6. [x] Overflow: headlines, watermarks, finished progress.
7. [x] The mark: the leaning flower in the docs and README.

## Trade-offs

- **Tried and dropped: the open corner.** A gap in each outline (closing when chosen) read as a broken border. The cover square that it needed showed as a notch inside solid buttons. Outlines stay whole.
- **Lean on attention cannot be the only focus signal.** The focus ring stays for keyboard users. Under reduced motion the lean switches without animating.
- **Color means chosen is the biggest behavior change.** Main buttons are ink until pressed, so a call to action stands out by weight, not by color. People who are used to colored call-to-action buttons can find it quiet at first.
- **Scope:** a larger rework than a shape swap. It covers tokens, at-rest and active styles across many components, and the logo.

## Open decisions

- [x] Does "color means chosen" apply to main buttons? **Yes.** Main buttons are solid ink at rest and take the accent when pressed (see Buttons).
- [x] Which flower to develop? **The leaning flower** is the primary mark. The ink version stays for small and one-color use.
- [x] Which threads to weight differently? **Yes.** See Weighting.
