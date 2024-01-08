import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PostCard } from "~/components/PostCard";
import { SeriesHeading } from "~/components/SeriesHeading";
import { SeriesRepository } from "~/server/adapter/database/series.repository.server";
import { NotFoundError } from "~/server/errors/not-found.error.server";
import {
  GetSeriesDetailUseCase,
  SeriesForSeriesDetail,
} from "~/server/usecases/series/[id]/get-series-detail.usecase.server";
import { isProd } from "~/server/utils/environment.server";
import { isNumber } from "~/server/utils/is-number.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error("id is not specified");
  }

  if (!isNumber(params.id)) {
    console.error(`${params.id} is not a number`);
    throw new Error("id is not a number");
  }

  const id = parseInt(params.id, 10);

  const useCase = new GetSeriesDetailUseCase(new SeriesRepository());

  let series: SeriesForSeriesDetail;

  try {
    series = await useCase.execute(id);
  } catch (e) {
    console.error(e);

    if (e instanceof NotFoundError) {
      throw new Error("Series is not found");
    }

    throw new Error("Something went wrong");
  }

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "series_.$id",
      }
    : [];

  return json({ series }, { headers });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }

  const { series } = data;

  return [
    {
      title: `${series.title} | WACK Stack Remix Showcase`,
    },
  ];
};

export default function SeriesDetail() {
  const { series: jsonifiedSeries } = useLoaderData<typeof loader>();

  const posts = jsonifiedSeries.posts.map((jsonifiedPost) => ({
    ...jsonifiedPost,
    publishedAt: new Date(jsonifiedPost.publishedAt),
  }));

  const series = {
    ...jsonifiedSeries,
    posts,
  };

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "連載",
            href: "/series",
          },
          {
            label: series.title,
            href: `/series/${series.id}`,
          },
        ]}
      />
      <main>
        <SeriesHeading
          title={series.title}
          thumbnailUrl={series.thumbnailUrl}
          description={series.description}
          author={{
            id: series.author.id,
            name: series.author.name,
            thumbnailUrl: series.author.thumbnailUrl,
          }}
        />
        <hr className="my-8 h-px border-0 bg-gray-200" />
        <div className="px-4">
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {series.posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                publishedAt={post.publishedAt}
                thumbnailUrl={post.thumbnailUrl}
              />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
