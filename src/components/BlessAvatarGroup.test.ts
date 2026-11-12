import { mount } from "@vue/test-utils";
import { h } from "vue";
import BlessAvatarGroup from "./BlessAvatarGroup.vue";
import { provideLabels } from "../composables/useLabels";

const people = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds", "Rich Hickey"].map(
  (name) => ({ name }),
);

test("BlessAvatarGroup: shows max avatars and one +N plate for the rest", () => {
  const w = mount(BlessAvatarGroup, { props: { items: people, max: 3 } });
  expect(w.attributes("role")).toBe("group");
  const plates = w.findAll(".bless-avatar");
  expect(plates).toHaveLength(4);
  expect(plates[0]!.text()).toBe("AL");
  const more = w.find(".bless-avatar-group__more");
  expect(more.text()).toBe("+2");
  expect(more.attributes("aria-label")).toBe("2 more");
  expect(more.attributes("title")).toBe("Linus Torvalds, Rich Hickey");
});

test("BlessAvatarGroup: no +N plate when everyone fits", () => {
  const w = mount(BlessAvatarGroup, { props: { items: people } });
  expect(w.findAll(".bless-avatar")).toHaveLength(5);
  expect(w.find(".bless-avatar-group__more").exists()).toBe(false);
});

test("BlessAvatarGroup: the +N words come from labels or a label pack", () => {
  const Root = {
    setup() {
      provideLabels({ BlessAvatarGroup: { more: (n: number) => `${n} lainnya` } });
      return () => h(BlessAvatarGroup, { items: people, max: 1 });
    },
  };
  expect(mount(Root).find(".bless-avatar-group__more").attributes("aria-label")).toBe("4 lainnya");
  const w = mount(BlessAvatarGroup, {
    props: { items: people, max: 4, labels: { more: (n: number) => `and ${n}` } },
  });
  expect(w.find(".bless-avatar-group__more").attributes("aria-label")).toBe("and 1");
});
