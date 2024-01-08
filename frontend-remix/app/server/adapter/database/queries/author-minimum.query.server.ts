import { db } from "../db.server";

/**
 * 著者の最小限のデータを取得するクエリ
 * 引数の ID で指定した1件の投稿のデータを取得する
 * クエリの結果には以下のデータを含む
 * - id: 著者のID (wp_posts.ID)
 * - name: 著者の名前 (wp_posts.post_title)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * @param id
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const authorMinimumQuery = (id: number) => {
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
      .where("authors.ID", "=", id)

      // select する対象
      .select([
        "authors.ID as id",
        "authors.post_title as name",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
      ])
  );
};
