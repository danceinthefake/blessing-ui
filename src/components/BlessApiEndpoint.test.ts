import { mount } from "@vue/test-utils";
import BlessApiEndpoint from "./BlessApiEndpoint.vue";

test("BlessApiEndpoint: method, path parameters, the table, and a tab for each response", async () => {
  const w = mount(BlessApiEndpoint, {
    props: {
      method: "get",
      path: "/orders/{id}/items",
      params: [
        { name: "id", in: "path", type: "string", required: true, description: "The order" },
        { name: "limit", in: "query", type: "integer" },
      ],
      example: "curl /orders/1/items",
      responses: [
        { status: 200, description: "The items", body: '{"items":[]}' },
        { status: 404, description: "No such order" },
      ],
    },
  });
  expect(w.find(".bless-api__method").text()).toBe("GET");
  expect(w.find(".bless-api__method").classes()).toContain("is-get");
  expect(w.find("h3").text()).toBe("/orders/{id}/items");
  expect(w.find(".bless-api__param").text()).toBe("{id}");
  const rows = w.findAll("tbody tr");
  expect(rows[0]!.find("th").text()).toBe("idrequiredThe order");
  expect(rows[1]!.findAll("td").map((d) => d.text())).toEqual(["query", "integer"]);
  expect(w.findAll("[role=tab]").map((t) => t.text())).toEqual(["200", "404"]);
  expect(w.find("[role=tabpanel]").text()).toContain("The items");
  await w.findAll("[role=tab]")[1]!.trigger("click");
  const shown = w
    .findAll("[role=tabpanel]")
    .find((p) => (p.element as HTMLElement).style.display !== "none")!;
  expect(shown.text()).toBe("No such order");
});

test("BlessApiEndpoint opens the first response of a new endpoint", async () => {
  const w = mount(BlessApiEndpoint, {
    props: { method: "get", path: "/a", responses: [{ status: 200, description: "OK" }] },
  });
  await w.setProps({
    method: "post",
    path: "/b",
    responses: [{ status: 201, description: "Made" }],
  });
  expect(w.find("[role=tab]").attributes("aria-selected")).toBe("true");
  expect(w.find("[role=tabpanel]").text()).toBe("Made");
});
