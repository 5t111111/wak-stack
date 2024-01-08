import type { IAuthorRepository } from "../../../interfaces/repositories/author.repository.interface";
import type { Author } from "../../../types/Author";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";

export type AuthorsForAuthorIndex = (Pick<Author, "id" | "name"> & {
  thumbnailUrl: string;
})[];

export class GetAuthorListUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(): Promise<AuthorsForAuthorIndex> {
    const authors = await this.authorRepository.findMany();
    return authors
      .map((author) => setThumbnailUrl(author))
      .map((author) => {
        return {
          id: author.id,
          name: author.name,
          thumbnailUrl: author.thumbnailUrl,
        };
      });
  }
}
