import { db } from "../db.server";

/**
 * ID のリストでで投稿リスト (サムネイル付きの) を取得するクエリ
 * クエリの結果には以下のデータを含む
 * - id: 投稿のID (wp_posts.ID)
 * - title: 投稿のタイトル (wp_posts.post_title)
 * - publishedAt: 投稿の作成日時 (wp_posts.post_date)
 * - modifiedAt: 投稿の更新日時 (wp_posts.post_modified)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * @param ids
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const getPostsByIdsQuery = (ids: number[]) => {
  // 無制限に取得してしまって障害にならないように、デフォルトの limit を 100 件に制限しておく
  const limitNumber = 100;

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

      // where
      .where("posts.post_type", "=", "post")
      .where("posts.post_status", "=", "publish")
      .where("posts.ID", "in", ids)

      // order by
      .orderBy("posts.post_date", "desc")

      .limit(limitNumber)

      // select する対象
      .select([
        "posts.ID as id",
        "posts.post_title as title",
        "posts.post_date as publishedAt",
        "posts.post_modified as modifiedAt",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
      ])
  );
};
