# Story

Blessing UI started as a question. What does it take to turn the look of one website into a whole component system, without copying anything from it?

## The site

The site was [saenai.tv](https://www.saenai.tv/), the official home of the anime _Saenai Heroine no Sodatekata_. Most anime sites are loud. This one was not. It used gray text on white and one pink-red color, used sparingly. Section names were set in a hair-thin Roboto at enormous size, pushed half off the page like a watermark. Nothing had rounded corners. Labels and buttons were parallelograms, and all of them leaned the same way. Hovers did not move. They faded. Nothing cast a blurred shadow, and things that sat on top were only offset. A fixed nav sat in the left fifth of the screen and stayed there.

It read as a design system that nobody had written down. So we wrote it down.

## The series

The title that the site belongs to goes deeper than one web page.

The series logo is set in strokes that are all parallelograms. They have the same lean and sharp ends. The skew is not a flourish of a web designer. It is the handwriting of the franchise. The second season is titled **♭**, _flat_, and this is where _Flat by design_ comes from. Its logo carries three colors: the pink, a yellow-orange, and a green. One step darker for contrast, these are the accent, `warning`, and `success` of this library. We did not plan this as homage. We found it afterwards, during a check of the system against its source. It explains why the pieces fit: they were always one family.

## The name

In the story, the protagonist founds a doujin game circle and calls it **Blessing Software**. The name most likely belongs to the heroine. The character 恵 reads _Megumi_ and means blessing. The series never says this outright, but it is why her pink is the default here. A component library is the kind of product that the circle can make.

The logo of the circle is a five-petal flower, with one petal for each member. The bodies are soft, and each has one sharp point. Our mark is that flower, redrawn in the terms of the system. It has five teardrop petals at the house lean, in the colors of the five members. Each color is a [palette](../guide/palettes) that you can switch the whole library to. The founder of the circle sits at the center of the flower. His color is a palette too, but the mark keeps its empty middle. The name and the shape are nods in that direction and nothing more. See the note at the bottom.

## What was kept

These items became the [brand](./brand):

- One angle: −10° (`--bless-lean`). It now responds to attention. Buttons, tags, tabs, and the fields you type into lean on hover, focus, or press. Only big type leans at rest.
- One accent on a scale of grays. The pink of the heroine is the default.
- Thin oversized type for the voice, and bold tracked uppercase for the UI.
- A fade on hover, never a bounce. Appearances fade too, and nothing drifts.
- The plate: whatever floats sits on a hard 1px offset in the accent, never a blur.

## What was added

The source is a marketing site, and a library has to do more. Everything below is ours:

- **Accessibility.** Focus rings, ARIA roles on menus, dialogs, grids, and tablists, `prefers-reduced-motion`, and AA contrast. For contrast, we darkened the accent one step wherever it is text. We deepened its fills so that white text on them reaches 4.5:1. We lightened it for text in dark mode. We did the same for the alert red. The site had none of this.
- **A design language.** The six threads of the series became six rules: lean on attention, color means chosen, write on the page, fuse when grouped, overflow once, and care over spectacle. See the [design language](./). This is the biggest departure from the site. Its pink sat on things at rest. Here the accent appears only on what someone chose.
- **Dark mode.** The same grays turn over, with one token swap. Thin type steps up one weight, because hairlines look thinner as light text on a dark background.
- **Tokens.** Every value that the site hard-coded became a `--bless-*` custom property. You can retune the look without a change to a component.
- **The platform.** `<dialog>`, the Popover API, `<details>`, native form controls, `Intl` dates, and scroll-snap. These are the parts of the browser itself, styled and not rebuilt.
- **Right-to-left.** Logical properties throughout. The lean flips with the reading direction.
- **Breadth.** The site needed a nav, a list, and a modal. The library has 192 components, from a button to a data table to a chat thread. It also has a set of copy-in [blocks](../blocks/). We checked coverage against the component lists of [shadcn/ui](https://ui.shadcn.com/) and [PrimeVue](https://primevue.org/), so that nothing obvious is missing. Every component here is its own implementation. The library uses nothing from either project.

## What was bent

We bent one thing on purpose: the lean. On the site, every plate leaned all the time. Here, plates stand upright at rest. They lean only on hover, focus, or press. A character is shown to whoever looks. It is not a costume that everyone wears. Hover still fades, and now it also leans.

The corners stayed square, also on the parts that are round everywhere else (avatars, switches, chips, chat bubbles, thumbs). For a while those parts were a **petal**, a leaning plate with two rounded tips. Upright at rest, it read as a leaf, so the teardrop moved to the mark.

The film site of the franchise (saenai-movie.com, 2019) went soft two years after the TV site. It has pill tags, underlined buttons, and no skew. We kept the square and made the lean a response.

## What was not taken

This repository contains no logo, artwork, background texture, CSS, or JavaScript from the site or the series. We studied the visual language and derived it again. We left the assets where they belong. Sample data in the docs uses character names and episode titles as flavor text. That is fan color, not content from the site.

## Note

Blessing UI is an independent project. It is not affiliated with, endorsed by, or connected to the anime, its production committee, Aniplex, A-1 Pictures, the author, or the publishers. _Saenai Heroine no Sodatekata_, its title, characters, and artwork belong to their respective owners.
