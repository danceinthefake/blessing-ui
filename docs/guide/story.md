# Story

Blessing UI started as a question: what would it take to turn one website's look into a whole component system, without copying anything from it?

## The site

The site was [saenai.tv](https://www.saenai.tv/), the official home of the anime _Saenai Heroine no Sodatekata_. Most anime sites are loud. This one wasn't. Grey text on white, one pink-red used sparingly, section names set in a hair-thin Roboto at enormous size and pushed half off the page like a watermark. Nothing had rounded corners; labels and buttons were parallelograms, all leaning the same way. Hovers didn't move — they faded. A fixed nav sat in the left fifth of the screen and stayed there.

It read as a design system that nobody had written down. So we wrote it down.

## The name

In the story, the protagonist founds a doujin game circle and calls it **Blessing Software**. A component library is the kind of thing that circle would have shipped. The circle's logo in the series is a five-petal flower, one petal per member. Our mark is five of our own skewed plates in a ring in those five colours, drawn from the system rather than from the show — and each colour is a [palette](./palettes) you can switch the whole library to. The circle's founder sits at the centre of that ring; his colour is a palette too, though the mark keeps its empty middle. The name and the shape are nods in that direction and nothing more — see the note at the bottom.

## What was kept

Five things, and they became the [brand](./brand):

- one angle — `skewX(-10deg)`, on everything
- one accent — `#ff0054` on a scale of greys
- thin oversized type for the voice, bold tracked uppercase for the UI
- the fade on hover, never a bounce
- the hard-shadow plate: a second parallelogram offset behind

## What was added

The source is a marketing site; a library has to do more. Everything below is ours:

- **Accessibility.** Focus rings, ARIA roles on menus, dialogs, grids and tablists, `prefers-reduced-motion`, AA contrast on text. The site had none of it.
- **Dark mode.** The same greys turned over, one token swap. Thin type steps up a weight because hairlines read thinner light-on-dark.
- **Tokens.** Every value the site hard-coded became a `--bless-*` custom property, so the look can be retuned without touching a component.
- **The platform.** `<dialog>`, the Popover API, `<details>`, native form controls, `Intl` dates, scroll-snap — the browser's own parts, styled rather than rebuilt.
- **Breadth.** The site needed a nav, a list and a modal. The library has 123 components, from a button to a data table to a chat thread.

## What was not taken

No logo, artwork, background texture, CSS or JavaScript from the site is in this repository. The visual language was studied and re-derived; the assets were left where they belong. The demo data uses character names and episode titles as flavour text — that is fan colour, not content from the site.

## Note

Blessing UI is an independent project. It is not affiliated with, endorsed by, or connected to the anime, its production committee, Aniplex, A-1 Pictures, the author, or the publishers. _Saenai Heroine no Sodatekata_, its title, characters and artwork belong to their respective owners.
