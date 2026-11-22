export interface FooterApi {
  /** puts the address on the mailing list; throws with a reason the reader can act on */
  subscribe(email: string): Promise<void>;
}

/** offline adapter — replace with a POST to your mailing-list service */
export const mockFooterApi: FooterApi = {
  async subscribe(email) {
    await new Promise((r) => setTimeout(r, 600));
    if (email.endsWith("@example.com")) throw new Error("This address is already on the list");
  },
};
