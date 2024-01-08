import type { Category } from "../../../types/Category";
import type { Post } from "../../../types/Post";
import type {
  CategoryFindOneBySlugOptions,
  ICategoryRepository,
} from "../../interfaces/repositories/category.repository.interface.server";
import { categoryQuery } from "./queries/category.query.server";
import { getPostsByCategoryQuery } from "./queries/get-posts-by-category.query.server";

export class CategoryRepository implements ICategoryRepository {
  async findOneBySlug(
    slug: string,
    options?: CategoryFindOneBySlugOptions,
  ): Promise<Category | null> {
    const categoriesData = await categoryQuery(slug).execute();

    if (categoriesData.length === 0) {
      return null;
    }

    const categoryData = categoriesData[0];

    const postsData = await getPostsByCategoryQuery(
      slug,
      options?.take,
      options?.skip,
    ).execute();

    // Post オブジェクトに変換
    const posts: Post[] = postsData.map((postData) => ({
      id: postData.id!,
      title: postData.title!,
      publishedAt: postData.publishedAt!,
      modifiedAt: postData.modifiedAt!,
      thumbnailPath: postData.thumbnailPath || undefined,
    }));

    return {
      id: categoryData.id,
      name: categoryData.name,
      slug: categoryData.slug,
      posts,
    };
  }
}
