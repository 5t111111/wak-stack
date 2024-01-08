import { CategoryNotSetError } from "~/server/errors/category-not-set.error.server";
import { NotFoundError } from "~/server/errors/not-found.error.server";
import { IPostRepository } from "~/server/interfaces/repositories/post.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Author } from "~/types/Author";
import { Category } from "~/types/Category";
import { Post } from "~/types/Post";
import { Series } from "~/types/Series";

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
