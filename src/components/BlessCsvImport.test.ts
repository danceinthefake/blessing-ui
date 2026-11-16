import { flushPromises, mount } from "@vue/test-utils";
import BlessCsvImport, { parseCsv } from "./BlessCsvImport.vue";

test("parseCsv: quotes, commas and line breaks in quotes, CRLF, and no empty last row", () => {
  expect(parseCsv('a,b\r\n"x, y","say ""hi"""\n"two\nlines",\n\n')).toEqual([
    ["a", "b"],
    ["x, y", 'say "hi"'],
    ["two\nlines", ""],
  ]);
  expect(parseCsv("a;b\n1;2", ";")).toEqual([
    ["a", "b"],
    ["1", "2"],
  ]);
});

const fields = [
  { key: "sku", label: "SKU", required: true },
  { key: "name", label: "Product name", required: true },
  { key: "qty", label: "Quantity" },
];
const upload = async (w: ReturnType<typeof mount>, csv: string) => {
  const input = w.find("input[type=file]");
  Object.defineProperty(input.element, "files", {
    value: [new File([csv], "a.csv")],
    configurable: true,
  });
  await input.trigger("change");
  await flushPromises();
};

test("BlessCsvImport: auto match by name, a preview, skipped rows, and import of the good rows", async () => {
  const w = mount(BlessCsvImport, { props: { fields } });
  await upload(w, "Product Name,sku,Stock\nMic,M1,4\nCable,,9\n");
  expect(w.find("[role=status]").text()).toBe("2 rows in the file");
  const selects = w.findAll("select");
  expect((selects[0]!.element as HTMLSelectElement).value).toBe("1");
  expect((selects[2]!.element as HTMLSelectElement).value).toBe("-1");
  expect(w.findAll("tbody tr")[1]!.find(".is-missing").text()).toBe("—");
  expect(w.find(".bless-csv__warn").text()).toBe(
    "1 rows miss a required value and will be skipped.",
  );
  await selects[2]!.setValue("2");
  await w.find("button").trigger("click");
  expect(w.emitted("import")).toEqual([[[{ sku: "M1", name: "Mic", qty: "4" }]]]);
});

test("BlessCsvImport: a required field without a column stops the import", async () => {
  const w = mount(BlessCsvImport, { props: { fields } });
  await upload(w, "code,title\nM1,Mic\n");
  expect(w.find("[role=alert]").text()).toBe("Match these required fields: SKU, Product name");
  expect(w.find("button").attributes("disabled")).toBeDefined();
});
