import { NotFoundError } from "../../../errors/not-found.error";
import type { IAuthorRepository } from "../../../interfaces/repositories/author.repository.interface";
import type { Author } from "../../../types/Author";
import type { Post } from "../../../types/Post";
import { setThumbnailUrl } from "../../../utils/set-thumbnail-url";

export type AuthorForAuthorDetail = Pick<Author, "id" | "name" | "profile"> & {
  thumbnailUrl: string;
  posts: (Pick<Post, "id" | "title" | "publishedAt"> & {
    thumbnailUrl: string;
  })[];
};

export class GetAuthorDetailUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(id: number): Promise<AuthorForAuthorDetail> {
    const author = await this.authorRepository.findOne(id);

    if (!author) {
      throw new NotFoundError(`Author (id: ${id}) is not found.`);
    }

    // profile が string であることを保証する (空文字列は許容する)
    const profile = author.profile ?? "";

    // thumbnailUrl を設定する
    const authorWithThumbnailUrl = setThumbnailUrl(author);

    // posts が配列であることを保証する
    const posts = authorWithThumbnailUrl.posts ?? [];

    // posts の thumbnailUrl を設定する
    const postsWithThumbnailUrl = posts.map((post) => setThumbnailUrl(post));

    return {
      id: authorWithThumbnailUrl.id,
      name: authorWithThumbnailUrl.name,
      thumbnailUrl: authorWithThumbnailUrl.thumbnailUrl,
      profile,
      posts: postsWithThumbnailUrl,
    };
  }
}
