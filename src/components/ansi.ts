// ANSI SGR colors in log text, as segments with classes. Cursor moves and other escape codes are
// dropped. Colors map to tokens, so a log follows the theme.

export interface AnsiSegment {
  text: string;
  /** space-separated `bless-ansi--*` classes, or "" */
  cls: string;
}

const NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
// CSI (ESC [ … letter) and OSC (ESC ] … BEL or ESC \) sequences
const ESC = /\x1b\[([0-9;?]*)([A-Za-z])|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;

export function parseAnsi(line: string): AnsiSegment[] {
  const out: AnsiSegment[] = [];
  let fg = "";
  let bold = false;
  let dim = false;
  let underline = false;
  let at = 0;
  const push = (text: string) => {
    if (!text) return;
    const cls = [fg && `bless-ansi--${fg}`, bold && "bless-ansi--bold", dim && "bless-ansi--dim"]
      .concat(underline ? "bless-ansi--underline" : [])
      .filter(Boolean)
      .join(" ");
    const last = out[out.length - 1];
    if (last && last.cls === cls) last.text += text;
    else out.push({ text, cls });
  };
  for (const m of line.matchAll(ESC)) {
    push(line.slice(at, m.index));
    at = m.index + m[0].length;
    if (m[2] !== "m") continue;
    for (const c of (m[1] || "0").split(";").map(Number)) {
      if (c === 0) [fg, bold, dim, underline] = ["", false, false, false];
      else if (c === 1) bold = true;
      else if (c === 2) dim = true;
      else if (c === 4) underline = true;
      else if (c === 22) bold = dim = false;
      else if (c === 24) underline = false;
      else if (c === 39) fg = "";
      else if (c >= 30 && c <= 37) fg = NAMES[c - 30]!;
      else if (c >= 90 && c <= 97) fg = NAMES[c - 90]!;
    }
  }
  push(line.slice(at));
  return out;
}

/** the text without escape codes */
export const stripAnsi = (line: string) => line.replace(ESC, "");
