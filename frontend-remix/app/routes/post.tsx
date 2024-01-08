import { LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PageTitle } from "~/components/PageTitle";
import { Pagination } from "~/components/Pagination";
import { PostCard } from "~/components/PostCard";
import { PostRepository } from "~/server/adapter/database/post.repository.server";
import { GetPostListUseCase } from "~/server/usecases/post/index/get-post-list.usecase.server";
import { isProd } from "~/server/utils/environment.server";
import { isNumber } from "~/server/utils/is-number.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

  const useCase = new GetPostListUseCase(new PostRepository());
  const data = await useCase.execute(paged ?? 1);

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "post",
      }
    : [];

  return json(
    {
      items: data.items,
      pagination: data.pagination,
    },
    { headers },
  );
};

const pageTitle = "新着記事";

export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} | WACK Stack Remix Showcase` }];
};

export default function PostIndex() {
  const { items: jsonifiedItems, pagination } = useLoaderData<typeof loader>();

  const items = jsonifiedItems.map((jsonifiedItem) => ({
    ...jsonifiedItem,
    publishedAt: new Date(jsonifiedItem.publishedAt),
  }));

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: pageTitle,
            href: "/post",
          },
        ]}
      />
      <main>
        <div className="px-4">
          <div className="mt-8">
            <PageTitle title={pageTitle} />
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {items.map((post) => (
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
              pagination.hasPrevPage
                ? `/post?paged=${pagination.currentPage - 1}`
                : undefined
            }
            nextLink={
              pagination.hasNextPage
                ? `/post?paged=${pagination.currentPage + 1}`
                : undefined
            }
          />
        </div>
      </main>
    </>
  );
}
