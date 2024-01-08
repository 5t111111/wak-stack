import { describe, expect, test, vi } from "vitest";

import { PostRepository } from "./post.repository.server";

describe("PostRepository", () => {
  describe("findMany", () => {
    test("should return posts", async () => {
      // Mocking query
      vi.mock("./queries/post-list.query.server", async (importOriginal) => {
        const mod =
          await importOriginal<
            typeof import("./queries/post-list.query.server")
          >();
        return {
          ...mod,
          postListQuery: vi.fn().mockReturnValue({
            execute: async () => {
              return [
                {
                  id: 1,
                  title: "Title 1",
                  publishedAt: new Date("2024-01-01 01:00:00"),
                  modifiedAt: new Date("2024-01-01 02:00:00"),
                  thumbnailPath: "images/thumbnail1.jpg",
                },
                {
                  id: 2,
                  title: "Title 2",
                  publishedAt: new Date("2024-02-01 01:00:00"),
                  modifiedAt: new Date("2024-02-01 02:00:00"),
                  thumbnailPath: null,
                },
              ];
            },
          }),
        };
      });

      const repository = new PostRepository();
      const result = await repository.findMany();

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe("Title 1");
      expect(result[0].publishedAt).toEqual(new Date("2024-01-01 01:00:00"));
      expect(result[0].modifiedAt).toEqual(new Date("2024-01-01 02:00:00"));
      expect(result[0].thumbnailPath).toBe("images/thumbnail1.jpg");
      expect(result[1].id).toBe(2);
      expect(result[1].thumbnailPath).toBe(undefined);
    });
  });

  describe("findOne", () => {
    test("should return post object", async () => {
      // Mocking query
      vi.mock("./queries/post-detail.query.server", async (importOriginal) => {
        const mod =
          await importOriginal<
            typeof import("./queries/post-detail.query.server")
          >();
        return {
          ...mod,
          postDetailQuery: vi.fn().mockReturnValue({
            execute: async () => {
              return [
                {
                  id: 1,
                  title: "Title 1",
                  publishedAt: new Date("2024-01-01 01:00:00"),
                  modifiedAt: new Date("2024-01-01 02:00:00"),
                  thumbnailPath: "images/thumbnail1.jpg",
                  descriptionMeta: "Description 1",
                  categoryId: 1,
                  categoryName: "Category 1",
                  categorySlug: "category-1",
                  authorMeta: undefined,
                },
              ];
            },
          }),
        };
      });

      const repository = new PostRepository();
      const result = await repository.findOne(1);

      expect(result).not.toBe(null);
      expect(result?.id).toBe(1);
      expect(result?.title).toBe("Title 1");
      expect(result?.publishedAt).toEqual(new Date("2024-01-01 01:00:00"));
      expect(result?.modifiedAt).toEqual(new Date("2024-01-01 02:00:00"));
      expect(result?.thumbnailPath).toBe("images/thumbnail1.jpg");
      expect(result?.description).toBe("Description 1");
      expect(result?.category).not.toBe(undefined);
      expect(result?.category?.id).toBe(1);
      expect(result?.category?.name).toBe("Category 1");
      expect(result?.category?.slug).toBe("category-1");
      expect(result?.author).toBe(undefined);
    });
  });
});
