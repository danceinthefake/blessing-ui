import type { BlessRoom, Device, Scene } from "./domain";

export interface HomeApi {
  rooms(): Promise<BlessRoom[]>;
  devices(): Promise<Device[]>;
  scenes(): Promise<Scene[]>;
  set(id: string, on: boolean): Promise<void>;
}

/** offline adapter: the club room of a game circle */
export const mockHomeApi: HomeApi = {
  async rooms() {
    return [
      { id: "club", name: "Club room", x: 0, y: 0, w: 7, h: 5 },
      { id: "booth", name: "Voice booth", x: 7, y: 0, w: 5, h: 3 },
      { id: "hall", name: "Hall", x: 7, y: 3, w: 5, h: 2 },
      { id: "kitchen", name: "Kitchen", x: 0, y: 5, w: 5, h: 3 },
      { id: "store", name: "Store room", x: 5, y: 5, w: 7, h: 3 },
    ];
  },
  async devices() {
    return [
      { id: "lamp", name: "Desk lamp", room: "club", icon: "💡", on: true },
      { id: "pcs", name: "PC power", room: "club", icon: "🖥️", on: true },
      { id: "sign", name: "Recording sign", room: "booth", icon: "🔴" },
      { id: "mic", name: "Wireless mic", room: "booth", icon: "🎙️", battery: 64 },
      { id: "lock", name: "Front door lock", room: "hall", icon: "🔒", on: true, battery: 12 },
      { id: "kettle", name: "Kettle", room: "kitchen", icon: "☕" },
      { id: "dry", name: "Dehumidifier", room: "store", icon: "💧", on: true },
    ];
  },
  async scenes(): Promise<Scene[]> {
    return [
      {
        id: "work",
        name: "Work",
        icon: "🎮",
        description: "Lamp and PCs on, door locked",
        sets: { lamp: true, pcs: true, sign: false, lock: true },
      },
      {
        id: "record",
        name: "Record",
        icon: "🎙️",
        description: "Recording sign on, PCs off",
        sets: { sign: true, pcs: false, lamp: true },
      },
      {
        id: "away",
        name: "Away",
        icon: "🌙",
        description: "All off, door locked",
        sets: { lamp: false, pcs: false, sign: false, kettle: false, lock: true },
      },
    ];
  },
  async set() {},
};
