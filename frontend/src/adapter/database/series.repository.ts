import { unserialize } from "php-serialize";
import type { ISeriesRepository } from "../../interfaces/repositories/series.repository.interface";
import type { Author } from "../../types/Author";
import type { Post } from "../../types/Post";
import type { Series } from "../../types/Series";
import { isNumber } from "../../utils/is-number";
import { authorMinimumQuery } from "./queries/author-minimum.query";
import { getPostsByIdsQuery } from "./queries/get-posts-by-ids.query";
import { seriesDetailQuery } from "./queries/series-detail.query";
import { seriesListWithThumbnailQuery } from "./queries/series-list.query";

export class SeriesRepository implements ISeriesRepository {
  async findMany(): Promise<Series[]> {
    const seriesData = await seriesListWithThumbnailQuery().execute();

    return seriesData.map((data) => {
      let postCount = 0;

      if (data.postsMeta) {
        try {
          const postsData = unserialize(data.postsMeta);
          postCount = postsData.length;
        } catch (e) {
          console.error(`Failed to unserialize postsMeta: ${e}`);
        }
      }

      return {
        id: data.id,
        title: data.title,
        thumbnailPath: data.thumbnailPath || undefined,
        postCount,
      };
    });
  }

  async findOne(id: number): Promise<Series | null> {
    const seriesQueryResult = await seriesDetailQuery(id).execute();

    if (seriesQueryResult.length === 0) {
      return null;
    }

    const seriesData = seriesQueryResult[0];

    // 連載に含まれる投稿を取得
    // まずクエリするための ID のリストを取得
    let postIds: number[] = [];

    if (seriesData.postsMeta) {
      let postIdStrings: string[] = [];

      try {
        postIdStrings = unserialize(seriesData.postsMeta);
      } catch (e) {
        console.error(`Failed to unserialize postsMeta: ${e}`);
      }

      if (postIdStrings.length > 0) {
        postIds = postIdStrings
          .filter((id) => {
            // 不正な値を除外
            return isNumber(id);
          })
          .map((id) => {
            return parseInt(id, 10);
          });
      }
    }

    // 取得した ID のリストを使って投稿をクエリ
    const postsData = await getPostsByIdsQuery(postIds).execute();

    // 投稿データを Post オブジェクトに変換
    const posts = postsData.map(
      (postData): Post => ({
        id: postData.id,
        title: postData.title,
        publishedAt: postData.publishedAt,
        modifiedAt: postData.modifiedAt,
        thumbnailPath: postData.thumbnailPath || undefined,
      }),
    );

    // 著者を取得して Author オブジェクトを生成
    let author: Author | undefined = undefined;

    if (seriesData.authorMeta) {
      let authorIds: string[] = [];

      try {
        authorIds = unserialize(seriesData.authorMeta);
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

    return {
      id: seriesData.id,
      title: seriesData.title,
      thumbnailPath: seriesData.thumbnailPath || undefined,
      description: seriesData.descriptionMeta || undefined, // プレーンテキストなのでそのままセット
      posts,
      author,
    };
  }
}
