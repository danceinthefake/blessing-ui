export interface Profile {
  name: string;
  email: string;
  bio: string;
  lang: string;
  emails: boolean;
  push: boolean;
  digest: boolean;
}

export interface SettingsApi {
  load(): Promise<Profile>;
  save(p: Profile): Promise<void>;
}

/** offline adapter: keeps the profile in memory, with a short wait on save */
let stored: Profile = {
  name: "加藤 恵",
  email: "megumi@example.com",
  bio: "同じクラスの、目立たない女の子。",
  lang: "ja",
  emails: true,
  push: false,
  digest: true,
};
export const mockSettingsApi: SettingsApi = {
  async load() {
    return { ...stored };
  },
  async save(p) {
    await new Promise((r) => setTimeout(r, 500));
    stored = { ...p };
  },
};
