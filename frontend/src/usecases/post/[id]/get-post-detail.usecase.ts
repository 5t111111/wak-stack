import { CategoryNotSetError } from "../../../errors/category-not-set.error";
import { NotFoundError } from "../../../errors/not-found.error";
import type { IPostRepository } from "../../../interfaces/repositories/post.repository.interface";
import type { Author } from "../../../types/Author";
import type { Category } from "../../../types/Category";
import type { Post } from "../../../types/Post";
import type { Series } from "../../../types/Series";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";

export type PostForPostDetail = Pick<
  Post,
  "id" | "title" | "content" | "publishedAt" | "description"
> & {
  content: string;
  thumbnailUrl: string;
  category: Category;
  author: Pick<Author, "id" | "name"> & { thumbnailUrl: string };
  series?: Pick<Series, "id" | "title">;
};

export class GetPostDetailUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<PostForPostDetail> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundError(`Post (id: ${id}) is not found.`);
    }

    // content が string であることを保証する (空文字列は許容する)
    const content = post.content ?? "";

    // thumbnailUrl を設定する
    const postWithThumbnailUrl = setThumbnailUrl(post);

    // category が設定されていない場合は想定外のデータなのでエラー
    if (!postWithThumbnailUrl.category) {
      throw new CategoryNotSetError(`Post (id: ${id}): Category is not set.`);
    }

    // author が設定されていない場合は想定外のデータなのでエラー
    if (!postWithThumbnailUrl.author) {
      throw new Error(`Post (id: ${id}): Author is not set.`);
    }

    // author の thumbnailUrl を設定する
    const authorWithThumbnailUrl = setThumbnailUrl(postWithThumbnailUrl.author);

    return {
      id: postWithThumbnailUrl.id,
      title: postWithThumbnailUrl.title,
      content,
      publishedAt: postWithThumbnailUrl.publishedAt,
      thumbnailUrl: postWithThumbnailUrl.thumbnailUrl,
      description: postWithThumbnailUrl.description,
      category: postWithThumbnailUrl.category,
      author: {
        id: authorWithThumbnailUrl.id,
        name: authorWithThumbnailUrl.name,
        thumbnailUrl: authorWithThumbnailUrl.thumbnailUrl,
      },
      series: postWithThumbnailUrl.series,
    };
  }
}
