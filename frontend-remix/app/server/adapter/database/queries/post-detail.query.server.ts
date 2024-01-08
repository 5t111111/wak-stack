import { db } from "../db.server";

/**
 * 投稿に必要な詳細データを取得するクエリ
 * 引数の ID で指定した1件の投稿のデータを取得する
 * クエリの結果には以下のデータを含む
 * - id: 投稿のID (wp_posts.ID)
 * - title: 投稿のタイトル (wp_posts.post_title)
 * - content: 投稿の本文 (wp_posts.post_content)
 * - publishedAt: 投稿の作成日時 (wp_posts.post_date)
 * - modifiedAt: 投稿の更新日時 (wp_posts.post_modified)
 * - thumbnailPath: サムネイルのパス (JOIN して wp_postmeta の _wp_attached_file から取得したもの)
 * - descriptionMeta: 投稿の説明 (ACF の description フィールド) テキストで格納されている前提
 * - categoryId: カテゴリーのID (wp_terms.term_id)
 * - categoryName: カテゴリーの名前 (wp_terms.name)
 * - categorySlug: カテゴリーのスラッグ (wp_terms.slug)
 * - authorMeta: 投稿の著者 (ACF の author フィールド) PHP オブジェクトで格納されている前提
 * - seriesId: 投稿が含まれる連載の ID (wp_posts.ID)
 * - seriesTitle: 投稿が含まれる連載のタイトル (wp_posts.post_title)
 * @param id
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const postDetailQuery = (id: number) => {
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

      // ACF の description フィールドの取得。
      // description にはテキストがそのまま入っていることを前提とする
      .leftJoin("wp_postmeta as descriptionMeta", (join) =>
        join
          .onRef("descriptionMeta.post_id", "=", "posts.ID")
          .on("descriptionMeta.meta_key", "=", "post_description"),
      )

      // ACF の author フィールドの取得。
      // author は関連フィールドのため シリアライズされた PHP オブジェクトなので、
      // 取得後に unserialize する必要がある
      .leftJoin("wp_postmeta as authorMeta", (join) =>
        join
          .onRef("authorMeta.post_id", "=", "posts.ID")
          .on("authorMeta.meta_key", "=", "post_author"),
      )

      // 投稿が含まれる連載を取得
      .leftJoin("wp_postmeta as seriesMeta", (join) =>
        join
          .on("seriesMeta.meta_key", "=", "series_posts")
          .on("seriesMeta.meta_value", "like", `%"${id}"%`),
      )
      .leftJoin(
        "wp_posts as seriesPosts",
        "seriesPosts.ID",
        "seriesMeta.post_id",
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
      .where("posts.ID", "=", id)
      .where("posts.post_type", "=", "post")
      .where("posts.post_status", "=", "publish")

      // select する対象
      .select([
        "posts.ID as id",
        "posts.post_title as title",
        "posts.post_content as content",
        "posts.post_date as publishedAt",
        "posts.post_modified as modifiedAt",
        "thumbnailAttachedFileMeta.meta_value as thumbnailPath",
        "descriptionMeta.meta_value as descriptionMeta",
        "authorMeta.meta_value as authorMeta",
        "terms.term_id as categoryId",
        "terms.name as categoryName",
        "terms.slug as categorySlug",
        "seriesPosts.ID as seriesId",
        "seriesPosts.post_title as seriesTitle",
      ])
  );
};
