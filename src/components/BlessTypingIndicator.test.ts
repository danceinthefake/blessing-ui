import { mount } from "@vue/test-utils";
import BlessTypingIndicator from "./BlessTypingIndicator.vue";

test("BlessTypingIndicator: one, two, or many names, and an empty status for none", async () => {
  const w = mount(BlessTypingIndicator, { props: { names: [] } });
  expect(w.attributes("role")).toBe("status");
  expect(w.text()).toBe("");
  expect(w.find(".bless-typing__dots").exists()).toBe(false);
  await w.setProps({ names: ["Ana"] });
  expect(w.text()).toBe("Ana is typing…");
  expect(w.find(".bless-typing__dots").attributes("aria-hidden")).toBe("true");
  await w.setProps({ names: ["Ana", "Budi"] });
  expect(w.text()).toBe("Ana and Budi are typing…");
  await w.setProps({ names: ["Ana", "Budi", "Cici", "Dedi"] });
  expect(w.text()).toBe("Ana and 3 others are typing…");
});

test("BlessTypingIndicator: labels change the words", () => {
  const w = mount(BlessTypingIndicator, {
    props: { names: ["Ana", "Budi", "Cici"], labels: { many: (n, more) => `${n} +${more}` } },
  });
  expect(w.text()).toBe("Ana +2");
});
