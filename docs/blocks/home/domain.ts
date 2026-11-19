import type { BlessRoom, BlessRoomDevice, BlessScene } from "blessing-ui";

export interface Device extends BlessRoomDevice {
  /** 0–100, for a device that runs on a battery */
  battery?: number;
}
export interface Scene extends BlessScene {
  /** device id → on or off */
  sets: Record<string, boolean>;
}
export type { BlessRoom };

/** the devices after a scene runs */
export const apply = (devices: Device[], scene: Scene): Device[] =>
  devices.map((d) => (d.id in scene.sets ? { ...d, on: scene.sets[d.id] } : d));

/** the scene that the devices match now, if any */
export const matching = (devices: Device[], scenes: Scene[]) =>
  scenes.find((s) =>
    Object.entries(s.sets).every(([id, on]) => !!devices.find((d) => d.id === id)?.on === on),
  )?.id;
