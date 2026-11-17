import { mount } from "@vue/test-utils";
import BlessRunTrace from "./BlessRunTrace.vue";

test("BlessRunTrace: tree rows with depth, status in words, the lane, times, and input and output", () => {
  const w = mount(BlessRunTrace, {
    props: {
      steps: [
        {
          id: "a",
          name: "Plan",
          kind: "model",
          status: "ok",
          start: 0,
          duration: 800,
          children: [
            {
              id: "b",
              name: "search",
              kind: "tool",
              status: "error",
              start: 800,
              duration: 1200,
              input: "q=mic",
              output: "timeout",
            },
          ],
        },
        { id: "c", name: "Answer", kind: "model", status: "running", start: 2000, duration: 2000 },
      ],
    },
  });
  expect(w.find(".bless-trace__summary").text()).toBe("3 steps · 4s · 1 error");
  const rows = w.findAll("details");
  expect(rows[1]!.attributes("style")).toContain("--_depth: 1");
  expect(rows[1]!.find(".bless-trace__name").text().replace(/\s+/g, " ")).toBe(
    "✕ search tool error",
  );
  expect(rows[1]!.find(".bless-trace__lane span").attributes("style")).toContain(
    "inset-inline-start: 20%",
  );
  expect(rows.map((r) => r.find(".bless-trace__time").text())).toEqual(["800ms", "1.2s", "2s"]);
  expect(rows[1]!.findAll("pre").map((p) => p.text())).toEqual(["q=mic", "timeout"]);
});
