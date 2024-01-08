import { db } from "../db";

/**
 * 連載に必要な詳細データを取得するクエリ
 * 引数の ID で指定した1件の連載のデータを取得する
 * クエリの結果には以下のデータを含む
 * - id: 連載のID (wp_posts.ID)
 * - title: 連載のタイトル (wp_posts.post_title)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * - postsMeta: 連載に含まれる投稿 (ACF の posts フィールド)。PHP オブジェクトで格納されている前提
 * - descriptionMeta: 連載の説明 (ACF の description フィールド) テキストで格納されている前提
 * - authorMeta: 連載の著者 (ACF の author フィールド) PHP オブジェクトで格納されている前提
 * @param id
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const seriesDetailQuery = (id: number) => {
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

      // 連載に含まれる投稿を取得するために ACF posts フィールドを取得
      // posts は関連フィールドのため シリアライズされた PHP オブジェクトなので、
      // 取得後に unserialize する必要がある
      .leftJoin("wp_postmeta as postsMeta", (join) =>
        join
          .onRef("postsMeta.post_id", "=", "series.ID")
          .on("postsMeta.meta_key", "=", "series_posts"),
      )

      // ACF の description フィールドの取得。
      // description にはテキストがそのまま入っていることを前提とする
      .leftJoin("wp_postmeta as descriptionMeta", (join) =>
        join
          .onRef("descriptionMeta.post_id", "=", "series.ID")
          .on("descriptionMeta.meta_key", "=", "series_description"),
      )

      // ACF の author フィールドの取得。
      // author は関連フィールドのため シリアライズされた PHP オブジェクトなので、
      // 取得後に unserialize する必要がある
      .leftJoin("wp_postmeta as authorMeta", (join) =>
        join
          .onRef("authorMeta.post_id", "=", "series.ID")
          .on("authorMeta.meta_key", "=", "series_author"),
      )

      // where
      .where("series.ID", "=", id)
      .where("series.post_type", "=", "series")
      .where("series.post_status", "=", "publish")

      // select する対象
      .select([
        "series.ID as id",
        "series.post_title as title",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
        "postsMeta.meta_value as postsMeta",
        "descriptionMeta.meta_value as descriptionMeta",
        "authorMeta.meta_value as authorMeta",
      ])
  );
};
