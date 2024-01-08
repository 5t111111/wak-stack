import type { IAuthorRepository } from "../../interfaces/repositories/author.repository.interface";
import type { Author } from "../../types/Author";
import type { Post } from "../../types/Post";
import { authorDetailQuery } from "./queries/author-detail.query";
import { authorListQuery } from "./queries/author-list.query";
import { getPostsByAuthorQuery } from "./queries/get-posts-by-author.query";

export class AuthorRepository implements IAuthorRepository {
  async findMany(): Promise<Author[]> {
    const authorsData = await authorListQuery().execute();

    return authorsData.map((authorData) => ({
      id: authorData.id,
      name: authorData.name,
      thumbnailPath: authorData.thumbnailPath || undefined,
    }));
  }

  async findOne(id: number): Promise<Author | null> {
    const authorsData = await authorDetailQuery(id).execute();

    if (authorsData.length === 0) {
      return null;
    }

    const authorData = authorsData[0];

    // 著者に紐づく投稿を取得
    const postsData = await getPostsByAuthorQuery(id).execute();

    // JOIN して取得しているので不正な状態のデータが混ざっている可能性があるので、
    // チェックして不正なものは除外する
    const validPostsData = postsData.filter((postData) => {
      return (
        postData.id &&
        postData.title &&
        postData.publishedAt &&
        postData.modifiedAt
      );
    });

    // 投稿データを Post オブジェクトに変換
    const posts: Post[] = validPostsData.map((postData) => ({
      id: postData.id!,
      title: postData.title!,
      publishedAt: postData.publishedAt!,
      modifiedAt: postData.modifiedAt!,
      thumbnailPath: postData.thumbnailPath || undefined,
    }));

    return {
      id: authorData.id,
      name: authorData.name,
      thumbnailPath: authorData.thumbnailPath || undefined,
      // profile はプレーンテキストが入っているそのままセット
      profile: authorData.profileMeta || undefined,
      posts,
    };
  }
}
