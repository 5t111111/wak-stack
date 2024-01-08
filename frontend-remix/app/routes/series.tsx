import { MetaFunction, json, useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PageTitle } from "~/components/PageTitle";
import { SeriesCard } from "~/components/SeriesCard";
import { SeriesRepository } from "~/server/adapter/database/series.repository.server";
import { GetSeriesListUseCase } from "~/server/usecases/series/index/get-series-list.usecase.server";
import { isProd } from "~/server/utils/environment.server";

export const loader = async () => {
  const useCase = new GetSeriesListUseCase(new SeriesRepository());
  const series = await useCase.execute();

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "series",
      }
    : [];

  return json({ series }, { headers });
};

const pageTitle = "連載";

export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} | WACK Stack Remix Showcase` }];
};

export default function SeriesIndex() {
  const { series } = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: pageTitle,
            href: "/series",
          },
        ]}
      />
      <main>
        <div className="px-4">
          <div className="mt-8">
            <PageTitle title={pageTitle} />
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {series.map((item) => (
              <SeriesCard
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnailUrl={item.thumbnailUrl}
                postCount={item.postCount}
              />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
