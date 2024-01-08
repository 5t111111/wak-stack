import { NotFoundError } from "~/server/errors/not-found.error.server";
import { ISeriesRepository } from "~/server/interfaces/repositories/series.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Author } from "~/types/Author";
import { Post } from "~/types/Post";
import { Series } from "~/types/Series";

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
