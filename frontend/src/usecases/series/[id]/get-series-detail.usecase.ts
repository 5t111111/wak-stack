import { NotFoundError } from "../../../errors/not-found.error";
import type { ISeriesRepository } from "../../../interfaces/repositories/series.repository.interface";
import type { Author } from "../../../types/Author";
import type { Post } from "../../../types/Post";
import type { Series } from "../../../types/Series";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";

export type SeriesForSeriesDetail = Pick<
  Series,
  "id" | "title" | "description"
> & {
  thumbnailUrl: string;
  posts: (Pick<Post, "id" | "title" | "publishedAt"> & {
    thumbnailUrl: string;
  })[];
  author: Pick<Author, "id" | "name"> & { thumbnailUrl: string };
};

export class GetSeriesDetailUseCase {
  constructor(private readonly seriesRepository: ISeriesRepository) {}

  async execute(id: number): Promise<SeriesForSeriesDetail> {
    const series = await this.seriesRepository.findOne(id);

    if (!series) {
      throw new NotFoundError(`Series (id: ${id}) is not found.`);
    }

    // thumbnailUrl を設定する
    const seriesWithThumbnailUrl = setThumbnailUrl(series);

    // posts が配列であることを保証する
    const posts = seriesWithThumbnailUrl.posts ?? [];

    // posts の thumbnailUrl を設定する
    const postsWithThumbnailUrl = posts.map((post) => setThumbnailUrl(post));

    // author が設定されていない場合は想定外のデータなのでエラー
    if (!seriesWithThumbnailUrl.author) {
      throw new Error(`Post (id: ${id}): Author is not set.`);
    }

    // author の thumbnailUrl を設定する
    const authorWithThumbnailUrl = setThumbnailUrl(
      seriesWithThumbnailUrl.author,
    );

    return {
      id: seriesWithThumbnailUrl.id,
      title: seriesWithThumbnailUrl.title,
      thumbnailUrl: seriesWithThumbnailUrl.thumbnailUrl,
      description: seriesWithThumbnailUrl.description,
      posts: postsWithThumbnailUrl,
      author: authorWithThumbnailUrl,
    };
  }
}
