import { closest, evaluate, usedNames } from "./formula";

const v = (src: string, vars: Record<string, number> = {}) => {
  const r = evaluate(src, vars);
  if (!r.ok) throw new Error(`${src}: ${r.error.code}`);
  return r.value;
};
const code = (src: string, vars: Record<string, number> = {}) => {
  const r = evaluate(src, vars);
  return r.ok ? "ok" : r.error;
};

test("arithmetic with the usual precedence and brackets", () => {
  expect(v("1 + 2 * 3")).toBe(7);
  expect(v("(1 + 2) * 3")).toBe(9);
  expect(v("10 / 4 - 1")).toBe(1.5);
  expect(v("2 * .5 + 3.")).toBe(4);
  expect(v("8 - 3 - 2")).toBe(3); // left to right
});

test("^ is right-associative and unary minus binds looser than it", () => {
  expect(v("2 ^ 3 ^ 2")).toBe(512);
  expect(v("-2 ^ 2")).toBe(-4);
  expect(v("(-2) ^ 2")).toBe(4);
  expect(v("--3")).toBe(3);
  expect(v("2 * -3")).toBe(-6);
});

test("named values, in any mix", () => {
  expect(v("price * qty + tax", { price: 12.5, qty: 4, tax: 2 })).toBe(52);
  expect(v("a_1 + _b", { a_1: 1, _b: 2 })).toBe(3);
});

test("functions: built in, several arguments, nested", () => {
  expect(v("max(1, 5, 3)")).toBe(5);
  expect(v("sum(1, 2, 3) / avg(2, 4)")).toBe(2);
  expect(v("round(3.14159, 2)")).toBe(3.14);
  expect(v("abs(-4) + sqrt(16)")).toBe(8);
  expect(v("min(max(1, 2), 9)")).toBe(2);
  expect(evaluate("double(4)", {}, { double: (x) => x * 2 })).toEqual({ ok: true, value: 8 });
});

test("an empty or whitespace formula is its own error", () => {
  expect(code("")).toMatchObject({ code: "empty" });
  expect(code("   ")).toMatchObject({ code: "empty" });
});

test("a stray character, a missing operand and left-over input are 'unexpected', at their place", () => {
  expect(code("1 $ 2")).toMatchObject({ code: "unexpected", pos: 2, name: "$" });
  expect(code("1 +")).toMatchObject({ code: "unexpected", pos: 3 });
  expect(code("1 2")).toMatchObject({ code: "unexpected", pos: 2, name: "2" });
  expect(code("* 3")).toMatchObject({ code: "unexpected", pos: 0 });
});

test("brackets that never close", () => {
  expect(code("(1 + 2")).toMatchObject({ code: "unclosed" });
  expect(code("max(1, 2")).toMatchObject({ code: "unclosed" });
});

test("unknown names, with a suggestion when one is close", () => {
  expect(code("prise * 2", { price: 3 })).toMatchObject({
    code: "unknown-variable",
    name: "prise",
    suggestion: "price",
    pos: 0,
    length: 5,
  });
  expect(code("zzzz", { price: 3 })).toMatchObject({
    code: "unknown-variable",
    suggestion: undefined,
  });
  expect(code("mxa(1, 2)")).toMatchObject({ code: "unknown-function", suggestion: "max" });
});

test("a function called with nothing", () => {
  expect(code("sqrt()")).toMatchObject({ code: "arity", name: "sqrt" });
});

test("dividing by zero and numbers that are not numbers are refused, not returned", () => {
  expect(code("1 / 0")).toMatchObject({ code: "divide-by-zero", pos: 2 });
  expect(code("4 / (2 - 2)")).toMatchObject({ code: "divide-by-zero" });
  expect(code("sqrt(-1)")).toMatchObject({ code: "not-finite" });
  expect(code("10 ^ 999")).toMatchObject({ code: "not-finite" });
});

test("it cannot run code: identifiers are only looked up, never executed", () => {
  expect(code("constructor")).toMatchObject({ code: "unknown-variable" });
  expect(code("__proto__")).toMatchObject({ code: "unknown-variable" });
  expect(code("toString(1)")).toMatchObject({ code: "unknown-function" });
  expect(code("alert(1)")).toMatchObject({ code: "unknown-function" });
});

test("usedNames lists values, not function names, once each", () => {
  expect(usedNames("price * qty + max(price, 3) + tax")).toEqual(["price", "qty", "tax"]);
  expect(usedNames("1 $ 2")).toEqual([]);
});

test("closest suggests only near misses", () => {
  expect(closest("qtty", ["qty", "price"])).toBe("qty");
  expect(closest("total", ["qty", "price"])).toBeUndefined();
});
