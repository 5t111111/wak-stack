import type { Author } from "./Author";
import type { Category } from "./Category";
import type { Series } from "./Series";

export type Post = {
  id: number;
  title: string;
  content?: string;
  publishedAt: Date;
  modifiedAt: Date;
  thumbnailPath?: string;
  description?: string;
  category?: Category;
  author?: Author;
  series?: Series;
};
