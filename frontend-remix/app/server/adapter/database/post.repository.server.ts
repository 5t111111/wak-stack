import { unserialize } from "php-serialize";
import {
  IPostRepository,
  PostFindManyOptions,
} from "~/server/interfaces/repositories/post.repository.interface.server";
import { Author } from "~/types/Author";
import { Category } from "~/types/Category";
import { Post } from "~/types/Post";
import { Series } from "~/types/Series";

import { authorMinimumQuery } from "./queries/author-minimum.query.server";
import { postDetailQuery } from "./queries/post-detail.query.server";
import { postListQuery } from "./queries/post-list.query.server";

export class PostRepository implements IPostRepository {
  async findMany(options?: PostFindManyOptions): Promise<Post[]> {
    const postsData = await postListQuery(
      options?.take,
      options?.skip,
    ).execute();

    return postsData.map(
      (postData): Post => ({
        id: postData.id,
        title: postData.title,
        publishedAt: postData.publishedAt,
        modifiedAt: postData.modifiedAt,
        thumbnailPath: postData.thumbnailPath || undefined,
      }),
    );
  }

  async findOne(id: number): Promise<Post | null> {
    const postsData = await postDetailQuery(id).execute();

    if (postsData.length === 0) {
      return null;
    }

    const postData = postsData[0];

    // Category オブジェクトを生成
    const category: Category | undefined =
      postData.categoryId && postData.categoryName && postData.categorySlug
        ? {
            id: postData.categoryId,
            name: postData.categoryName,
            slug: postData.categorySlug,
          }
        : undefined;

    // Author オブジェクトを生成
    let author: Author | undefined = undefined;

    if (postData.authorMeta) {
      let authorIds: string[] = [];

      try {
        authorIds = unserialize(postData.authorMeta);
      } catch (e) {
        console.error(`Failed to unserialize authorMeta: ${e}`);
      }

      if (authorIds.length > 0) {
        const authorId = parseInt(authorIds[0], 10);
        const authorQueryResult = await authorMinimumQuery(authorId).execute();

        if (authorQueryResult.length > 0) {
          author = {
            id: authorQueryResult[0].id,
            name: authorQueryResult[0].name,
            thumbnailPath: authorQueryResult[0].thumbnailPath || undefined,
          };
        }
      }
    }

    // Series オブジェクトを生成
    const series: Series | undefined =
      postData.seriesId && postData.seriesTitle
        ? {
            id: postData.seriesId,
            title: postData.seriesTitle,
          }
        : undefined;

    return {
      id: postData.id,
      title: postData.title,
      content: postData.content !== "" ? postData.content : undefined,
      publishedAt: postData.publishedAt,
      modifiedAt: postData.modifiedAt,
      thumbnailPath: postData.thumbnailPath || undefined,
      description: postData.descriptionMeta || undefined, // プレーンテキストなのでそのままセット
      category,
      author,
      series,
    };
  }
}
