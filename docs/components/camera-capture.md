---
title: CameraCapture
---

<script setup>
import CameraCaptureBasic from "../demos/CameraCaptureBasic.vue";
</script>

# CameraCapture

<p class="bless-lead">Take a photo with the camera, in the page</p>

Takes a photo for a profile, a receipt, or a document, with `getUserMedia` and a canvas. People see the camera in the page and can take the photo again. If a phone's own camera app is enough, use a [file input](./file-input) with `accept="image/*"` and `capture` instead, which needs no code. To crop the photo after, use the [cropper](./cropper).

<Demo title="Basic">
  <CameraCaptureBasic />
  <template #code>

<<< ../demos/CameraCaptureBasic.vue

  </template>
</Demo>

- Start camera asks for the camera. The browser asks for permission only then, not when the page opens.
- Take photo sends the photo as a `Blob` with `capture`, shows it, and releases the camera, so its light goes off. Retake starts the camera again.
- `facing` chooses the camera to start with: `user` (default) faces the person, and `environment` faces away. When the device has more than one camera, Switch camera shows.
- The front camera shows as a mirror, as people expect from a mirror. The photo itself is not mirrored, so text in it reads correctly.
- `type` sets the image type (default `image/jpeg`), and `quality` sets the quality from 0 to 1 (default 0.9). The photo has the full size of the camera image.
- When there is no camera or no permission, a line says so, and `error` sends the reason.
- The camera needs a secure page (HTTPS or `localhost`).
- Change the words with `labels` or a [label pack](../guide/translating): the buttons, `preview`, `photo` (the alternative text of the photo), and `unavailable`.

## Usage

```ts
import { BlessCameraCapture } from "blessing-ui";
```

## API

<PropsTable name="BlessCameraCapture" />
