import { describe, expect, test } from "vitest";
import type { Post } from "../../../types/Post";
import { GetPostListUseCase } from "./get-post-list.usecase";

describe("GetPostListUseCase", () => {
  describe("execute", () => {
    test("should return paginated result for first page", async () => {
      const repository = {
        findMany: async (): Promise<Post[]> => {
          return Array.from({ length: 10 }, (_, i) => {
            const id = i + 1;
            return {
              id: id,
              title: `Title ${id}`,
              content: `Content ${id}`,
              publishedAt: new Date(
                `2024-${String(id).padStart(2, "0")}-01 01:00:00`,
              ),
              modifiedAt: {} as any,
              thumbnailPath: `images/thumbnail${id}.jpg`,
            };
          });
        },
        findOne: async (id: number) => {
          return {} as any;
        },
      };

      const useCase = new GetPostListUseCase(repository);
      const result = await useCase.execute(1);

      expect(result.items.length).toBe(9);
      expect(result.items[0].id).toBe(1);
      expect(result.items[0].title).toBe("Title 1");
      expect(result.items[0].publishedAt).toEqual(
        new Date("2024-01-01 01:00:00"),
      );
      expect(result.items[0].thumbnailUrl).toBe(
        "https://wp.example.com/app/uploads/images/thumbnail1.jpg",
      );
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(false);
    });

    test("should return paginated result for intermidiate page", async () => {
      const repository = {
        findMany: async (): Promise<Post[]> => {
          return Array.from({ length: 10 }, (_, i) => {
            const id = i + 1;
            return {
              id: id,
              title: `Title ${id}`,
              content: `Content ${id}`,
              publishedAt: new Date(
                `2024-${String(id).padStart(2, "0")}-01 01:00:00`,
              ),
              modifiedAt: {} as any,
              thumbnailPath: `images/thumbnail${id}.jpg`,
            };
          });
        },
        findOne: async (id: number) => {
          return {} as any;
        },
      };

      const useCase = new GetPostListUseCase(repository);
      const result = await useCase.execute(2);

      expect(result.items.length).toBe(9);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });

    test("should return paginated result for last page", async () => {
      const repository = {
        findMany: async (): Promise<Post[]> => {
          return Array.from({ length: 8 }, (_, i) => {
            const id = i + 1;
            return {
              id: id,
              title: `Title ${id}`,
              content: `Content ${id}`,
              publishedAt: new Date(
                `2024-${String(id).padStart(2, "0")}-01 01:00:00`,
              ),
              modifiedAt: {} as any,
              thumbnailPath: `images/thumbnail${id}.jpg`,
            };
          });
        },
        findOne: async (id: number) => {
          return {} as any;
        },
      };

      const useCase = new GetPostListUseCase(repository);
      const result = await useCase.execute(3);

      expect(result.items.length).toBe(8);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
  });
});
