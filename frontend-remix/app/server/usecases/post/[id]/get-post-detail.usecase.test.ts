import { describe, expect, test } from "vitest";
import { Post } from "~/types/Post";

import { GetPostDetailUseCase } from "./get-post-detail.usecase.server";

describe("GetPostDetailUseCase", () => {
  describe("execute", () => {
    test("should return PostForPostDetail object", async () => {
      const repository = {
        findOne: async (): Promise<Post | null> => {
          return {
            id: 1,
            title: "Title 1",
            content: "Content 1",
            publishedAt: new Date("2024-01-01 01:00:00"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            modifiedAt: {} as any,
            thumbnailPath: "images/thumbnail1.jpg",
            description: "Description 1",
            category: {
              id: 1,
              name: "Category 1",
              slug: "category-1",
            },
            author: {
              id: 1,
              name: "Author 1",
              thumbnailPath: "images/author1.jpg",
            },
          };
        },
        findMany: async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return {} as any;
        },
      };

      const useCase = new GetPostDetailUseCase(repository);
      const result = await useCase.execute(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe("Title 1");
      expect(result.content).toBe("Content 1");
      expect(result.publishedAt).toEqual(new Date("2024-01-01 01:00:00"));
      expect(result.thumbnailUrl).toBe(
        "https://wp.example.com/app/uploads/images/thumbnail1.jpg",
      );
      expect(result.description).toBe("Description 1");
      expect(result.category.id).toBe(1);
      expect(result.category.name).toBe("Category 1");
      expect(result.category.slug).toBe("category-1");
      expect(result.author.id).toBe(1);
      expect(result.author.name).toBe("Author 1");
      expect(result.author.thumbnailUrl).toBe(
        "https://wp.example.com/app/uploads/images/author1.jpg",
      );
    });
  });
});
