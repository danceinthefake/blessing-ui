import { mount } from "@vue/test-utils";
import BlessShareAccess, { type BlessSharePerson } from "./BlessShareAccess.vue";

const people: BlessSharePerson[] = [
  { id: "1", name: "Ana", role: "owner" },
  { id: "2", name: "Budi", email: "budi@example.com", role: "view" },
];

test("BlessShareAccess: invite, change and remove access, general access, and copy", async () => {
  const w = mount(BlessShareAccess, {
    props: {
      people,
      link: "https://example.com/d/1",
      "onUpdate:people": (v: BlessSharePerson[]) => w.setProps({ people: v }),
      "onUpdate:linkAccess": (v: string) => w.setProps({ linkAccess: v as "view" }),
    },
  });
  expect(w.findAll("li")[0]!.text()).toContain("Owner");
  expect(w.findAll("li")[0]!.find("select").exists()).toBe(false);
  await w.find('[aria-label="Access for Budi"]').setValue("edit");
  expect(w.props("people")[1]!.role).toBe("edit");
  await w.find('input[type="email"]').setValue("cici@example.com");
  await w.find('[aria-label="Access for the new people"]').setValue("comment");
  await w.find("form").trigger("submit");
  expect(w.emitted("invite")).toEqual([["cici@example.com", "comment"]]);
  await w.find('[aria-label="Remove Budi"]').trigger("click");
  expect(w.props("people")).toHaveLength(1);
  expect(w.find(".bless-access__hint").text()).toBe("Only the people above can open it.");
  await w.find('select[aria-label="General access"]').setValue("anyone");
  expect(w.find(".bless-access__hint").text()).toBe("Anyone with the link: can view.");
  const write = vi.fn(() => Promise.resolve());
  Object.assign(navigator, { clipboard: { writeText: write } });
  await w.find(".bless-access__foot button").trigger("click");
  await Promise.resolve();
  expect(write).toHaveBeenCalledWith("https://example.com/d/1");
  expect(w.find("[role=status]").text()).toBe("Link copied");
});
