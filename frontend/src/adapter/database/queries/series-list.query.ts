import { db } from "../db";

/**
 * 連載データリストを取得するクエリ
 * クエリの結果には以下のデータを含む
 * - id: 連載のID (wp_posts.ID)
 * - title: 連載のタイトル (wp_posts.post_title)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * - postsMeta: 連載に含まれる投稿 (ACF の posts フィールド)。連載に含まれる件数の取得に利用する。PHP オブジェクトで格納されている前提
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const seriesListWithThumbnailQuery = () => {
  // 無制限に取得してしまって障害にならないように、デフォルトの limit を 100 件に制限しておく
  const limitNumber = 100;

  return (
    db
      .selectFrom("wp_posts as series")

      // サムネイルの取得
      .leftJoin("wp_postmeta as thumbnailMeta", (join) =>
        join
          .onRef("thumbnailMeta.post_id", "=", "series.ID")
          .on("thumbnailMeta.meta_key", "=", "_thumbnail_id"),
      )
      .leftJoin(
        "wp_posts as thumbnailPosts",
        "thumbnailPosts.ID",
        "thumbnailMeta.meta_value",
      )
      .leftJoin("wp_postmeta as thumbnailAttachedFileMeta", (join) =>
        join
          .onRef("thumbnailAttachedFileMeta.post_id", "=", "thumbnailPosts.ID")
          .on("thumbnailAttachedFileMeta.meta_key", "=", "_wp_attached_file"),
      )

      // 連載に含まれる投稿件数を取得するために ACF posts フィールドを取得
      .leftJoin("wp_postmeta as postsMeta", (join) =>
        join
          .onRef("postsMeta.post_id", "=", "series.ID")
          .on("postsMeta.meta_key", "=", "series_posts"),
      )

      // where
      .where("series.post_type", "=", "series")
      .where("series.post_status", "=", "publish")

      // order by
      .orderBy("series.post_date", "desc")

      // limit
      .limit(limitNumber)

      // select する対象
      .select([
        "series.ID as id",
        "series.post_title as title",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
        "postsMeta.meta_value as postsMeta",
      ])
  );
};
