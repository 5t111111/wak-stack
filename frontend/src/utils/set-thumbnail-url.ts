/**
 * 引数のオブジェクトの thumbnailPath を、実際に URL として完全な thumbnailUrl に変換する
 * thumbnailPath が存在しない場合はダミー画像を設定することで、確実に有効な thumbnailUrl が存在する状態にする
 * @param item
 * @returns thumbnailUrl を設定した Post
 */
export const setThumbnailUrl = <
  T extends { thumbnailPath?: string | undefined },
>(
  item: T,
): Omit<T, "thumbnailPath"> & { thumbnailUrl: string } => {
  const wpHome = process.env.WP_HOME!;

  if (!wpHome) {
    console.error("WP_HOME が設定されていません。");
    throw new Error("WP_HOME が設定されていません。");
  }

  const thumbnailUrl = item.thumbnailPath
    ? `${wpHome}/app/uploads/${item.thumbnailPath}`
    : "https://via.placeholder.com/800x600";

  const newItem = {
    ...item,
    thumbnailUrl,
  };

  delete newItem.thumbnailPath;

  return newItem;
};
