import type { Post } from "./Post";

export type Category = {
  id: number;
  name: string;
  slug: string;
  posts?: Post[];
};
