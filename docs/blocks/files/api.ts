import type { Node } from "./domain";

export interface FilesApi {
  list(): Promise<Node[]>;
  /** stores the file in `parent`; `progress` takes 0 to 100 */
  upload(parent: string, file: File, progress: (n: number) => void): Promise<Node>;
  rename(id: string, name: string): Promise<void>;
  remove(ids: string[]): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MB = 1024 * 1024;

/** offline adapter — replace with calls to your storage service */
export const mockFilesApi: FilesApi = {
  async list() {
    return [
      { id: "f1", name: "Covers", parent: "root", folder: true, modified: "2026-11-20" },
      { id: "f2", name: "Sketches", parent: "root", folder: true, modified: "2026-11-21" },
      { id: "f3", name: "Contracts", parent: "root", folder: true, modified: "2026-10-02" },
      { id: "a", name: "brief.pdf", parent: "root", size: 1.2 * MB, modified: "2026-11-18" },
      { id: "b", name: "budget.xlsx", parent: "root", size: 0.3 * MB, modified: "2026-11-12" },
      { id: "c", name: "spring-cover.png", parent: "f1", size: 8.4 * MB, modified: "2026-03-01" },
      { id: "d", name: "summer-cover.png", parent: "f1", size: 9.1 * MB, modified: "2026-06-15" },
      { id: "e", name: "rain-study.jpg", parent: "f2", size: 2.2 * MB, modified: "2026-11-21" },
      { id: "g", name: "hanamichi-2026.pdf", parent: "f3", size: 0.4 * MB, modified: "2026-10-02" },
    ];
  },
  async upload(parent, file, progress) {
    for (let p = 20; p <= 100; p += 20) {
      await wait(120);
      progress(p);
    }
    if (file.size > 50 * MB) throw new Error("Files over 50 MB need the desktop app");
    return {
      id: `u${Date.now()}${file.name}`,
      name: file.name,
      parent,
      size: file.size,
      modified: new Date().toISOString().slice(0, 10),
    };
  },
  async rename() {
    await wait(200);
  },
  async remove() {
    await wait(300);
  },
};
