import { db } from "../db";

/**
 * 著者データのリストを取得するクエリ
 * クエリの結果には以下のデータを含む
 * - id: 著者のID (wp_posts.ID)
 * - name: 著者の名前 (wp_posts.post_title)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const authorListQuery = () => {
  return (
    db
      .selectFrom("wp_posts as authors")

      // サムネイルの取得
      .leftJoin("wp_postmeta as thumbnailMeta", (join) =>
        join
          .onRef("thumbnailMeta.post_id", "=", "authors.ID")
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

      // where
      .where("authors.post_type", "=", "author")
      .where("authors.post_status", "=", "publish")

      // select する対象
      .select([
        "authors.ID as id",
        "authors.post_title as name",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
      ])
  );
};
