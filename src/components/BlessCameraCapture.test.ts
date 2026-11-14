import { flushPromises, mount } from "@vue/test-utils";
import BlessCameraCapture from "./BlessCameraCapture.vue";

const stopTrack = vi.fn();
const getUserMedia = vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] }));
beforeEach(() => {
  stopTrack.mockClear();
  getUserMedia.mockClear();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia,
      enumerateDevices: async () => [{ kind: "videoinput" }, { kind: "videoinput" }],
    },
  });
  HTMLMediaElement.prototype.play = vi.fn(async () => {});
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ drawImage() {} })) as never;
  HTMLCanvasElement.prototype.toBlob = function (cb: BlobCallback, type?: string) {
    cb(new Blob(["px"], { type }));
  };
  URL.createObjectURL = vi.fn(() => "blob:photo");
  URL.revokeObjectURL = vi.fn();
});
const button = (w: ReturnType<typeof mount>, t: string) =>
  w.findAll("button").find((b) => b.text() === t);

test("BlessCameraCapture: start, take a photo, retake; the camera is released after the photo", async () => {
  const w = mount(BlessCameraCapture);
  expect(w.find("video").exists()).toBe(false); // nothing asks for the camera before Start
  await button(w, "Start camera")!.trigger("click");
  await flushPromises();
  expect(getUserMedia).toHaveBeenCalledWith({ video: { facingMode: "user" }, audio: false });
  expect(w.find("video").classes()).toContain("bless-camera__video--mirror");
  await button(w, "Take photo")!.trigger("click");
  const [photo] = w.emitted("capture")![0] as [Blob];
  expect(photo.type).toBe("image/jpeg");
  expect(stopTrack).toHaveBeenCalled();
  expect(w.find("img").attributes()).toMatchObject({ src: "blob:photo", alt: "Photo" });
  await button(w, "Retake")!.trigger("click");
  await flushPromises();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:photo");
  expect(getUserMedia).toHaveBeenCalledTimes(2);
});

test("BlessCameraCapture: switch shows with two cameras and flips the facing mode", async () => {
  const w = mount(BlessCameraCapture, { props: { facing: "environment" } });
  await button(w, "Start camera")!.trigger("click");
  await flushPromises();
  expect(w.find("video").classes()).not.toContain("bless-camera__video--mirror");
  await button(w, "Switch camera")!.trigger("click");
  await flushPromises();
  expect(getUserMedia).toHaveBeenLastCalledWith({ video: { facingMode: "user" }, audio: false });
});

test("BlessCameraCapture: no camera shows why and emits error", async () => {
  getUserMedia.mockRejectedValueOnce(new Error("NotFoundError"));
  const w = mount(BlessCameraCapture);
  await button(w, "Start camera")!.trigger("click");
  await flushPromises();
  expect(w.find("[role=status]").text()).toBe("The camera is not available");
  expect(w.emitted("error")).toHaveLength(1);
});
