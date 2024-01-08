import { ISeriesRepository } from "~/server/interfaces/repositories/series.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Series } from "~/types/Series";

export type SeriesForSeriesIndex = (Pick<Series, "id" | "title"> & {
  thumbnailUrl: string;
  postCount: number;
})[];

export class GetSeriesListUseCase {
  constructor(private readonly seriesRepository: ISeriesRepository) {}

  async execute(): Promise<SeriesForSeriesIndex> {
    const series = await this.seriesRepository.findMany();
    return series
      .map((item) => setThumbnailUrl(item))
      .map((item) => {
        return {
          id: item.id,
          title: item.title,
          thumbnailUrl: item.thumbnailUrl,
          postCount: item.postCount || 0, // postCount が undefined の場合は 0 にして数値を保証
        };
      });
  }
}
