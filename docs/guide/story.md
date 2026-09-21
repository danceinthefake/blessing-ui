# Story

Blessing UI started as a question: what would it take to turn one website's look into a whole component system, without copying anything from it?

## The site

The site was [saenai.tv](https://www.saenai.tv/), the official home of the anime _Saenai Heroine no Sodatekata_. Most anime sites are loud. This one wasn't. Grey text on white, one pink-red used sparingly, section names set in a hair-thin Roboto at enormous size and pushed half off the page like a watermark. Nothing had rounded corners; labels and buttons were parallelograms, all leaning the same way. Hovers didn't move — they faded. Nothing cast a blurred shadow; things that sat on top were simply offset. A fixed nav sat in the left fifth of the screen and stayed there.

It read as a design system that nobody had written down. So we wrote it down.

## The series

Look past the site to the title it belongs to and the language goes deeper than one web page.

The series logo is set in strokes that are all parallelograms — the same lean, cut sharp at the ends. The skew isn't a web designer's flourish; it is the franchise's handwriting. Its second season is titled **♭**, _flat_ — that is where _Flat by design_ comes from. Its logo carries three colours: the pink, a yellow-orange and a green — which are, one step darker for contrast, this library's accent, `warning` and `success`. None of that was planned as homage. It was found afterwards, checking the system against its source, and it explains why the pieces fit: they were always one family.

## The name

In the story, the protagonist founds a doujin game circle and calls it **Blessing Software**. The name is, most likely, the heroine's: 恵 reads _Megumi_ and means blessing — the series never says so outright, but it is why her pink is the default here. A component library is the kind of thing that circle would have shipped. The circle's logo is a five-petal flower, one petal per member — soft bodies, one sharp point each. Our mark is five of our own skewed plates in a ring in those five colours, drawn from the system rather than from the show — and each colour is a [palette](./palettes) you can switch the whole library to. The circle's founder sits at the centre of that ring; his colour is a palette too, though the mark keeps its empty middle. The name and the shape are nods in that direction and nothing more — see the note at the bottom.

## What was kept

These became the [brand](./brand):

- one angle — `skewX(-10deg)`, on everything: buttons, tags, tabs, and the fields you type into
- one accent on a scale of greys — the heroine's pink by default
- thin oversized type for the voice, bold tracked uppercase for the UI
- the fade on hover, never a bounce; appearances fade too, nothing drifts
- the plate: whatever floats sits on a hard 1px offset in the accent, never a blur

## What was added

The source is a marketing site; a library has to do more. Everything below is ours:

- **Accessibility.** Focus rings, ARIA roles on menus, dialogs, grids and tablists, `prefers-reduced-motion`, AA contrast on text — which meant darkening the accent one step wherever it is used as text, and the alert red too. The site had none of it.
- **Dark mode.** The same greys turned over, one token swap. Thin type steps up a weight because hairlines read thinner light-on-dark.
- **Tokens.** Every value the site hard-coded became a `--bless-*` custom property, so the look can be retuned without touching a component.
- **The platform.** `<dialog>`, the Popover API, `<details>`, native form controls, `Intl` dates, scroll-snap — the browser's own parts, styled rather than rebuilt.
- **Right-to-left.** Logical properties throughout; the lean flips with the reading direction.
- **Breadth.** The site needed a nav, a list and a modal. The library has 144 components, from a button to a data table to a chat thread, and a set of copy-in [blocks](../blocks/). Coverage was checked against the component lists of [shadcn/ui](https://ui.shadcn.com/) and [PrimeVue](https://primevue.org/) so nothing obvious was missing; every component here is its own implementation, and nothing from either project is used.

## What was bent

One thing, on purpose. The site never rounded a corner, and neither does anything the site had: buttons, tags, fields, cards, menus stay cut. But a library has things the site didn't — avatars, switches, chips, chat bubbles, thumbs — and those are round everywhere else for a reason. They are **petal** here: the same leaning plate with only its two sharp tips rounded, soft body and one point, the shape of the circle's flower. Two corners, one [rule](./conventions#shape-cut-or-petal). The franchise's own film site (saenai-movie.com, 2019) went soft two years after the TV site — pill tags, underlined buttons, no skew; we went halfway, and kept the lean. The mark stays cut.

## What was not taken

No logo, artwork, background texture, CSS or JavaScript from the site or the series is in this repository. The visual language was studied and re-derived; the assets were left where they belong. The demo data uses character names and episode titles as flavour text — that is fan colour, not content from the site.

## Note

Blessing UI is an independent project. It is not affiliated with, endorsed by, or connected to the anime, its production committee, Aniplex, A-1 Pictures, the author, or the publishers. _Saenai Heroine no Sodatekata_, its title, characters and artwork belong to their respective owners.
