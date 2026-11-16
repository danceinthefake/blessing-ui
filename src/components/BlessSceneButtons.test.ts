import { mount } from "@vue/test-utils";
import BlessSceneButtons from "./BlessSceneButtons.vue";

test("BlessSceneButtons: a pressed scene, a run event, and a status", async () => {
  const w = mount(BlessSceneButtons, {
    props: {
      scenes: [
        { id: "rec", name: "Recording", icon: "🎙️", description: "Sign on, AC off" },
        { id: "night", name: "Night" },
      ],
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  const [rec, night] = w.findAll(".bless-scenes__scene");
  expect(rec!.find(".bless-scenes__desc").text()).toBe("Sign on, AC off");
  expect(rec!.attributes("aria-pressed")).toBe("false");
  await night!.trigger("click");
  expect(w.emitted("run")).toEqual([["night"]]);
  expect(w.findAll(".bless-scenes__scene")[1]!.attributes("aria-pressed")).toBe("true");
  expect(w.find("[role=status]").text()).toBe("Night is on.");
});
