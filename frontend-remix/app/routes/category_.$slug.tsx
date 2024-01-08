import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PageTitle } from "~/components/PageTitle";
import { Pagination } from "~/components/Pagination";
import { PostCard } from "~/components/PostCard";
import { CategoryRepository } from "~/server/adapter/database/category.repository.server";
import { NotFoundError } from "~/server/errors/not-found.error.server";
import {
  CategoryForCategoryDetail,
  GetCategoryDetailUseCase,
} from "~/server/usecases/category/[slug]/get-category-detail.usecase.server";
import { isProd } from "~/server/utils/environment.server";
import { isNumber } from "~/server/utils/is-number.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    throw new Error("slug is not specified");
  }

  const pagedParam = new URL(request.url).searchParams.get("paged");

  let paged: number | undefined = undefined;

  if (pagedParam) {
    if (!isNumber(pagedParam)) {
      console.error("Invalid paged param (NaN):", pagedParam);
      throw new Error("Invalid paged param (NaN)");
    }

    paged = parseInt(pagedParam, 10);

    if (paged <= 0) {
      console.error("Invalid paged param (zero or smaller):", pagedParam);
      throw new Error("Invalid paged param (zero or smaller)");
    }
  }

  const useCase = new GetCategoryDetailUseCase(new CategoryRepository());

  let category: CategoryForCategoryDetail;

  try {
    category = await useCase.execute(params.slug, paged ?? 1);
  } catch (e) {
    console.error(e);

    if (e instanceof NotFoundError) {
      throw new Error("Category is not found");
    }

    throw new Error("Something went wrong");
  }

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "category_.$slug",
      }
    : [];

  return json({ category }, { headers });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }

  const { category } = data;

  return [
    {
      title: `${category.name} | WACK Stack Remix Showcase`,
    },
  ];
};

export default function CategoryDetail() {
  const { category: jsonifiedCategory } = useLoaderData<typeof loader>();

  const posts = jsonifiedCategory.postList.items.map((jsonifiedPost) => ({
    ...jsonifiedPost,
    publishedAt: new Date(jsonifiedPost.publishedAt),
  }));

  const category = {
    ...jsonifiedCategory,
    postList: {
      ...jsonifiedCategory.postList,
      items: posts,
    },
  };

  const pageTitle = category.name;

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: pageTitle,
            href: `/category/${category.slug}`,
          },
        ]}
      />
      <main>
        <div className="px-4">
          <div className="mt-8">
            <PageTitle title={pageTitle} />
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {category.postList.items.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                publishedAt={post.publishedAt}
                thumbnailUrl={post.thumbnailUrl}
              />
            ))}
          </ul>
          <Pagination
            prevLink={
              category.postList.pagination.hasPrevPage
                ? `/category/${category.slug}?paged=${
                    category.postList.pagination.currentPage - 1
                  }`
                : undefined
            }
            nextLink={
              category.postList.pagination.hasNextPage
                ? `/category/${category.slug}?paged=${
                    category.postList.pagination.currentPage + 1
                  }`
                : undefined
            }
          />
        </div>
      </main>
    </>
  );
}
