import { Post } from "~/types/Post";

export type PostFindManyOptions = {
  skip?: number;
  take?: number;
};

export interface IPostRepository {
  findMany(options?: PostFindManyOptions): Promise<Post[]>;
  findOne(id: number): Promise<Post | null>;
}
