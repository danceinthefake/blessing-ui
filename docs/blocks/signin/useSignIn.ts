import { ref } from "vue";
import { mockAuthApi, type AuthApi } from "./api";

export function useSignIn(api: AuthApi = mockAuthApi) {
  const email = ref("");
  const password = ref("");
  const remember = ref(false); // staying signed in is opt-in
  const busy = ref(false);
  const error = ref("");
  const done = ref(false);
  async function submit() {
    busy.value = true;
    error.value = "";
    try {
      await api.signIn(email.value, password.value);
      done.value = true;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      busy.value = false;
    }
  }
  return { email, password, remember, busy, error, done, submit };
}
