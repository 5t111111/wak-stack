import { Series } from "~/types/Series";

export interface ISeriesRepository {
  findMany(): Promise<Series[]>;
  findOne(id: number): Promise<Series | null>;
}
