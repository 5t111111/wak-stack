import { NotFoundError } from "~/server/errors/not-found.error.server";
import { ICategoryRepository } from "~/server/interfaces/repositories/category.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Category } from "~/types/Category";
import { Post } from "~/types/Post";

import {
  PaginatedList,
  createPaginationMeta,
} from "../../shared/pagination.server";

export type CategoryForCategoryDetail = Pick<
  Category,
  "id" | "name" | "slug"
> & {
  postList: PaginatedList<
    Pick<Post, "id" | "title" | "publishedAt"> & {
      thumbnailUrl: string;
    }
  >;
};

export class GetCategoryDetailUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(
    slug: string,
    page: number,
  ): Promise<CategoryForCategoryDetail> {
    // 取得する投稿の件数に関する処理
    const itemsPerPage = 9;
    const skip = (page - 1) * itemsPerPage;
    // ページネーションで次のページが存在するかチェックするために1件余計に取得する
    const itemsPerPageExtra = itemsPerPage + 1;

    const category = await this.categoryRepository.findOneBySlug(slug, {
      skip,
      take: itemsPerPageExtra,
    });

    if (!category) {
      throw new NotFoundError(`Category (slug: ${slug}) is not found.`);
    }

    // posts が配列であることを保証する
    const posts = category.posts ?? [];

    const pagination = createPaginationMeta(posts, page, itemsPerPage);

    // ページネーションのチェックのために取得した余計なデータを削除する
    if (posts.length > itemsPerPage) {
      posts.pop();
    }

    // posts の thumbnailUrl を設定する
    const postsWithThumbnailUrl = posts.map((post) => setThumbnailUrl(post));

    return {
      ...category,
      postList: {
        items: postsWithThumbnailUrl,
        pagination,
      },
    };
  }
}
