import { readdirSync, readFileSync } from "node:fs";
import { internalComponents } from "./components";

test("internalComponents: every component file is exported or internal, not both", () => {
  const files = readdirSync(`${import.meta.dirname}/components`)
    .map((f) => /^(Bless\w+)\.vue$/.exec(f)?.[1])
    .filter((n): n is string => !!n);
  const index = readFileSync(`${import.meta.dirname}/index.ts`, "utf8");
  const exported = [...index.matchAll(/export \{ default as (Bless\w+) \}/g)].map((m) => m[1]);
  expect(files.filter((n) => !exported.includes(n)).sort()).toEqual([...internalComponents].sort());
  expect(exported.filter((n) => internalComponents.includes(n))).toEqual([]);
});
