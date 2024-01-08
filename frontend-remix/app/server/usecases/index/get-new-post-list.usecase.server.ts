import { IPostRepository } from "~/server/interfaces/repositories/post.repository.interface.server";
import { setThumbnailUrl } from "~/server/utils/set-thumbnail-url.server";
import { Post } from "~/types/Post";

export type PostsForIndex = (Pick<Post, "id" | "title" | "publishedAt"> & {
  thumbnailUrl: string;
})[];

export class GetNewPostListUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(): Promise<PostsForIndex> {
    const posts = await this.postRepository.findMany();
    return posts
      .map((post) => setThumbnailUrl(post))
      .map((post) => {
        return {
          id: post.id,
          title: post.title,
          publishedAt: post.publishedAt,
          thumbnailUrl: post.thumbnailUrl,
        };
      })
      .slice(0, 9);
  }
}
