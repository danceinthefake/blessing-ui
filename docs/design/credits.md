---
title: Credits
---

# Credits

Blessing UI has no runtime dependencies. It still stands on the work of many people. This page names them. It lists the site that gave the look and the libraries that we compared with. It also lists the methods of the components and the tools that build and test the library.

## The look

The visual language comes from [saenai.tv](https://www.saenai.tv/), the official site of the anime _Saenai Heroine no Sodatekata_. We wrote down its rules and drew every part again. We copied no asset, style sheet, or script. The [story](./story) tells how. The anime, its title, its characters, and its artwork belong to their respective owners. This project is not affiliated with them.

The three [motion](../guide/motion) layers come from the anime itself, made by A-1 Pictures and CloverWorks: the soft focus and drift of its calm scenes, the text boxes of the visual novel that the circle makes, and its short comedy beats. [UniqueUI](https://github.com/pras75299/uniqueui) and [Rare UI](https://github.com/swamimalode07/rare-ui) showed how much motion a component library can carry. We took no components or code from them.

The home page reads like a light novel in chapters. Between the chapters it uses two habits of TV anime: the eyecatch, which is a short title card at the break, and the next-episode preview (次回予告) at the end.

The default fonts are [Roboto](https://fonts.google.com/specimen/Roboto) by Christian Robertson and [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) by Google. The library does not bundle them. You load them yourself, as the [fonts guide](../guide/fonts) shows.

## Libraries we compared with

We checked the list of components against these projects, to find what a library of this kind must have. Each Blessing component is an independent implementation. The library uses no code from them, and their names belong to their owners.

- [shadcn/ui](https://ui.shadcn.com/): the first target list, and the shape of the chart wrapper, and the site header and footer as copy-in blocks, not components.
- [Tailwind Plus](https://tailwindcss.com/plus) (once Tailwind UI): the list of blocks that a shop and a marketing site need: checkout, product page, and landing page.
- [PrimeVue](https://primevue.org/): the second target list, for the larger data and form components.
- [Sonner](https://sonner.emilkowal.ski/), [Radix](https://www.radix-ui.com/), and [cmdk](https://cmdk.paco.me/): the behavior of the toaster, the primitives, and the command menu. We wrote small versions of these behaviors and did not wrap the libraries.

## Classifications we used

The [site types](./site-types) page compares three lists of site and app categories. We used their counts and took no text from them.

- [Similarweb](https://www.similarweb.com/) Industry Plus: 27 industries and 436 categories of websites.
- The [App Store](https://developer.apple.com/documentation/appstoreconnectapi/app-categories-and-subcategories) by Apple: the categories of apps.
- The [IAB Tech Lab Content Taxonomy](https://iabtechlab.com/standards/content-taxonomy/) 3.1: 37 top-level topics for content and ads.

## Standards

- The [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) gives the keyboard and the roles of the listbox, grid, tabs, combobox, tree, menu, dialog, and other patterns.
- The [SKU field](../components/sku-field) checks barcodes with the mod-10 check digit of [GS1](https://www.gs1.org/), the body behind EAN and UPC numbers.
- The [CSV import](../components/csv-import) reads files after [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), the common format of comma-separated values.
- The [address fields](../components/address-fields) use the country codes of [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) and the `autocomplete` tokens of the HTML standard.
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) at level AA is the bar for contrast, focus, and motion. [axe-core](https://github.com/dequelabs/axe-core) checks every page against it.
- [ASD-STE100](https://www.asd-ste100.org/) Simplified Technical English is the standard for all the text in the repository and the docs.
- The web platform does the heavy work: the Popover API, the `dialog` element, `Intl`, the Web Speech API, Web Audio, CSS logical properties, and [CSS anchor positioning](https://www.w3.org/TR/css-anchor-position-1/) (the floating panels, with anchored container queries for the arrows). [MDN Web Docs](https://developer.mozilla.org/) was the reference for all of them.

## Methods

Some components use known methods. We wrote each one again from its description.

- The flair [motion](../guide/motion) uses squash and stretch, from _The Illusion of Life_ by Frank Thomas and Ollie Johnston (1981).
- Lists that reorder slide with FLIP (First, Last, Invert, Play) by Paul Lewis (2015), through the `<TransitionGroup>` of Vue.
- The [treemap](../components/treemap) uses the squarified layout of Bruls, Huijsmans, and van Wijk (2000).
- The [search results block](../blocks/search) finds a better spelling with the edit distance of Levenshtein (1966).
- The [calendar block](../blocks/calendar) keeps each event as a wall time in its own time zone, as `DTSTART;TZID` does in [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545), the iCalendar standard. The zone rules come from the [IANA Time Zone Database](https://www.iana.org/time-zones) through `Intl`.
- The [status page block](../blocks/status) uses the incident steps (investigating, identified, monitoring, resolved) of public status pages such as [Atlassian Statuspage](https://www.atlassian.com/software/statuspage).
- The [podcast block](../blocks/podcast) reads its transcript and its chapters as [WebVTT](https://www.w3.org/TR/webvtt1/), the caption format of the W3C.
- The [study block](../blocks/study) moves cards between boxes by the Leitner system, from _So lernt man lernen_ by Sebastian Leitner (1972).
- The [find a time block](../blocks/meet) follows the group polls of [When2meet](https://www.when2meet.com/): each person paints free times, and the grid shows where they overlap.
- The [card input](../components/card-input) checks numbers with the Luhn algorithm (Hans Peter Luhn, 1954).
- The [check answers](../components/check-answers) page follows the "Check answers" pattern of the [GOV.UK Design System](https://design-system.service.gov.uk/patterns/check-answers/) by the UK Government Digital Service.
- The [map with pins](../components/map-pins) places tiles and pins with the Web Mercator projection (EPSG:3857). Its default tiles and map data come from [OpenStreetMap](https://www.openstreetmap.org/copyright) and its contributors, under the ODbL.
- The [mind map](../components/mind-map) follows the mind map that Tony Buzan made known in _Use Your Head_ (1974).
- The [control chart](../components/control-chart) follows the control chart of Walter A. Shewhart (1924), with limits at the mean ± 3 standard deviations.
- The [OEE gauge](../components/oee-gauge) uses overall equipment effectiveness, availability × performance × quality, from total productive maintenance by Seiichi Nakajima.
- The [machine board](../components/machine-board) follows the andon board of the Toyota Production System.
- The [journal entry](../components/journal-entry) follows double-entry bookkeeping, as Luca Pacioli described it in 1494: the debits and the credits must be equal.
- The [payment schedule](../components/payment-schedule) uses the standard annuity formula for loans with equal monthly payments.
- The [recurrence picker](../components/recurrence-picker) writes its rule as an RRULE of [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545), the iCalendar standard.
- The chart axes use round steps of 1, 2, 2.5, and 5, after "nice numbers" by Paul Heckbert (1990).
- The [box plot](../components/box-plot) ends its whiskers at 1.5 times the box height, as John Tukey proposed.
- The [waffle](../components/waffle) rounds its shares with the largest remainder method, so the squares always add up to 100.
- The [streamgraph](../components/streamgraph) centers its streams on a middle line, as in ThemeRiver by Havre, Hetzler, and Nowell (2000). Byron and Wattenberg (2008) named the form.
- The [Pareto](../components/pareto) chart shows the 80/20 rule that Joseph Juran named after Vilfredo Pareto.
- The [Venn](../components/venn) diagram is the form of John Venn (1880). It counts each part by inclusion and exclusion.
- The [beeswarm](../components/beeswarm) places its dots with a greedy swarm, as in the beeswarm package for R by Aron Eklund.
- The [chord diagram](../components/chord-diagram) lays out its arcs and ribbons as [d3-chord](https://github.com/d3/d3-chord) by Mike Bostock does. We wrote the method again and use no code from it.
- The [rose chart](../components/rose-chart) is the polar area diagram of Florence Nightingale (1858). The area of a wedge follows the value.

## Packages that you can add

Some components work with a package that you install. The library does not import these packages, and you install only the ones that you use.

- [Vue](https://vuejs.org/) by Evan You and the Vue team: the one required peer.
- [Tiptap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/): the engine of the [editor](../components/editor).
- [marked](https://marked.js.org/): the lexer of the [markdown](../components/markdown) component.
- [Unovis](https://unovis.dev/): the charts in the [chart](../components/chart) frame.
- [uqr](https://github.com/unjs/uqr) by the UnJS team: the encoder for the [QR code](../components/qr-code).
- [Nuxt](https://nuxt.com/): the module for Nuxt apps.

## Tools

These tools build, test, and document the library.

- [Vite](https://vite.dev/), [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts), and [TypeScript](https://www.typescriptlang.org/) with [vue-tsc](https://github.com/vuejs/language-tools).
- [VitePress](https://vitepress.dev/) for this site, [Shiki](https://shiki.style/) for the code colors (the GitHub light high-contrast theme), and [vue-component-meta](https://github.com/vuejs/language-tools) for the tables of props.
- [Vitest](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), and [jsdom](https://github.com/jsdom/jsdom) for the unit tests.
- The [Vue style guide](https://vuejs.org/style-guide/) for the order of the SFC blocks (template, script, style).
- [Playwright](https://playwright.dev/) for the checks in Chromium, Firefox, and WebKit, with [axe-core](https://github.com/dequelabs/axe-core), [pixelmatch](https://github.com/mapbox/pixelmatch), and [pngjs](https://github.com/pngjs/pngjs) for the audits and the visual diff.
- [oxfmt](https://oxc.rs/) from the Oxc project for the format of the code.
- [pnpm](https://pnpm.io/) manages the packages of the repository. The [code tabs](../components/code-tabs) also give the commands of [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), and [Bun](https://bun.sh/).

Thank you to everyone who made these projects.
