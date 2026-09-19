# Dark mode

Greys invert, the accent family stays, and `--bless-font-weight-thin` steps 100→300 because hairlines read thinner light-on-dark.

Follows `prefers-color-scheme` by default. Force one with `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

`data-theme="light"` forces light even when the OS is dark. `color-scheme` is set alongside, so native controls, scrollbars and form fields follow.

## `useTheme()`

```ts
import { useTheme } from "blessing-ui";
const { theme, isDark, set, toggle } = useTheme();
// theme: "light" | "dark" | "system" — persisted in localStorage("bless-theme")
```

`BlessThemeToggle` is the ready-made control: a single ☀/☾ button, or `mode="group"` for light / system / dark.

## Overriding the dark palette

Redefine under both selectors that `tokens.css` uses:

```css
:root[data-theme="dark"],
:root:not([data-theme="light"]) {
  @media (prefers-color-scheme: dark) {
    --bless-color-surface: #1c1e22;
  }
}
```
