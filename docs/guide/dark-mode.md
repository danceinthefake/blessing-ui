# Dark mode

<script setup>
import ThemeToggleBasic from "../demos/ThemeToggleBasic.vue";
</script>

Greys invert, the accent family stays, and `--bless-font-weight-thin` steps 100→300 because hairlines read thinner light-on-dark. The full list of what changes is under [Tokens → What flips](./tokens#what-flips-what-swaps).

Follows `prefers-color-scheme` by default. Force one with `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

`data-theme="light"` forces light even when the OS is dark. `color-scheme` is set alongside, so native controls, scrollbars and form fields follow.

<Demo title="The control">
  <ThemeToggleBasic />
  <template #code>

<<< ../demos/ThemeToggleBasic.vue

  </template>
</Demo>

`BlessThemeToggle` is the ready-made control — this whole site runs on it. A single ☀/☾ button by default; `mode="group"` for light / system / dark.

## `useTheme()`

```ts
import { useTheme } from "blessing-ui";
const { theme, isDark, set, toggle } = useTheme();
// theme: "light" | "dark" | "system" — persisted in localStorage("bless-theme")
```

`toggle()` flips to the opposite of what is currently _shown_: from `system` on a dark OS it goes to `light`, so the first click always changes something. `set("system")` hands control back to the OS.

## No flash on load

`useTheme()` applies the persisted choice after the app mounts (after hydration, so server-rendered markup matches). On a static or server-rendered page that leaves one frame of the default theme before a saved dark preference lands. Set the attribute before paint with an inline script in `<head>`:

```html
<script>
  try {
    const t = localStorage.getItem("bless-theme");
    if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
    const p = localStorage.getItem("bless-palette");
    if (p) document.documentElement.dataset.palette = p;
  } catch {}
</script>
```

Nuxt: `app.head.script: [{ innerHTML: "…", tagPosition: "head" }]` in `nuxt.config`. Nothing else is needed — components don't have to be wrapped in `BlessClientOnly` for theming; only the toggle's own `aria-pressed` waits for the client, which is why it is applied post-hydration.

## Overriding the dark palette

Redefine under both selectors that `tokens.css` uses — the forced one and the OS-following one — and load the override **after** `tokens.css`:

```css
:root[data-theme="dark"] {
  --bless-color-surface: #1c1e22;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bless-color-surface: #1c1e22;
  }
}
```
