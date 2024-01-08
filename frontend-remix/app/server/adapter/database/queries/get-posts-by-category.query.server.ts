import { db } from "../db.server";

/**
 * Slug で指定したカテゴリーに属する投稿リスト (サムネイル付きの) を取得するクエリ
 * オフセットベースのページネーションをサポートしている
 * (次のページが存在するかチェックしたい場合は、1件多く取得して取得側でチェック後に削除すること)
 *
 * クエリの結果には以下のデータを含む
 * - id: 投稿のID (wp_posts.ID)
 * - title: 投稿のタイトル (wp_posts.post_title)
 * - publishedAt: 投稿の作成日時 (wp_posts.post_date)
 * - modifiedAt: 投稿の更新日時 (wp_posts.post_modified)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * @param categorySlug
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const getPostsByCategoryQuery = (
  categorySlug: string,
  limit?: number,
  offset?: number,
) => {
  // 無制限に取得してしまって障害にならないように、デフォルトの limit を 100 件に制限しておく
  const limitNumber = limit ?? 100;

  const intermediateQuery1 = db
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

    // カテゴリーの取得
    // カテゴリーは1つのみ設定されていることを前提とする
    .leftJoin(
      "wp_term_relationships as termRelationships",
      "termRelationships.object_id",
      "posts.ID",
    )
    .leftJoin("wp_term_taxonomy as termTaxonomy", (join) =>
      join
        .onRef(
          "termTaxonomy.term_taxonomy_id",
          "=",
          "termRelationships.term_taxonomy_id",
        )
        .on("termTaxonomy.taxonomy", "=", "category"),
    )
    .leftJoin("wp_terms as terms", "terms.term_id", "termTaxonomy.term_id")

    // where
    .where("posts.post_type", "=", "post")
    .where("posts.post_status", "=", "publish")
    .where("terms.slug", "=", categorySlug)

    // order by
    .orderBy("posts.post_date", "desc")

    // limit
    .limit(limitNumber);

  const intermediateQuery2 = offset
    ? intermediateQuery1.offset(offset)
    : intermediateQuery1;

  return (
    intermediateQuery2
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
