import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const projectCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx,yaml}",
    base: "./src/content/project",
  }),
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
