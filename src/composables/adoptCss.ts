/**
 * Add CSS to the page at run time, once per key, as a constructed stylesheet. For rules that a
 * bundler's CSS minifier cannot parse yet: Lightning CSS 1.33 (the default of Vite 8) fails the
 * whole build on `@container anchored(...)`, so those rules must not be in a `.css` file that an
 * app imports. A constructed sheet comes after the page's sheets, so on equal specificity it wins.
 */
const added = new Set<string>();
export function adoptCss(key: string, css: string) {
  if (added.has(key) || typeof document === "undefined" || typeof CSSStyleSheet === "undefined")
    return;
  added.add(key);
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    // no constructable stylesheets: the arrow keeps its first side, which is right unless CSS flips
  }
}
