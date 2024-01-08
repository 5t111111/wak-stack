import type { Post } from "./Post";

export type Author = {
  id: number;
  name: string;
  profile?: string;
  thumbnailPath?: string;
  posts?: Post[];
};
