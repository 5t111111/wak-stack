import { MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PageTitle } from "~/components/PageTitle";
import { AuthorRepository } from "~/server/adapter/database/author.repository.server";
import { GetAuthorListUseCase } from "~/server/usecases/author/index/get-author-list.usecase.server";
import { isProd } from "~/server/utils/environment.server";

export const loader = async () => {
  const useCase = new GetAuthorListUseCase(new AuthorRepository());
  const authors = await useCase.execute();
  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "author",
      }
    : [];

  return json({ authors }, { headers });
};

const pageTitle = "著者";

export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} | WACK Stack Remix Showcase` }];
};

export default function AuthorIndex() {
  const { authors } = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: pageTitle,
            href: "/author",
          },
        ]}
      />
      <main>
        <div className="px-4">
          <div className="mt-8">
            <PageTitle title={pageTitle} />
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {authors.map((author) => (
              <li
                key={author.id}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
              >
                <Link to={`/author/${author.id}`}>
                  <div className="flex flex-1 flex-col p-8">
                    <img
                      className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                      src={author.thumbnailUrl}
                      alt={`Thumbnail for ${author.name}`}
                    />
                    <h3 className="mt-6 text-sm font-medium text-gray-900">
                      {author.name}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
