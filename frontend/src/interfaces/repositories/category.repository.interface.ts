import type { Category } from "../../types/Category";

export type CategoryFindOneBySlugOptions = {
  skip?: number;
  take?: number;
};

export interface ICategoryRepository {
  findOneBySlug(
    slug: string,
    options?: CategoryFindOneBySlugOptions,
  ): Promise<Category | null>;
}
