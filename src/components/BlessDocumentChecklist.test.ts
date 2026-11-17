import { mount } from "@vue/test-utils";
import BlessDocumentChecklist, { type BlessChecklistDoc } from "./BlessDocumentChecklist.vue";

const docs: BlessChecklistDoc[] = [
  { id: "ktp", name: "Identity card", required: true, state: "accepted", file: "ktp.jpg" },
  { id: "lease", name: "Lease", required: true, state: "rejected", reason: "Page 2 is missing." },
  { id: "photo", name: "Photo of the place", required: true, state: "uploaded", file: "shop.jpg" },
  { id: "plan", name: "Floor plan", state: "missing", accept: ".pdf" },
];

test("BlessDocumentChecklist: progress of required documents, states in words, upload, replace, and remove", async () => {
  const w = mount(BlessDocumentChecklist, { props: { docs } });
  expect(w.find("[role=status]").text()).toBe("2 of 3 required documents sent");
  const items = w.findAll(".bless-docs__item");
  expect(items.map((i) => i.find(".bless-docs__state").text())).toEqual([
    "Accepted · ktp.jpg",
    "Not accepted",
    "Sent · shop.jpg",
    "Not sent",
  ]);
  expect(items[0]!.find("input").exists()).toBe(false);
  expect(items[1]!.find(".bless-docs__reason").text()).toBe("Page 2 is missing.");
  expect(items[1]!.find("label").text()).toBe("Replace Lease");
  expect(items[3]!.find("label").text()).toBe("Upload Floor plan");
  expect(items[3]!.find("input").attributes("accept")).toBe(".pdf");
  const file = new File(["x"], "plan.pdf");
  const input = items[3]!.find("input");
  Object.defineProperty(input.element, "files", { value: [file] });
  await input.trigger("change");
  expect(w.emitted("upload")).toEqual([["plan", file]]);
  await w.find('[aria-label="Remove Photo of the place"]').trigger("click");
  expect(w.emitted("remove")).toEqual([["photo"]]);
});
