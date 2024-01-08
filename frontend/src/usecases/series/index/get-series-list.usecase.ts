import type { ISeriesRepository } from "../../../interfaces/repositories/series.repository.interface";
import type { Series } from "../../../types/Series";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";

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
