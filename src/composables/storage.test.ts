import { readJson, readStore, removeStore, writeJson, writeStore } from "./storage";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test("storage: reads and writes plain values and JSON", () => {
  expect(readStore("k")).toBeNull();
  expect(writeStore("k", "v")).toBe(true);
  expect(readStore("k")).toBe("v");
  expect(writeJson("j", { a: [1, 2] })).toBe(true);
  expect(readJson("j")).toEqual({ a: [1, 2] });
  removeStore("k");
  expect(readStore("k")).toBeNull();
});

test("storage: damaged JSON reads as null, not as an error", () => {
  localStorage.setItem("bad", "{not json");
  expect(readJson("bad")).toBeNull();
  expect(readJson("missing")).toBeNull();
});

test("storage: blocked storage never throws", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("full");
  });
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(readStore("k")).toBeNull();
  expect(readJson("k")).toBeNull();
  expect(writeStore("k", "v")).toBe(false);
  expect(writeJson("k", 1)).toBe(false);
  expect(() => removeStore("k")).not.toThrow();
});
