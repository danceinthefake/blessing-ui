import { mount } from "@vue/test-utils";
import BlessTeamGrid from "./BlessTeamGrid.vue";

test("BlessTeamGrid: photo or initials, name, role, bio, and links named with the person", () => {
  const w = mount(BlessTeamGrid, {
    props: {
      people: [
        {
          name: "Ana Putri",
          role: "Founder",
          photo: "/ana.jpg",
          bio: "Records podcasts.",
          links: [{ label: "Email", href: "mailto:a@x" }],
        },
        { name: "Budi Santoso", role: "Engineer" },
      ],
    },
  });
  const people = w.findAll(".bless-team__person");
  expect(people[0]!.find("img").attributes("alt")).toBe("");
  expect(people[1]!.find(".bless-avatar").text()).toBe("BS");
  expect(people.map((p) => p.find("h3").text())).toEqual(["Ana Putri", "Budi Santoso"]);
  expect(people[0]!.find(".bless-team__role").text()).toBe("Founder");
  expect(people[0]!.find("a").text()).toBe("Email of Ana Putri");
});
