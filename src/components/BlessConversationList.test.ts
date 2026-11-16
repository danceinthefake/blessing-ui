import { mount } from "@vue/test-utils";
import BlessConversationList from "./BlessConversationList.vue";

const conversations = [
  { id: "a", name: "Ana", last: "See you", time: "09:12", unread: 3, online: true },
  { id: "b", name: "Budi", last: "Thanks", time: "Mon", typing: true },
  { id: "c", name: "Team", last: "ok", time: "Sun", unread: 120 },
];

test("BlessConversationList: unread in words, online, typing, and the open conversation", async () => {
  const w = mount(BlessConversationList, {
    props: {
      conversations,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  const items = w.findAll(".bless-convos__item");
  expect(items[0]!.classes()).toContain("is-unread");
  expect(items[0]!.find(".bless-convos__badge").text()).toBe("33 unread messages");
  expect(items[0]!.text()).toContain("Ana, online");
  expect(items[1]!.find(".bless-convos__last").text()).toBe("typing…");
  expect(items[2]!.find(".bless-convos__badge [aria-hidden]").text()).toBe("99+");
  await items[1]!.trigger("click");
  expect(w.props("modelValue")).toBe("b");
  expect(w.findAll(".bless-convos__item")[1]!.attributes("aria-current")).toBe("true");
  expect(w.findAll(".bless-convos__item")[0]!.attributes("aria-current")).toBeUndefined();
});
