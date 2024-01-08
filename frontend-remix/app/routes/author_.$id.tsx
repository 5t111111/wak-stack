import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Breadcrumbs } from "~/components/Breadcrumb";
import { PageTitle } from "~/components/PageTitle";
import { PostCard } from "~/components/PostCard";
import { AuthorRepository } from "~/server/adapter/database/author.repository.server";
import { NotFoundError } from "~/server/errors/not-found.error.server";
import {
  AuthorForAuthorDetail,
  GetAuthorDetailUseCase,
} from "~/server/usecases/author/[id]/get-author-detail.usecase.server";
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

  const useCase = new GetAuthorDetailUseCase(new AuthorRepository());

  let author: AuthorForAuthorDetail;

  try {
    author = await useCase.execute(id);
  } catch (e) {
    console.error(e);

    if (e instanceof NotFoundError) {
      throw new Error("Author is not found");
    }

    throw new Error("Something went wrong");
  }

  const headers = isProd()
    ? {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
        "X-Cache-Control-Set-In": "author_.$id",
      }
    : [];

  return json({ author }, { headers });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }

  const { author } = data;

  return [
    {
      title: `${author.name} | WACK Stack Remix Showcase`,
    },
  ];
};

export default function AuthorDetail() {
  const { author: jsonifiedAuthor } = useLoaderData<typeof loader>();

  const posts = jsonifiedAuthor.posts.map((jsonifiedPost) => ({
    ...jsonifiedPost,
    publishedAt: new Date(jsonifiedPost.publishedAt),
  }));

  const author = {
    ...jsonifiedAuthor,
    posts,
  };
  const pageTitle = author.name;

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "著者",
            href: "/author",
          },
          {
            label: author.name,
            href: `/author/${author.id}`,
          },
        ]}
      />
      <main>
        <div className="px-4">
          <div className="mt-8">
            <PageTitle title={pageTitle} />
          </div>
          {author.thumbnailUrl && (
            <div className="flex flex-1 flex-col p-8">
              <img
                className="mx-auto h-60 w-60 flex-shrink-0 rounded-full md:h-96 md:w-96"
                src={author.thumbnailUrl}
                alt={`Thumbnail for ${author.name}`}
              />
            </div>
          )}
          <div className="mt-8">{author.profile}</div>
          <h2 className="mt-8 text-2xl font-bold">{author.name}の投稿</h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {author.posts.map((post) => (
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
