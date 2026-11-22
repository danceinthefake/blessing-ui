import { computed, onMounted, ref } from "vue";
import type { BlessAchievement, BlessActivity, BlessWork } from "blessing-ui";
import type { Profile, ProfileApi } from "./api";

/** a profile with its tabs, and Follow that shows at once and undoes itself when the server refuses */
export function useProfile(api: ProfileApi, handle: string) {
  const profile = ref<Profile>();
  const works = ref<BlessWork[]>([]);
  const activity = ref<BlessActivity[]>([]);
  const achievements = ref<BlessAchievement[]>([]);
  const contributions = ref<Record<string, number>>({});
  onMounted(async () => {
    [profile.value, works.value, activity.value, achievements.value, contributions.value] =
      await Promise.all([
        api.profile(handle),
        api.works(handle),
        api.activity(handle),
        api.achievements(handle),
        api.contributions(handle),
      ]);
  });

  const following = computed({
    get: () => !!profile.value?.followedByMe,
    set: (on) => void follow(on),
  });
  const error = ref("");
  async function follow(on: boolean) {
    const p = profile.value!;
    error.value = "";
    p.followedByMe = on;
    p.followers += on ? 1 : -1;
    try {
      await api.follow(handle, on);
    } catch {
      p.followedByMe = !on;
      p.followers += on ? -1 : 1;
      error.value = on
        ? `Could not follow ${p.name}. Try again.`
        : `Could not unfollow ${p.name}. Try again.`;
    }
  }
  const stats = computed(() =>
    profile.value
      ? [
          { label: "Works", value: profile.value.works },
          { label: "Followers", value: profile.value.followers },
          { label: "Following", value: profile.value.following },
        ]
      : [],
  );

  return { profile, works, activity, achievements, contributions, following, error, stats };
}
