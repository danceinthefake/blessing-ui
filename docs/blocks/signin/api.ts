export interface AuthApi {
  signIn(email: string, password: string): Promise<{ token: string }>;
}

/** offline adapter — any password but "wrong" succeeds */
export const mockAuthApi: AuthApi = {
  async signIn(_email, password) {
    await new Promise((r) => setTimeout(r, 600));
    if (password === "wrong") throw new Error("Email or password is incorrect.");
    return { token: "demo" };
  },
};
