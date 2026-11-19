import type { BlessPalette } from "blessing-ui";

export interface Workspace {
  name: string;
  invites: string[];
  palette: BlessPalette;
}

export interface OnboardingApi {
  /** makes the workspace and sends the invites */
  create(w: Workspace): Promise<void>;
}

/** offline adapter: a short wait, so the button shows that it works */
export const mockOnboardingApi: OnboardingApi = {
  async create() {
    await new Promise((r) => setTimeout(r, 600));
  },
};
