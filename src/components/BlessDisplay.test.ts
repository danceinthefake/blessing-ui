import { mount } from "@vue/test-utils";
import BlessAlert from "./BlessAlert.vue";
import BlessAspectRatio from "./BlessAspectRatio.vue";
import BlessAvatar from "./BlessAvatar.vue";
import BlessKbd from "./BlessKbd.vue";
import BlessProgress from "./BlessProgress.vue";
import BlessSkeleton from "./BlessSkeleton.vue";

test("BlessProgress determinate / indeterminate", () => {
  const d = mount(BlessProgress, { props: { value: 25, max: 50, label: "Up", showValue: true } });
  expect(d.find('[role="progressbar"]').attributes("aria-valuenow")).toBe("25");
  expect(d.find(".bless-progress__fill").attributes("style")).toContain("width: 50%");
  expect(d.find(".bless-progress__value").text()).toBe("50%");
  const i = mount(BlessProgress);
  expect(i.classes()).toContain("bless-progress--indeterminate");
  expect(i.find('[role="progressbar"]').attributes("aria-valuenow")).toBeUndefined();
});

test("BlessSkeleton lines / avatar", () => {
  expect(mount(BlessSkeleton, { props: { lines: 3 } }).findAll(".bless-skeleton")).toHaveLength(3);
  expect(
    mount(BlessSkeleton, { props: { avatar: true, width: "40px", height: "40px" } }).classes(),
  ).toContain("bless-skeleton--avatar");
});

test("BlessAvatar initials fallback and image error", async () => {
  const f = mount(BlessAvatar, { props: { name: "Megumi Kato" } });
  expect(f.text()).toBe("MK");
  expect(f.attributes("role")).toBe("img");
  expect(f.attributes("aria-label")).toBe("Megumi Kato");

  const i = mount(BlessAvatar, { props: { src: "/x.png", name: "Eriri" } });
  expect(i.find("img").exists()).toBe(true);
  await i.find("img").trigger("error");
  expect(i.find("img").exists()).toBe(false);
  expect(i.text()).toBe("E");
});

test("BlessAspectRatio sets aspect-ratio", () => {
  expect(mount(BlessAspectRatio, { props: { ratio: 1 } }).attributes("style")).toContain(
    "aspect-ratio: 1",
  );
});

test("BlessAlert live role and dismiss", async () => {
  const w = mount(BlessAlert, {
    props: { title: "Heads up", color: "warning", dismissible: true, live: "alert" },
    slots: { default: "body" },
  });
  expect(w.attributes("role")).toBe("alert");
  expect(w.find(".bless-alert__title").text()).toBe("Heads up");
  await w.find(".bless-alert__close").trigger("click");
  expect(w.emitted("dismiss")).toHaveLength(1);
  expect(w.emitted("update:modelValue")![0]).toEqual([false]);
});

test("BlessKbd keys", () => {
  const w = mount(BlessKbd, { props: { keys: ["⌘", "K"] } });
  expect(w.findAll(".bless-kbd__key").map((k) => k.text())).toEqual(["⌘", "K"]);
  expect(w.findAll(".bless-kbd__plus")).toHaveLength(1);
});
