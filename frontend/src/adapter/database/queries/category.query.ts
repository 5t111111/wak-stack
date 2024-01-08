import { db } from "../db";

/**
 * カテゴリーデータを取得するクエリ
 * 引数の slug で指定した1件の投稿のデータを取得する
 * クエリの結果には以下のデータを含む
 * - id: カテゴリーのID (wp_terms.term_id)
 * - name: 著者の名前 (wp_terms.name)
 * - slug: カテゴリーのスラッグ (wp_terms.slug)
 * @param slug
 * @returns Kysely のビルドしたクエリオブジェクト
 */
export const categoryQuery = (slug: string) => {
  return (
    db
      .selectFrom("wp_terms as terms")

      // where
      .where("terms.slug", "=", slug)

      // select する対象
      .select([
        "terms.term_id as id",
        "terms.name as name",
        "terms.slug as slug",
      ])
  );
};
