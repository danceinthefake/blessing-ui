---
title: Credits
---

# Credits

Blessing UI has no runtime dependencies. It still stands on the work of many people. This page names them. It lists the site that gave the look and the libraries that we compared with. It also lists the methods of the components and the tools that build and test the library.

## The look

The visual language comes from [saenai.tv](https://www.saenai.tv/), the official site of the anime _Saenai Heroine no Sodatekata_. We wrote down its rules and drew every part again. We copied no asset, style sheet, or script. The [story](./story) tells how. The anime, its title, its characters, and its artwork belong to their respective owners. This project is not affiliated with them.

The default fonts are [Roboto](https://fonts.google.com/specimen/Roboto) by Christian Robertson and [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) by Google. The library does not bundle them. You load them yourself, as the [fonts guide](../guide/fonts) shows.

## Libraries we compared with

We checked the list of components against these projects, to find what a library of this kind must have. Each Blessing component is an independent implementation. The library uses no code from them, and their names belong to their owners.

- [shadcn/ui](https://ui.shadcn.com/): the first target list, and the shape of the chart wrapper.
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
- The web platform does the heavy work: the Popover API, the `dialog` element, `Intl`, the Web Speech API, Web Audio, and CSS logical properties. [MDN Web Docs](https://developer.mozilla.org/) was the reference for all of them.

## Methods

Some components use known methods. We wrote each one again from its description.

- The [treemap](../components/treemap) uses the squarified layout of Bruls, Huijsmans, and van Wijk (2000).
- The [card input](../components/card-input) checks numbers with the Luhn algorithm (Hans Peter Luhn, 1954).
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
- [VitePress](https://vitepress.dev/) for this site, and [vue-component-meta](https://github.com/vuejs/language-tools) for the tables of props.
- [Vitest](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), and [jsdom](https://github.com/jsdom/jsdom) for the unit tests.
- [Playwright](https://playwright.dev/) for the checks in Chromium, Firefox, and WebKit, with [axe-core](https://github.com/dequelabs/axe-core), [pixelmatch](https://github.com/mapbox/pixelmatch), and [pngjs](https://github.com/pngjs/pngjs) for the audits and the visual diff.
- [oxfmt](https://oxc.rs/) from the Oxc project for the format of the code.
- [pnpm](https://pnpm.io/) manages the packages of the repository. The [code tabs](../components/code-tabs) also give the commands of [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), and [Bun](https://bun.sh/).

Thank you to everyone who made these projects.
