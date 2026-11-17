import { mount } from "@vue/test-utils";
import BlessRequestInspector from "./BlessRequestInspector.vue";

test("BlessRequestInspector: status in words, facts, pretty JSON, headers, and an empty body", async () => {
  const w = mount(BlessRequestInspector, {
    props: {
      method: "post",
      url: "/v1/orders",
      status: 422,
      statusText: "Unprocessable Content",
      duration: 183.4,
      size: 2480,
      request: { headers: { "content-type": "application/json" } },
      response: { headers: { "x-id": "r1" }, body: '{"error":"bad"}' },
    },
  });
  expect(w.find(".bless-inspect__line").text()).toBe("POST/v1/orders");
  expect(w.find(".bless-inspect__status").classes()).toContain("is-clientError");
  expect(w.find(".bless-inspect__facts").text().replace(/\s+/g, " ")).toBe(
    "422 Unprocessable Content (client error)183 ms2.5 kB",
  );
  const panel = () =>
    w.findAll("[role=tabpanel]").find((p) => (p.element as HTMLElement).style.display !== "none")!;
  expect(panel().find("code").text()).toBe('{\n  "error": "bad"\n}');
  await w.findAll("[role=tab]")[1]!.trigger("click");
  expect(panel().text()).toBe("No body.");
  await w.findAll("[role=tab]")[0]!.trigger("click");
  expect(
    panel()
      .findAll("dt")
      .map((d) => d.text()),
  ).toEqual(["content-type", "x-id"]);
});
