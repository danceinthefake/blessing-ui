import { mount } from "@vue/test-utils";
import BlessLessonVideo, { type BlessVideoNote } from "./BlessLessonVideo.vue";

test("BlessLessonVideo: notes at the current time, sorted, a jump back, and delete", async () => {
  const w = mount(BlessLessonVideo, {
    props: {
      src: "a.mp4",
      title: "Lesson 1",
      captions: "a.vtt",
      captionsLang: "en",
      modelValue: [{ id: "x", at: 125, text: "Gain" }] as BlessVideoNote[],
      "onUpdate:modelValue": (v: BlessVideoNote[]) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.find("track").attributes("kind")).toBe("captions");
  const video = w.find("video").element as HTMLVideoElement;
  let t = 0;
  Object.defineProperty(video, "currentTime", {
    get: () => t,
    set: (v) => (t = v),
    configurable: true,
  });
  t = 42.7;
  await w.find("video").trigger("timeupdate");
  expect(w.find("form button").text()).toBe("Add a note at 0:42");
  await w.find("textarea").setValue("Mic distance");
  await w.find("form").trigger("submit");
  expect(w.findAll(".bless-lesson__time").map((b) => b.text())).toEqual(["0:42", "2:05"]);
  await w.find('[aria-label="Go to 2:05"]').trigger("click");
  expect(t).toBe(125);
  await w.find('[aria-label="Delete the note at 0:42"]').trigger("click");
  expect(w.props("modelValue")).toHaveLength(1);
});
