// State that setup copies from a prop or a model goes stale when the prop changes later, for
// example when data loads after mount. Each copy here is either watched or a starting value on
// purpose. A new copy fails this test until it is added with its reason.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(__dirname, "components");
const REASONS: Record<string, string> = {
  "BlessApiEndpoint:tab": "BlessTabs falls back to the first tab",
  "BlessBanner:ready": "read from storage on mount",
  "BlessCalendar:focused": "watched through view",
  "BlessCameraCapture:facing": "the camera to start with",
  "BlessConsentBanner:ready": "read from storage on mount",
  "BlessContactForm:v": "watched: topics",
  "BlessCountUp:shown": "watched: value",
  "BlessDateTimePicker:date": "watched: model",
  "BlessDateTimePicker:time": "watched: model",
  "BlessDurationInput:shown": "watched: model",
  "BlessEligibilityCheck:at": "watched: questions",
  "BlessEmailComposer:showCc": "watched: cc",
  "BlessFlashcards:queue": "watched: cards",
  "BlessInputOTP:chars": "watched: model",
  "BlessLiveBlog:shown": "watched: updates",
  "BlessPaywall:chosen": "watched: plans; pick counts only at first",
  "BlessPlaceSearch:query": "watched: place",
  "BlessReasoning:shown": "watched: open and streaming",
  "BlessStreamingText:shown": "watched: text",
  "BlessTimeTracker:task": "watched: running",
  "BlessTreeItem:expanded": "the native toggle event keeps it",
  "BlessTreeTable:local": "defaultExpanded is the start; v-model:expanded controls it",
};

test("every state that setup copies from a prop or a model has a reason", () => {
  const found: string[] = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".vue"))) {
    const src = readFileSync(resolve(dir, f), "utf8");
    // the sources: props, models, and computed values and helpers that can read them
    const names = [...src.matchAll(/^const (\w+) = (?:defineModel|computed|\([^)]*\) =>)/gm)].map(
      (m) => m[1],
    );
    const from = new RegExp(`\\b(props|${["\\$none", ...names].join("|")})\\b`);
    for (const m of src.matchAll(
      /^(?:const|let) (\w+) = (?:ref|reactive|shallowRef)(?:<[^>]*>)?\((.*)$/gm,
    ))
      if (from.test(m[2].replace(/\/\/.*/, ""))) found.push(`${f.replace(".vue", "")}:${m[1]}`);
  }
  expect(found.filter((k) => !REASONS[k])).toEqual([]);
  // a reason for a copy that is gone is stale too
  expect(Object.keys(REASONS).filter((k) => !found.includes(k))).toEqual([]);
});
