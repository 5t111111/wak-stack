import { IAuthorRepository } from "~/server/interfaces/repositories/author.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Author } from "~/types/Author";

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
