import { mount } from "@vue/test-utils";
import BlessProfileCard from "./BlessProfileCard.vue";

test("BlessProfileCard: a cover, the name as a heading and link, the handle, bio, and short counts", () => {
  const w = mount(BlessProfileCard, {
    props: {
      name: "Ana Putri",
      handle: "@ana",
      href: "/ana",
      cover: "/c.jpg",
      bio: "Host of Home Studio.",
      stats: [
        { label: "followers", value: 12_400 },
        { label: "episodes", value: 41 },
      ],
    },
  });
  expect(w.find("h3 a").attributes("href")).toBe("/ana");
  expect(w.find("h3").text()).toBe("Ana Putri");
  expect(w.find(".bless-profile__handle").text()).toBe("@ana");
  expect(w.find(".bless-profile__cover").attributes("style")).toContain('url("/c.jpg")');
  expect(w.findAll(".bless-profile__stats > div").map((d) => d.text())).toEqual([
    "followers12.4K",
    "episodes41",
  ]);
  expect(w.find("button").exists()).toBe(false);
});

test("BlessProfileCard: the follow button is a toggle, and labels translate", async () => {
  const w = mount(BlessProfileCard, {
    props: {
      name: "Budi",
      followable: true,
      labels: { follow: "Ikuti", following: "Mengikuti" },
      "onUpdate:following": (v: boolean) => w.setProps({ following: v }),
    },
  });
  const b = () => w.find("button");
  expect(b().text()).toBe("Ikuti");
  expect(b().attributes("aria-pressed")).toBe("false");
  await b().trigger("click");
  expect(b().text()).toBe("Mengikuti");
  expect(b().attributes("aria-pressed")).toBe("true");
  expect(w.emitted("update:following")).toEqual([[true]]);
});
