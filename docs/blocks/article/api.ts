import type { Article } from "./domain";

export interface ArticleApi {
  article(slug: string): Promise<Article>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** offline adapter — replace with calls to your content service */
export const mockArticleApi: ArticleApi = {
  async article() {
    await wait(150);
    return {
      title: "From the hill to the cup: a year with a small tea garden",
      topic: "Suppliers",
      summary:
        "We buy our jasmine tea from one garden in West Java. This is what we learned about the harvest, the price, and the people.",
      author: "Sari Lestari",
      date: "2026-11-20",
      blocks: [
        {
          type: "p",
          text: "A year ago, we bought our tea from a trader in Jakarta. The tea was good, but we did not know where it came from. Each month, the price moved, and nobody could tell us why. We wanted to know the people who grow it, so we went to look for a garden.",
        },
        { type: "h2", text: "Finding the garden" },
        {
          type: "p",
          text: "We visited six gardens in three months. Most of them sell only to large factories, and a shop of our size is too small for them. The seventh garden, near Bandung, was different. Dewi runs it with her two brothers, and they grow tea on 4 hectares[^A hectare is 10,000 square metres, about the size of a football field and a half.] of steep land.",
        },
        {
          type: "p",
          text: "Dewi asked us more questions than we asked her. She wanted to know how we store the tea, who buys it, and how fast it sells. At the end of the day she said yes, but only if we came back for the harvest.",
        },
        {
          type: "quote",
          text: "A buyer who sees the harvest does not argue about the price.",
          speaker: "Dewi Kartika",
        },
        { type: "h2", text: "The harvest" },
        {
          type: "p",
          text: "The pickers start at six in the morning, before the sun dries the leaves. They take only the bud and the two leaves under it[^Tea people call this the fine pluck. A coarse pluck takes more leaves and gives a stronger, flatter tea.]. A good picker fills a basket in two hours. By ten, the leaves are on long racks in the shade, where they wilt until the evening.",
        },
        {
          type: "p",
          text: "For jasmine tea, the work goes on at night. The jasmine flowers open after dark, so the garden puts fresh flowers on the dry tea at eight in the evening and takes them off at dawn. They do this five times for our tea. Cheaper jasmine tea gets one night, or a flavour from a bottle.",
        },
        { type: "h3", text: "What the weather does" },
        {
          type: "p",
          text: "This year the rain came late, and the harvest was early. That is why our December tea is ready in November. A wet year gives more leaves but a weaker taste. A dry year gives fewer leaves, and the price goes up[^In 2025, a dry year, the garden picked about 30 percent less than in 2024.].",
        },
        { type: "h2", text: "The price" },
        {
          type: "p",
          text: "We now pay the garden a fixed price for the whole year, and we agree on it after the first harvest. In a good year the garden earns a little less than on the open market. In a bad year it earns more. Dewi likes this, because she can pay the pickers the same wage each month.",
        },
        {
          type: "p",
          text: "Our price in the shop went up by 8 percent. We wrote to our customers to tell them why, and only three of them wrote back to complain. Two of them now buy the gift box.",
        },
        { type: "h2", text: "What comes next" },
        {
          type: "p",
          text: "Next year we want to buy oolong from the same garden. Dewi has never made oolong, so her brother will spend a month at a garden in Taiwan to learn[^We pay half of the trip. The garden pays the other half.]. If it works, the first oolong from the hill will be in the shop in the spring.",
        },
      ],
      related: [
        { id: "r1", title: "How we price a tea bundle", href: "#", topic: "Prices", minutes: 3 },
        {
          id: "r2",
          title: "Packing that does not break",
          href: "#",
          topic: "Shipping",
          minutes: 4,
        },
        { id: "r3", title: "Our first hire", href: "#", topic: "Team", minutes: 5 },
      ],
    };
  },
};
