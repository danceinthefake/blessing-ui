import { onMounted, ref } from "vue";
import type { BlessNewPost, BlessTrend } from "blessing-ui";
import { toPost, type Author, type Person, type Post } from "./domain";
import type { CommunityApi } from "./api";

/** the feed, the side lists, and the actions; the api is the only way out */
export function useCommunity(api: CommunityApi, me: Author) {
  const posts = ref<Post[]>([]);
  const trends = ref<BlessTrend[]>([]);
  const people = ref<Person[]>([]);
  const draft = ref("");
  onMounted(async () => {
    [posts.value, trends.value, people.value] = await Promise.all([
      api.feed(),
      api.trends(),
      api.people(),
    ]);
  });
  async function publish(p: BlessNewPost) {
    const post = toPost(p, me, Math.max(0, ...posts.value.map((x) => x.id)) + 1);
    posts.value.unshift(post);
    draft.value = "";
    await api.publish(post);
  }
  // the server counts the vote; the mock adds it here so the bars move
  async function vote(post: Post, option: string) {
    const o = post.poll?.options.find((x) => x.value === option);
    if (o) o.votes++;
    await api.vote(post.id, option);
  }
  return { posts, trends, people, draft, publish, vote };
}
