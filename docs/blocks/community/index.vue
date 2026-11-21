<template>
  <div class="community">
    <aside class="community__me" aria-label="You">
      <BlessProfileCard
        :name="me.name"
        :handle="me.handle"
        bio="Producer, Blessing Software. Making the game that makes her the main heroine."
        :stats
      />
      <BlessGroupCard
        v-model="circle"
        name="Blessing Software"
        href="#circle"
        description="The circle: script, art, music, and one very loud producer."
        :members="5"
        :faces="[
          { name: 'Megumi Kato' },
          { name: 'Eriri Spencer Sawamura' },
          { name: 'Utaha Kasumigaoka' },
        ]"
        private
      />
    </aside>

    <main class="community__feed">
      <BlessPostComposer v-model="draft" :author="me" @post="publish" />
      <ul role="list" class="community__posts bless-stagger" aria-label="Feed">
        <li v-for="p in posts" :key="p.id">
          <BlessCard as="article" bordered>
            <header class="community__head">
              <BlessAvatar :name="p.author.name" size="sm" />
              <div>
                <BlessText as="h3" size="sm" weight="bold">{{ p.author.name }}</BlessText>
                <BlessText as="p" size="xs" muted>{{ p.author.handle }} · {{ p.time }}</BlessText>
              </div>
            </header>
            <BlessText v-if="!p.poll" as="p" size="sm" class="community__text">{{
              p.text
            }}</BlessText>
            <BlessPoll
              v-else
              v-model="p.poll.voted"
              :question="p.text"
              :options="p.poll.options"
              @vote="(v) => vote(p, v)"
            />
            <template #footer>
              <BlessReactions v-model="p.reactions" :max="3" />
            </template>
          </BlessCard>
        </li>
      </ul>
    </main>

    <aside class="community__side" aria-label="Discover">
      <BlessTrendList :trends />
      <section class="community__people" aria-labelledby="community-follow">
        <BlessText id="community-follow" as="h2" size="sm" weight="bold">Who to follow</BlessText>
        <ul role="list">
          <li v-for="u in people" :key="u.handle">
            <BlessAvatar :name="u.name" size="sm" />
            <span class="community__who">
              <BlessText size="sm" weight="bold">{{ u.name }}</BlessText>
              <BlessText as="p" size="xs" muted>{{ u.handle }}</BlessText>
            </span>
            <BlessFollowButton v-model="u.following" :name="u.name" />
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import {
  BlessAvatar,
  BlessCard,
  BlessFollowButton,
  BlessGroupCard,
  BlessPoll,
  BlessPostComposer,
  BlessProfileCard,
  BlessReactions,
  BlessText,
  BlessTrendList,
  type BlessGroupState,
} from "blessing-ui";
import { ref } from "vue";
import { mockCommunityApi } from "./api";
import { useCommunity } from "./useCommunity";

const me = { name: "Tomoya Aki", handle: "@tomoya" };
const { posts, trends, people, draft, publish, vote } = useCommunity(mockCommunityApi, me);
const circle = ref<BlessGroupState>("member");
const stats = [
  { label: "followers", value: 1204 },
  { label: "following", value: 87 },
  { label: "posts", value: 342 },
];
</script>

<style scoped>
.community {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr) minmax(220px, 1fr);
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  align-items: start;
}
.community__me,
.community__side,
.community__feed {
  display: grid;
  gap: var(--bless-space-4);
  min-width: 0;
}
.community__posts {
  display: grid;
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.community__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  margin-bottom: var(--bless-space-3);
}
.community__head :deep(h3),
.community__head p {
  margin: 0;
}
.community__text {
  margin: 0;
  line-height: var(--bless-leading-normal);
}
.community__people ul {
  display: grid;
  gap: var(--bless-space-3);
  margin: var(--bless-space-3) 0 0;
  padding: 0;
  list-style: none;
}
.community__people li {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.community__people h2,
.community__who p {
  margin: 0;
}
.community__who {
  flex: 1;
  min-width: 0;
}
@media (max-width: 1000px) {
  .community {
    grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
  }
  .community__me {
    grid-column: 2;
    grid-row: 1;
  }
  .community__side {
    grid-column: 2;
  }
  .community__feed {
    grid-row: 1 / span 2;
  }
}
@media (max-width: 700px) {
  .community {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--bless-space-4);
  }
  .community__me,
  .community__side,
  .community__feed {
    grid-column: 1;
    grid-row: auto;
  }
  .community__me {
    order: 2;
  }
  .community__side {
    order: 3;
  }
}
</style>
