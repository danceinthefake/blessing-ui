import { mount } from "@vue/test-utils";
import BlessLogoCloud from "./BlessLogoCloud.vue";

test("BlessLogoCloud: names as alt text, links, the title, and the mono switch", async () => {
  const w = mount(BlessLogoCloud, {
    props: {
      title: "Trusted by studios",
      logos: [
        { name: "Acme", src: "/a.svg", href: "https://acme.example" },
        { name: "Bunyi", src: "/b.svg" },
      ],
    },
  });
  expect(w.find("section").attributes("aria-label")).toBe("Trusted by studios");
  expect(w.findAll("img").map((i) => i.attributes("alt"))).toEqual(["Acme", "Bunyi"]);
  expect(w.find("a").attributes("href")).toBe("https://acme.example");
  expect(w.find("section").classes()).toContain("is-mono");
  await w.setProps({ mono: false });
  expect(w.find("section").classes()).not.toContain("is-mono");
});
