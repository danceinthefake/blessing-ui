---
title: Guide
---

<Eyecatch kicker="Volume 01 · the guide" title="Guide" num="01" :level="1">

Install the library, give it your colors, and learn the rules that every part follows.

</Eyecatch>

## Start

<ChapterCards :items="[
  { title: 'Install', text: 'Add the package, import the styles, and render the first part.', link: '/guide/install' },
  { title: 'Bundle size', text: 'What each part costs, gzipped.', link: '/guide/sizes' },
]" />

## Theming

<ChapterCards :items="[
  { title: 'Tokens', text: 'Every value is a --bless-* custom property.', link: '/guide/tokens' },
  { title: 'Palettes', text: 'Six palettes, one attribute.', link: '/guide/palettes' },
  { title: 'Theme maker', text: 'One petal color in, a palette out.', link: '/guide/theme-maker' },
  { title: 'Dark mode', text: 'Follow the system, or force light or dark.', link: '/guide/dark-mode' },
  { title: 'Motion', text: 'Three layers like the show, calm motion, and reduced motion.', link: '/guide/motion' },
  { title: 'Fonts', text: 'The type stack and how to change it.', link: '/guide/fonts' },
  { title: 'Right-to-left', text: 'Layouts that mirror for Arabic and Hebrew.', link: '/guide/rtl' },
  { title: 'Translating', text: 'Label packs for the words inside the parts.', link: '/guide/translating' },
]" />

## Building

<ChapterCards :items="[
  { title: 'Conventions', text: 'The rules for props, slots, events, and names.', link: '/guide/conventions' },
]" />

## Composables

<ChapterCards :items="[
  { title: 'Scroll spy', text: 'Mark the section that is in view.', link: '/guide/scroll-spy' },
  { title: 'Animate on scroll', text: 'Start a motion when an element comes into view.', link: '/guide/animate-on-scroll' },
  { title: 'Gestures', text: 'Pan, swipe, long press, and touch repeat.', link: '/guide/gestures' },
  { title: 'Browser', text: 'Resize, fullscreen, visibility, and scroll.', link: '/guide/browser' },
]" />
