export type PaginationMeta = {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

export type PaginatedList<T> = {
  items: T[];
  pagination: PaginationMeta;
};

/**
 * ページネーションのためのメタデータを作成する
 * 次のページが存在するかの判定をするためには、items の数を本来 itemsPerPage で取得する値より1つ多く取得し渡す必要がある
 * @param items ページネーションの対象となるリスト
 * @param page 現在のページ
 * @param itemsPerPage 1ページあたりのアイテム数
 * @returns ページネーションのためのメタデータ
 */
export const createPaginationMeta = <T>(
  items: T[],
  page: number,
  itemsPerPage: number,
): PaginationMeta => {
  const hasNextPage = items.length > itemsPerPage;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    hasPrevPage,
    hasNextPage,
  };
};
