import { type Author } from "./Author";
import { type Post } from "./Post";

export type Series = {
  id: number;
  title: string;
  description?: string;
  thumbnailPath?: string;
  posts?: Post[];
  postCount?: number;
  author?: Author;
};
