import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessFeatureFlags from "./BlessFeatureFlags.vue";

const flags = [
  {
    key: "new-player",
    name: "New player",
    description: "The redesigned audio player",
    rollout: 25,
    env: "production",
  },
  { key: "chapters", name: "Chapters" },
];

test("BlessFeatureFlags: a switch per flag with its key, env, and the share of users", async () => {
  const w = mount(BlessFeatureFlags, {
    props: {
      flags,
      modelValue: { "new-player": true },
      "onUpdate:modelValue": (v: Record<string, boolean>) => w.setProps({ modelValue: v }),
    },
  });
  const items = w.findAll(".bless-flags__item");
  expect(items[0]!.find(".bless-flags__key").text()).toBe("new-player");
  expect(items[0]!.find(".bless-flags__env").text()).toBe("production");
  expect(items[0]!.find(".bless-flags__share").text()).toBe("25% of users");
  expect(items[0]!.find(".bless-flags__bar span").attributes("style")).toContain(
    "inline-size: 25%",
  );
  expect(items[1]!.find(".bless-flags__share").text()).toBe("Off");
  w.findAllComponents({ name: "BlessSwitch" })[1]!.vm.$emit("update:modelValue", true);
  await nextTick();
  expect(w.emitted("toggle")).toEqual([["chapters", true]]);
  expect(w.props("modelValue")).toEqual({ "new-player": true, chapters: true });
  expect(w.findAll(".bless-flags__share")[1]!.text()).toBe("All users");
});
