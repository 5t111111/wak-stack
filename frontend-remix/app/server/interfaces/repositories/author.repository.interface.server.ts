import { Author } from "~/types/Author";

export interface IAuthorRepository {
  findMany(): Promise<Author[]>;
  findOne(id: number): Promise<Author | null>;
}
