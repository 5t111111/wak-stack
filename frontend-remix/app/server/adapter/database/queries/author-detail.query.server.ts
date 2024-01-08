import { db } from "../db.server";

/**
 * 著者に必要な詳細データを取得するクエリ
 * 引数の ID で指定した1件の投稿のデータを取得する
 * クエリの結果には以下のデータを含む
 * - id: 投稿のID (wp_posts.ID)
 * - name: 著者の名前 (wp_posts.post_title)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * - profileMeta: 著者のプロフィール (ACF の profile フィールド) テキストで格納されている前提
 * @param id
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const authorDetailQuery = (id: number) => {
  return (
    db
      .selectFrom("wp_posts as posts")

      // サムネイルの取得
      .leftJoin("wp_postmeta as thumbnailMeta", (join) =>
        join
          .onRef("thumbnailMeta.post_id", "=", "posts.ID")
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

      // ACF の profile フィールドの取得。
      // profile にはテキストがそのまま入っていることを前提とする
      .leftJoin("wp_postmeta as profileMeta", (join) =>
        join
          .onRef("profileMeta.post_id", "=", "posts.ID")
          .on("profileMeta.meta_key", "=", "author_profile"),
      )

      // where
      .where("posts.ID", "=", id)
      .where("posts.post_type", "=", "author")
      .where("posts.post_status", "=", "publish")

      // select する対象
      .select([
        "posts.ID as id",
        "posts.post_title as name",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
        "profileMeta.meta_value as profileMeta",
      ])
  );
};
