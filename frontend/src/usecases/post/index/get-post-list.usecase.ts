import type { IPostRepository } from "../../../interfaces/repositories/post.repository.interface";
import type { Post } from "../../../types/Post";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";
import {
  createPaginationMeta,
  type PaginatedList,
} from "../../shared/pagination";

export type PostForPostIndex = Pick<Post, "id" | "title" | "publishedAt"> & {
  thumbnailUrl: string;
};

export type DataForPostIndex = PaginatedList<PostForPostIndex>;

export class GetPostListUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(page: number): Promise<DataForPostIndex> {
    const postsPerPage = 9;
    const skip = (page - 1) * postsPerPage;

    // ページネーションで次のページが存在するかチェックするために1件余計に取得する
    const postsPerPageExtra = postsPerPage + 1;

    const posts = await this.postRepository.findMany({
      skip,
      take: postsPerPageExtra,
    });

    const pagination = createPaginationMeta(posts, page, postsPerPage);

    // ページネーションのチェックのために取得した余計なデータを削除する
    if (posts.length > postsPerPage) {
      posts.pop();
    }

    const postsForPostIndex: PostForPostIndex[] = posts
      .map((post) => setThumbnailUrl(post))
      .map((post) => {
        return {
          id: post.id,
          title: post.title,
          publishedAt: post.publishedAt,
          thumbnailUrl: post.thumbnailUrl,
        };
      });

    return {
      items: postsForPostIndex,
      pagination,
    };
  }
}
