import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const projectCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sourceUrl: z.string(),
    liveUrl: z.string(),
  }),
});
export const collections = {
  blog: blogCollection,
  project: projectCollection,
};
